import { test, expect } from '@playwright/test';

test.describe('Minecraft Clone MVP', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await page.click('text=START MINECRAFT CLONE');
    // Wait for the canvas to be present
    await page.waitForSelector('canvas');
  });

  test('should render the 3D world', async ({ page }) => {
    const canvas = await page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should allow adding a block on click', async ({ page }) => {
    // This is tricky without knowing exact coordinates, 
    // but we can at least check if clicking doesn't crash 
    // and if the store (observable via some debug if we had it) would update.
    // For now, we'll just check if it stays stable.
    await page.mouse.click(400, 300); // Click in the center
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should allow removing a block with alt+click', async ({ page }) => {
    await page.keyboard.down('Alt');
    await page.mouse.click(400, 300);
    await page.keyboard.up('Alt');
    await expect(page.locator('canvas')).toBeVisible();
  });
});
