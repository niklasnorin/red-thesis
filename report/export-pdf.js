const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://niklasnorin.github.io/thesis/report/index.html', {waitUntil: 'networkidle2'});
  await page.pdf({
    path: 'thesis-report.pdf', 
    format: 'A4',
    displayHeaderFooter: false,
    headerTemplate: '',
    footerTemplate: '',
    margin: {
      top: "3cm",
      bottom: "3cm",
    }
  });

  await browser.close();
})();