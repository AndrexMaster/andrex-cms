import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            '@components': resolve(__dirname, './resources/js/components'),
            '@store': resolve(__dirname, './resources/js/store'),
            '@hooks': resolve(__dirname, './resources/js/hooks'),
            '@layouts': resolve(__dirname, './resources/js/layouts'),
            '@lib': resolve(__dirname, './resources/js/lib'),
            '@pages': resolve(__dirname, './resources/js/pages'),
            '@types': resolve(__dirname, './resources/js/types'),
        },
    },
});
