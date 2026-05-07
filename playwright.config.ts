import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para el proyecto R1000.
 * Documentación: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* Ejecutar pruebas en paralelo */
  fullyParallel: true,

  /* Fallar el build en CI si se dejó test.only accidentalmente */
  forbidOnly: !!process.env.CI,

  /* Reintentos solo en CI */
  retries: process.env.CI ? 2 : 0,

  /* Workers en paralelo: 1 en CI para estabilidad */
  workers: process.env.CI ? 1 : undefined,

  /* Reportes de resultados */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  /* Configuración base compartida para todos los tests */
  use: {
    /* URL base del proyecto (ajustar según ambiente) */
    baseURL: process.env.BASE_URL ?? 'http://localhost:5000',

    /* Captura de trazas en el primer reintento */
    trace: 'on-first-retry',

    /* Capturas de pantalla solo en fallo */
    screenshot: 'only-on-failure',

    /* Video solo en el primer reintento */
    video: 'on-first-retry',
  },

  /* Proyectos de navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Servidor de desarrollo local (opcional — descomentar si aplica) */
  // webServer: {
  //   command: 'dotnet run --project src/MyApp.Api',
  //   url: 'http://localhost:5000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
