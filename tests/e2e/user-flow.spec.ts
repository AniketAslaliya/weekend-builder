import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('User Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('complete user journey: signup → submit project → vote', async ({ page }) => {
    // Check accessibility on homepage
    await checkA11y(page);

    // Navigate to auth page
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/auth?mode=signup');

    // Fill signup form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[placeholder*="display name"]', 'Test User');
    
    // Submit form (mock success)
    await page.click('button[type="submit"]');
    
    // Should redirect to profile or home
    await expect(page).toHaveURL(/\/(profile|)/);

    // Navigate to events
    await page.click('text=Events');
    await expect(page).toHaveURL('/events');

    // Check accessibility on events page
    await checkA11y(page);

    // Click on an event
    await page.click('[data-testid="event-card"]');
    await expect(page).toHaveURL(/\/events\/\w+/);

    // Submit a project
    await page.click('text=Submit Project');
    
    // Fill project form
    await page.fill('input[placeholder*="project title"]', 'Test Project');
    await page.fill('textarea[placeholder*="describe your project"]', 'This is a test project description');
    
    // Add tags
    await page.fill('input[placeholder*="react, node.js"]', 'react');
    await page.click('text=Add');
    
    // Submit project
    await page.click('text=Submit Project');
    
    // Should see success message
    await expect(page.locator('text=project submitted successfully')).toBeVisible();

    // Navigate to projects page
    await page.click('text=Projects');
    await expect(page).toHaveURL('/projects');

    // Vote on a project
    await page.click('[data-testid="vote-button"]');
    
    // Should see vote confirmation
    await expect(page.locator('text=vote submitted')).toBeVisible();
  });

  test('admin creates event → user sees it in upcoming tab', async ({ page }) => {
    // Mock admin login
    await page.goto('/admin');
    
    // Create new event
    await page.click('text=Create Event');
    
    // Fill event form
    await page.fill('input[placeholder*="event title"]', 'Test Admin Event');
    await page.fill('input[placeholder*="theme"]', 'Test Theme 🎯');
    await page.selectOption('select', 'AI');
    
    // Set dates
    await page.fill('input[type="datetime-local"]', '2025-02-01T09:00');
    
    // Save event
    await page.click('text=Create Event');
    
    // Navigate to events page as regular user
    await page.goto('/events');
    
    // Check upcoming tab
    await page.click('text=Upcoming');
    
    // Should see the new event
    await expect(page.locator('text=Test Admin Event')).toBeVisible();
  });

  test('rate limit returns 429 after flood voting', async ({ page }) => {
    // Navigate to projects
    await page.goto('/projects');
    
    // Mock user login
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: { id: 'test-user', email: 'test@example.com' }
      }));
    });
    
    // Attempt to vote multiple times rapidly
    for (let i = 0; i < 35; i++) {
      await page.click('[data-testid="vote-button"]');
      await page.waitForTimeout(100);
    }
    
    // Should see rate limit message
    await expect(page.locator('text=rate limit exceeded')).toBeVisible();
  });

  test('mobile navigation works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile navigation is visible
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    
    // Test navigation items
    await page.click('[data-testid="mobile-nav"] >> text=Events');
    await expect(page).toHaveURL('/events');
    
    await page.click('[data-testid="mobile-nav"] >> text=Projects');
    await expect(page).toHaveURL('/projects');
    
    // Check touch targets are large enough (44x44px minimum)
    const navButtons = page.locator('[data-testid="mobile-nav"] button');
    const count = await navButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = navButtons.nth(i);
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('accessibility compliance', async ({ page }) => {
    // Test multiple pages for accessibility
    const pages = ['/', '/events', '/projects', '/leaderboard'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    }
  });

  test('performance metrics', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: Record<string, number> = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              vitals.FCP = entry.toJSON().firstContentfulPaint;
              vitals.LCP = entry.toJSON().largestContentfulPaint;
            }
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['navigation'] });
        
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    console.log('Performance metrics:', metrics);
  });
});