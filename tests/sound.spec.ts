import { test, expect } from '@playwright/test';

test.describe('Minecraft Clone Sound', () => {
  test('should have a background music element', async ({ page }) => {
    await page.goto('/');
    await page.click('text=START MINECRAFT CLONE');
    // Check if an audio element exists
    const audio = page.locator('audio#bgm');
    await expect(audio).toBeAttached();
    
    // Check source
    await expect(audio).toHaveAttribute('src', /mp3/);
  });
});
