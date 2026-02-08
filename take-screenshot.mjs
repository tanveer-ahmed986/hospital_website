import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  try {
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

    console.log('Taking screenshot...');
    await page.screenshot({
      path: 'homepage-screenshot.png',
      fullPage: false
    });

    console.log('Screenshot saved to homepage-screenshot.png');

    // Scroll and take more screenshots
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'homepage-middle.png' });

    await page.evaluate(() => window.scrollTo(0, 1600));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'homepage-bottom.png' });

    console.log('All screenshots taken successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
