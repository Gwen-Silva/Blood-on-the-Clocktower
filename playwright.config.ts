import { defineConfig, devices } from '@playwright/test'

const baseURL =
  process.env.E2E_BASE_URL || 'http://127.0.0.1:4173/Blood-on-the-Clocktower/'
export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  workers: 1,
  use: {
    ...devices['Pixel 7'],
    baseURL,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-320',
      testMatch: /(ui-refinement|backup-restore|effect-correction)\.spec\.ts/,
      use: { viewport: { width: 320, height: 568 } },
    },
    ...[
      [360, 800],
      [390, 844],
      [412, 915],
    ].map(([width, height]) => ({
      name: `mobile-${width}`,
      use: { viewport: { width, height } },
    })),
    {
      name: 'desktop',
      testMatch:
        /(role-library|ui-refinement|backup-restore|effect-correction)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1400, height: 900 },
      },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run preview -- --host 127.0.0.1 --port 4173',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        env: { VITE_BASE_PATH: '/Blood-on-the-Clocktower/' },
      },
})
