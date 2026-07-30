const puppeteer = require('puppeteer');
const path = require('path');

const screenshotsDir = __dirname;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Users\\tomin\\.cache\\puppeteer\\chrome\\win64-151.0.7922.71\\chrome-win64\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Screen 1: Upload
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await sleep(1000);
  await page.screenshot({ path: path.join(screenshotsDir, 'screen1-upload.png'), fullPage: false });
  console.log('screen1 captured');

  // Click demo button - find by text containing 'mẫu'
  const buttons = await page.$$('button');
  let demoClicked = false;
  for (const btn of buttons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && text.includes('m\u1eabu')) { await btn.click(); demoClicked = true; break; }
  }
  if (!demoClicked) {
    // Try span or div with click
    const allElems = await page.$$('[role="button"], a, button, .btn');
    for (const el of allElems) {
      const text = await el.evaluate(el => el.textContent);
      if (text && text.includes('m\u1eabu')) { await el.click(); break; }
    }
  }
  await sleep(1000);
  await page.screenshot({ path: path.join(screenshotsDir, 'screen1b-demo-selected.png'), fullPage: false });
  console.log('screen1b captured');

  // Click Tiếp tục
  const tiepTucBtns = await page.$$('button');
  for (const btn of tiepTucBtns) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && (text.includes('Ti\u1ebfp t\u1ee5c') || text.includes('Tiep tuc'))) { await btn.click(); break; }
  }
  await sleep(1500);
  await page.screenshot({ path: path.join(screenshotsDir, 'screen2-config.png'), fullPage: false });
  console.log('screen2 captured');

  // Click Bắt đầu tóm tắt
  const allBtns = await page.$$('button');
  for (const btn of allBtns) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && (text.includes('t\u00f3m t\u1eaft') || text.includes('B\u1eaft \u0111\u1ea7u') || text.includes('tom tat'))) { await btn.click(); break; }
  }
  await sleep(500);
  await page.screenshot({ path: path.join(screenshotsDir, 'screen3-processing.png'), fullPage: false });
  console.log('screen3 captured');

  // Wait for results
  await sleep(15000);
  await page.screenshot({ path: path.join(screenshotsDir, 'screen4-results.png'), fullPage: false });
  console.log('screen4 captured');

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 600));
  await sleep(500);
  await page.screenshot({ path: path.join(screenshotsDir, 'screen4b-results-bottom.png'), fullPage: false });
  console.log('screen4b captured');

  await browser.close();
  console.log('All screenshots done!');
}

capture().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
