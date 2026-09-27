import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
  projects: [...['chromium', 'firefox', 'webkit'].map((browserName) => ({ name: browserName, use: { browserName } })), { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } }],
});
