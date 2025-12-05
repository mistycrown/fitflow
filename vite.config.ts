import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: ['defaults', 'not IE 11', 'chrome >= 52', 'android >= 5'],
            renderLegacyChunks: true,
            modernPolyfills: true,
        })
    ],
    base: './', // 关键：使用相对路径，确保在 file:// 协议下能找到资源
    server: {
        port: 3001,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        target: 'es2015',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        // 确保 CSS 兼容性
        cssTarget: 'chrome61',
    },
});
