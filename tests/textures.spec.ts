import { test, expect } from '@playwright/test';

test('should render with textures without errors', async ({ page }) => {
  test.setTimeout(60000);
  const logs: string[] = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', err => logs.push(err.message));

  await page.goto('/');
  await page.click('text=START MINECRAFT CLONE');
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2000);
  
  const errors = logs.filter(log => {
    const lower = log.toLowerCase();
    return (lower.includes('error') || lower.includes('failed')) && 
           !lower.includes('audio play failed') &&
           !lower.includes('play() failed') &&
           !lower.includes('gpu stall') &&
           !lower.includes('notsameorigin');
  });
  if (errors.length > 0) console.log('UNEXPECTED ERRORS:', errors);
  expect(errors.length).toBe(0);
});