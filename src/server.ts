import express, { Request, Response } from 'express';
import { scrapeNaverProduct } from './scraper';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Naver Scraper API is active. Access /naver?productUrl=YOUR_URL');
});

app.get('/naver', async (req: Request, res: Response) => {
    const productUrl = req.query.productUrl as string;

    if (!productUrl) {
        return res.status(400).json({ error: 'productUrl query parameter is required' });
    }

    try {
        console.log(`Starting scrape for: ${productUrl}`);
        const data = await scrapeNaverProduct(productUrl);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ 
            error: 'Scraping operation failed', 
            details: error.message,
            tip: 'If you see a socket error, ensure the proxy credentials are valid.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🔗 Test URL: http://localhost:${PORT}/naver?productUrl=https://smartstore.naver.com/rainbows9030/products/11102379008\n`);
});