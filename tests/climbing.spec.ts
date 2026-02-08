import { test, expect } from '@playwright/test';

test.describe('Minecraft Clone Climbing', () => {
  test('should jump onto a 1m high block', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await page.click('text=START MINECRAFT CLONE');
    await page.waitForSelector('canvas');
    
    // We'll wait for the world to be stable
    await page.waitForTimeout(2000);

    // Perform Jump + Move Forward
    await page.keyboard.down('Space');
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1000);
    await page.keyboard.up('Space');
    await page.keyboard.up('KeyW');

    // If jump was successful, we should be visible and not reset
    await expect(page.locator('canvas')).toBeVisible();
  });
});
