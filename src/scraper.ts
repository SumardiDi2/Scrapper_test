// src/scraper.ts
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as https from 'https';
import UserAgent from 'user-agents';

const PROXY_URL = `http://td-customer-mrscraperTrial-country-kr:P3nNRQ8C2@6n8xhsmh.as.thordata.net:9999`;
const agent = new HttpsProxyAgent(PROXY_URL);

const USE_PROXY = false; 

export async function scrapeNaverProduct(productUrl: string) {
    const ua = new UserAgent({ deviceCategory: 'desktop' });
    const headers = { 'User-Agent': ua.toString(), 'Referer': 'https://smartstore.naver.com/' };

    try {
        await new Promise(res => setTimeout(res, Math.floor(Math.random() * 2000) + 1000));

        const mainPage = await axios.get(productUrl, {
            httpsAgent: USE_PROXY ? agent : undefined,
            headers: headers,
            timeout: 15000
        });

        const channelUid = mainPage.data.match(/"channelUid":"(.*?)"/)?.[1];
        const productId = productUrl.split('/').pop()?.split('?')[0];

        if (!channelUid || !productId) throw new Error("Could not extract IDs");

        const [detailsRes, benefitsRes] = await Promise.all([
            axios.get(`https://smartstore.naver.com/i/v2/channels/${channelUid}/products/${productId}?withWindow=false`, {
                httpsAgent: USE_PROXY ? agent : undefined,
                headers: headers
            }),
            axios.get(`https://smartstore.naver.com/n/v1/products/${productId}/benefits/by-product`, {
                httpsAgent: USE_PROXY ? agent : undefined,
                headers: headers
            })
        ]);

        return { product: detailsRes.data, benefits: benefitsRes.data };
    } catch (error: any) {
        let errorMessage = error.message;
        if (errorMessage.includes('EPROTO')) {
            console.error("CRITICAL: The ThorData proxy is rejecting the SSL handshake.");
            errorMessage = "Proxy SSL Handshake failed. Please try again or verify proxy credentials.";
        } else if (error.response?.status === 429) {
            console.error("Rate limited by Naver.");
            errorMessage = "Rate limit exceeded (HTTP 429). Naver has temporarily blocked this IP.";
        }
        throw new Error(errorMessage);
    }
}