import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dahmash.app',
  appName: 'dahmash-family',
  webDir: 'dist',
  server: {
    hostname: "dahmash-family",
    cleartext: false
  }
};

export default config;
