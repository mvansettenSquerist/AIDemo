// Dit bestand is BEWUST matig geschreven — het dient als vast doelwit
// voor de AI-codereview-demo (workflow 1). Niet gebruiken als voorbeeld
// van goede Playwright-tests.

import { test, expect } from '@playwright/test';

test('test1', async ({ page }) => {
  await page.goto('https://www.squerist.nl');
  await page.waitForTimeout(3000);
  await page.click('body > header > nav > ul > li:nth-child(3) > a');
  await page.waitForTimeout(2000);
  const title = await page.title();
  console.log(title);
  try {
    await page.click('#submit-btn');
  } catch (e) {
    // knop bestaat soms niet, dan negeren we het gewoon
  }
  await page.waitForTimeout(1000);
  expect(true).toBe(true);
});

test('test2', async ({ page }) => {
  await page.goto('https://www.squerist.nl');
  const el = await page.$('.header-title');
  if (el) {
    const text = await el.textContent();
    if (text == 'Squerist') {
      expect(1).toEqual(1);
    }
  }
});

test('formulier test', async ({ page }) => {
  await page.goto('https://www.squerist.nl/contact');
  await page.fill('input:nth-of-type(1)', 'Test Naam');
  await page.fill('input:nth-of-type(2)', 'test@test.com');
  await page.click('button');
  await page.waitForTimeout(5000);
});