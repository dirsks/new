// by @TheOfficialDirsRBX

export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "empty search" });

    const buster = Math.floor(Math.random() * 99999);
    
    const urls = [
        `https://apis.roproxy.com/toolbox-service/v1/marketplace/3?keyword=${encodeURIComponent(q)}&numResults=20&cb=${buster}`,
        `https://catalog.roproxy.com/v1/search/items/details?Category=9&AssetTypeId=3&Keyword=${encodeURIComponent(q)}&Limit=20&cb=${buster}`
    ];
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    for (const url of urls) {
        try {
            const response = await fetch(url, {
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) continue;

            const data = await response.json();
            const rawData = data.data || [];

            if (rawData.length > 0) {
                // const results = rawData.map(item => ({
                //     AssetId: item.asset ? item.asset.id : item.id,
                //     Name: item.asset ? item.asset.name : (item.name || "Unnamed")
                // }));
                const results = rawData.map(item => {
    const assetId =
        item.asset?.id ??
        item.id ??
        0;

    const name =
        item.asset?.name ??
        item.name ??
        item.displayName ??
        `Audio ${assetId}`;

    return {
        AssetId: assetId,
        Name: name
    };
});

                return res.status(200).json(results);
            }
        } catch (err) {
            console.error("try failed for:", url);
        }
    }

    return res.status(200).json([{ 
        AssetId: 0, 
        Name: "servers are busy" 
    }]);
}
