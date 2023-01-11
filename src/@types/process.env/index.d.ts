declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      APP_SECRET: string;
      APP_API_URL: string;
      APP_WEB_URL: string;
    }
  }
}

export {};
