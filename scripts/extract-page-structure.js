// Analyseert de live squerist.nl homepage en legt de structuur vast
// (headings, navigatielinks, knoppen, formulieren) als JSON.
// Deze JSON dient als input voor de AI-teststap in de workflow.

const { chromium } = require('playwright');
const fs = require('fs');

const TARGET_URL = 'https://www.squerist.nl';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const title = await page.title();

  const headings = await page.$$eval('h1, h2, h3', els =>
    els.map(e => e.textContent.trim()).filter(Boolean)
  );

  const navLinks = await page.$$eval('nav a, header a', els =>
    els
      .map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') }))
      .filter(l => l.text)
  );

  const buttons = await page.$$eval('button, [role="button"], input[type=submit]', els =>
    els.map(e => (e.textContent || e.value || '').trim()).filter(Boolean)
  );

  const forms = await page.$$eval('form', forms =>
    forms.map(f => ({
      action: f.getAttribute('action'),
      fields: Array.from(f.querySelectorAll('input, textarea, select')).map(i => ({
        name: i.getAttribute('name'),
        type: i.getAttribute('type') || i.tagName.toLowerCase(),
      })),
    }))
  );

  const summary = {
    url: TARGET_URL,
    title,
    headings: headings.slice(0, 15),
    navLinks: navLinks.slice(0, 20),
    buttons: buttons.slice(0, 15),
    forms,
  };

  fs.writeFileSync('page-summary.json', JSON.stringify(summary, null, 2));
  console.log('Paginastructuur vastgelegd:');
  console.log(JSON.stringify(summary, null, 2));

  await browser.close();
})();
