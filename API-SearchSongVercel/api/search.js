export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Busca vazia" });

    // Trocando para o RoProxy que é mais estável na Vercel
    const url = `https://catalog.roproxy.com/v1/search/items/details?Category=9&AssetTypeId=3&Keyword=${encodeURIComponent(q)}&Limit=30`;

    try {
        const response = await fetch(url, {
            headers: { 
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0" 
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na API do Roblox: ${response.status}`);
        }

        const data = await response.json();

        // Mapeando os resultados com segurança
        const results = (data.data || []).map(item => ({
            AssetId: item.id,
            Name: item.name
        }));

        // Habilitando o CORS para o Roblox conseguir ler os dados
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: "Falha na busca", details: err.message });
    }
}
