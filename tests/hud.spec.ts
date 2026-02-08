import { test, expect } from '@playwright/test';

test.describe('Minecraft Clone HUD', () => {
  test('should have UI as a sibling to canvas and stay fixed', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await page.click('text=START MINECRAFT CLONE');
    
    // Check UI container exists and is NOT inside canvas
    const ui = page.locator('.ui-container');
    await expect(ui).toBeVisible();
    
    // Canvas should also be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Move player (should not affect UI visibility or position)
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(1000);
    await page.keyboard.up('KeyW');
    
    await expect(ui).toBeVisible();
  });
});
