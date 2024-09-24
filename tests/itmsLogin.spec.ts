import { test, expect } from '@playwright/test';
import apiTagsData from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
    // await page.goto('https://dev.pollex.com.tw/itms');
});

test('has title', async ({ page, request }) => {
    await request.post('https://dev.pollex.com.tw/itms/api/logout')
    await page.goto('https://dev.pollex.com.tw/itms/login');
    await page.waitForSelector('.loginFormGroup-loginBtn');

    expect(await page.title()).toBe('ITMS_登入');
    await expect(page.locator('.itms-title')).toContainText('ITMS 資訊服務管理平台');
});

test('route to login page if no login', async ({ page, request }) => {
    await request.post('https://dev.pollex.com.tw/itms/api/logout')

    const pageToCheck = [
        'personalTodoList',
        'advSearch',
        'deploySearch',
        'faq',
        'attachmentHelper',
        'manpowerMaintenance',
        'reports',
        'taskAssign',
        'roleSetting',
        'userSetting',
        'otherSettings',
        'demandList/1',
    ]

    for (const pagePath of pageToCheck) {
        await page.goto(`https://dev.pollex.com.tw/itms/${pagePath}`);
        await page.waitForURL('**/itms/login');
    }

});