export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "empty search" });

    const url = `https://catalog.rbxproxy.com/v1/search/items/details?Category=9&AssetTypeId=3&Keyword=${encodeURIComponent(q)}&Limit=30`;

    try {
        const response = await fetch(url, {
            headers: { 
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0" 
            }
        });

        const data = await response.json();

        const results = (data.data || [])
            .map(item => ({
                AssetId: item.id,
                Name: item.name
            }));

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}