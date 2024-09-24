import { test, expect } from '@playwright/test';
import apiTagsData from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
  // const apiTagsData = {
  //   tags: ['test', 'playwright', 'conduit']
  // }
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(apiTagsData),
    });
  })

  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch();
    const resBody = await response.json();
    resBody.articles[0].title = 'this is MOCK title';
    resBody.articles[0].description = 'this is MOCK description';

    await route.fulfill({
      status: 200,
      body: JSON.stringify(resBody),
    });
  })


  await page.goto('https://conduit.bondaracademy.com/');

  await page.waitForTimeout(1000);
});
// end beforeEach =============================

test('has title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  
  await expect(page.locator('app-article-list h1').first()).toContainText('this is MOCK title');
  await expect(page.locator('app-article-list p').first()).toContainText('this is MOCK description');
});
// end test =============================
