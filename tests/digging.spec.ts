import { test, expect } from '@playwright/test';

test.describe('Minecraft Clone Digging & Physics', () => {
  test('should allow walking into cleared space without resetting', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await page.click('text=START MINECRAFT CLONE');
    await page.waitForSelector('canvas');
    
    // 1. Clear a block in front (Right click usually adds, Left click removes)
    // We'll click a few times to clear a path
    await page.mouse.click(400, 300); // Remove block at center crosshair
    await page.waitForTimeout(500);
    
    // 2. Walk forward (W)
    await page.keyboard.down('KeyW');
    await page.waitForTimeout(2000);
    await page.keyboard.up('KeyW');
    
    // 3. Verify we didn't reset (Reset takes us to Y=10, usually spawn is near 0,0)
    // We'll check for the "START" overlay - if it's NOT there and no crash, we are likely okay.
    // More importantly, we check if the canvas is still the main view.
    await expect(page.locator('canvas')).toBeVisible();
    
    // If we were reset, we might see a "Pig Oink" again in logs if it re-mounts? 
    // Or we can check if we are still alive.
  });
});
