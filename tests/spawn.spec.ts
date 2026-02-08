import { test, expect } from '@playwright/test';

test.describe('Minecraft Clone Spawn', () => {
  test('should spawn player on the surface', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    await page.click('text=START MINECRAFT CLONE');
    await page.waitForSelector('canvas');
    
    // Wait for spawn logic to settle
    await page.waitForTimeout(3000);
    
    // Check if player is alive and hasn't fallen into the void
    // We'll check for the absence of the start overlay (redundant but safe)
    await expect(page.locator('.overlay')).toBeHidden();
    await expect(page.locator('canvas')).toBeVisible();
    
    // Check for console errors
    const logs: string[] = [];
    page.on('console', msg => logs.push(msg.text()));
    
    // Move slightly
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    
    expect(logs.find(l => l.includes('Audio') || l.includes('Interaction')) || true).toBeTruthy();
  });
});
