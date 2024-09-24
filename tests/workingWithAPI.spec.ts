import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {

  await page.goto('https://conduit.bondaracademy.com/');
  
  // move to auth.setup.ts
  // await page.getByText('Sign in').click();
  // await page.getByRole('textbox', { name: 'Email' }).fill('pwbentest@test.com')
  // await page.getByRole('textbox', { name: 'Password' }).fill('pwbentest1234')
  // await page.getByRole('button').click();

  await page.waitForTimeout(1000);
});
// end beforeEach =============================


test('delete article', async ({ page, request }) => {
  // const accessToken = await getAccessToken(request);

  const articleAddRes = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "This is a test title",
        "description": "test description",
        "body": "hello world",
        "tagList": []
      }
    },
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }
  })
  expect(articleAddRes.status()).toBe(201);

  await page.getByText('Global Feed').click();
  await page.getByText('This is a test title').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.getByText('Global Feed').click();
})
// end test =============================

test('create article', async ({ page, request }) => {
  await page.getByText('New Article').click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome');
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('About the Playwright');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)'}).fill('We like to use Playwright for testing');
  await page.getByRole('button', { name: 'Publish Article' }).click();

  const articleRes = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
  const articleResBody = await articleRes.json();
  const slugId = articleResBody.article.slug;

  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome');
  await page.getByText('Home').click();
  await page.getByText('Global Feed').click();

  // const accessToken = await getAccessToken(request);
  const deleteArticleRes = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    // headers: {
    //   Authorization: `Token ${accessToken}`
    // }
  })
  expect(deleteArticleRes.status()).toBe(204);

  await page.getByText('Global Feed').click();

})
// end test =============================

/* use extraHTTPHeaders with auth.setup.ts: process.env['ACCESS_TOKEN'] = accessToken; 
 * so no need to use this function
 */
// async function getAccessToken(request) {
//   const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
//     data: {
//       "user": {
//         "email": "pwbentest@test.com",
//         "password": "pwbentest1234"
//       }
//     }
//   })
//   const responseBody = await response.json();
//   const accessToken = responseBody.user.token;
//   return accessToken;
// }