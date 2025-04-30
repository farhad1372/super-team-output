import puppeteer from 'puppeteer';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export async function takeScreenshot(coin) {
    let browser = null;
    try {
        // Open Browser
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // run on server
            // executablePath: executablePath(),
        });
        const page = await browser.newPage();
        // Options
        await page.setViewport({
            width: 1280,
            height: 720,
        });
        // const url = `https://app.bubblemaps.io/sol/token/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE`;
        const url = `https://app.bubblemaps.io/sol/token/${coin}`; //* Example:  85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ
        // Go to the page
        await page.goto(url, { waitUntil: "networkidle2" }); // صبر می‌کنه تا صفحه کامل لود بشه
        await page.waitForSelector("svg#svg", { timeout: 30000 });
        await delay(2000);
        const svgBounds = await page.evaluate(() => {
            const svg = document.querySelector('svg#svg');
            if (!svg)
                return null;
            const { x, y, width, height } = svg.getBoundingClientRect();
            return { x, y, width, height };
        });
        if (!svgBounds)
            return null;
        // Takes Screenshot
        let screenshotBuffer = "";
        screenshotBuffer = await page.screenshot({
            // fullPage: false,
            clip: {
                x: svgBounds.x,
                y: svgBounds.y,
                width: svgBounds.width,
                height: svgBounds.height,
            },
            encoding: "base64",
            type: 'jpeg',
            quality: 80,
        });
        // const screenshotBase64 = screenshotBuffer.toString();
        // Close Browser
        await browser.close();
        if (!screenshotBuffer)
            return null;
        else
            return `data:image/jpeg;base64,${screenshotBuffer}`;
    }
    catch (error) {
        console.error('Error in takeScreenshot:', error);
        return null;
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}
