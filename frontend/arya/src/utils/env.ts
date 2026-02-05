const bool = (value: string | undefined) => value === 'true';

export const env = {
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  enableMockApi: bool(import.meta.env.VITE_ENABLE_MOCK_API),
  enableDevPaymentSim: bool(import.meta.env.VITE_ENABLE_DEV_PAYMENT_SIM),
  enableAdminUi: bool(import.meta.env.VITE_ENABLE_ADMIN_UI),
};
