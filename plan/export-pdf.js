const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080', {waitUntil: 'networkidle2'});
  await page.pdf({
    path: 'planning-report.pdf', 
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