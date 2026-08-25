import { test, expect } from '@playwright/test';

const BASE = 'https://www.squerist.nl';

const NAV_LINKS = [
  { text: 'Squerist', href: '/' },
  { text: 'Werken bij', href: '/werken-bij' },
  { text: 'Diensten', href: '/diensten' },
  { text: 'Over ons', href: '/over-ons' },
  { text: 'Klantcases', href: '/klantverhalen' },
  { text: 'Evenementen', href: '/events' },
  { text: 'Contact', href: '/contact' },
  { text: 'Over onze cultuur', href: '/great-place-to-work' },
];

test.describe('Squerist homepage basic checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  });

  test('page title and core headings present', async ({ page }) => {
    await expect(page).toHaveTitle('Squerist');

    await expect(
      page.getByRole('heading', {
        name: 'Wij zijn Squerist, specialist in Software testen en kwaliteitsverbetering',
      })
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Waar Squeristers goed in zijn' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Het gaat ons om jou als mens' })).toBeVisible();
  });

  test('navigation links exist and have correct href attributes', async ({ page }) => {
    for (const item of NAV_LINKS) {
      const link = page.getByRole('link', { name: item.text });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', item.href);
    }
  });

  test('navigation links navigate to expected paths', async ({ page }) => {
    for (const item of NAV_LINKS) {
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      const link = page.getByRole('link', { name: item.text });
      await expect(link).toBeVisible();
      await Promise.all([
        page.waitForLoadState('load'),
        link.click(),
      ]);
      const pathname = new URL(page.url()).pathname;
      // normalize trailing slash: treat '/' and '' as root
      const normalizedExpected = item.href === '/' ? '/' : item.href;
      expect(pathname).toBe(normalizedExpected);
    }
  });

  test('menu button is present and interactive', async ({ page }) => {
    const menu = page.getByRole('button', { name: 'Menu' });
    await expect(menu).toBeVisible();
    await expect(menu).toBeEnabled();
    await menu.click();
    // if the button exposes aria-expanded, assert it's a boolean string
    const aria = await menu.getAttribute('aria-expanded');
    if (aria !== null) {
      expect(['true', 'false']).toContain(aria);
    }
  });

  test('no forms on the page (as specified)', async ({ page }) => {
    await expect(page.locator('form')).toHaveCount(0);
  });
});

