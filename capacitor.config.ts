import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.fampay.prototype',
  appName: 'FamPay Prototype',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config