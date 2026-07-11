const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/tentang-kami');
  
  const result = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h4'));
    const foresight = headings.find(h => h.textContent === 'FORESIGHT');
    if (!foresight) return 'Not found';
    
    // The h4 is inside `relative z-10 flex flex-col items-start px-2`
    const innerWrapper = foresight.parentElement;
    // The parent is `group relative px-6 md:px-8 py-8 ...`
    const outerWrapper = innerWrapper.parentElement;
    
    return {
      outerClass: outerWrapper.className,
      outerPaddingLeft: window.getComputedStyle(outerWrapper).paddingLeft,
      outerWidth: window.getComputedStyle(outerWrapper).width,
      innerClass: innerWrapper.className,
      innerPaddingLeft: window.getComputedStyle(innerWrapper).paddingLeft,
      innerWidth: window.getComputedStyle(innerWrapper).width,
      h4MarginLeft: window.getComputedStyle(foresight).marginLeft
    };
  });
  
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
