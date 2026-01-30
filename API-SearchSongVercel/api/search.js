export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Busca vazia" });
    
    const url = `https://apis.roproxy.com/toolbox-service/v1/marketplace/3?keyword=${encodeURIComponent(q)}&numResults=30`;

    try {
        const response = await fetch(url, {
            headers: { 
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" 
            }
        });

        const data = await response.json();

        const results = (data.data || [])
            .filter(item => item && item.asset)
            .map(item => ({
                AssetId: item.asset.id,
                Name: item.asset.name
            }));

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: "Falha na conexão", details: err.message });
    }
}
