import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  // Desktop
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: path.join(process.cwd(), 'artifacts/visual-validation/header-desktop-top.png') });
  
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(500); // wait for transition
  await page.evaluate(() => window.scrollBy(0, -10)); // scroll up slightly to trigger glass
  await page.waitForTimeout(500); // wait for transition
  await page.screenshot({ path: path.join(process.cwd(), 'artifacts/visual-validation/header-desktop-glass.png') });
  
  await page.close();

  // Mobile
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForTimeout(1000);
  
  await mobilePage.screenshot({ path: path.join(process.cwd(), 'artifacts/visual-validation/header-mobile-top.png') });
  
  await mobilePage.evaluate(() => window.scrollBy(0, 100));
  await mobilePage.waitForTimeout(500);
  await mobilePage.evaluate(() => window.scrollBy(0, -10));
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(process.cwd(), 'artifacts/visual-validation/header-mobile-glass.png') });
  
  await browser.close();
})();
