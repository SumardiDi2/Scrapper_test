Naver Commerce Product Scraper API

Features
- Concurrent Fetching: Uses Promise.all to fetch product data and benefit details simultaneously, ensuring response times under 6 seconds.
- Anti-Bot Resilience: Implements randomized human-like delays (1s–3s) and dynamic User-Agent rotation.
- Proxy Support: Pre-configured for HttpsProxyAgent integration with a toggle for environment flexibility.

Local Setup Instructions
1. Prerequisites
Node.js: v18 or higher recommended.

npm: Installed with Node.js.

2. Installation
- Clone the repository
- Install dependencies: npm install

3. Configuration
Open src/scraper.ts to configure the proxy settings:

USE_PROXY: Set to true to use the ThorData residential proxy.

Note: If you encounter EPROTO SSL handshake errors, set USE_PROXY = false to test the logic using your local IP.

4. Running the Project
Development Mode (Hot Reload):
node --loader tsm src/server.ts

Production Build:
npm run build
npm run start

Usage
API Endpoint
GET /naver?query=<PRODUCT_URL>

Example Request
http://localhost:3000/naver?query=https://smartstore.naver.com/rainbows9030/products/11102379008

Expected Responses
Success (200): Returns a JSON object containing product and benefits data.

Rate Limited (429): Occurs when Naver detects automated traffic from your IP.

Proxy Error: Returns a clear diagnostic message if the SSL handshake with the proxy fails.

Technical Notes
ID Extraction: The scraper uses RegEx to extract the channelUid from the initial page load to target internal API endpoints.

Infrastructure: During testing, the provided trial proxy credentials returned write EPROTO errors. The code includes custom error handling to catch and log these infrastructure failures specifically.
