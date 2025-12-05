import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.fitflow.app',
    appName: 'FitFlow',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        Keyboard: {
            resize: 'body',
            style: 'dark',
            resizeOnFullScreen: true,
        },
    }
};

export default config;
