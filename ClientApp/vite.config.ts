import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import dns from 'dns'
import { resolve } from 'path';

export default ({ mode }) => {
  if(mode === 'development'){
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    var cert = process.env.VITE_SSL_CRT_FILE;
    var key = process.env.VITE_SSL_KEY_FILE;
  
    dns.setDefaultResultOrder('verbatim');
  
    return defineConfig({
      server: {
        port: 5173,
        https: {
          key: fs.readFileSync(key),
          cert: fs.readFileSync(cert),
        },
        proxy: {
          '^/api/.*': {
            target: 'https://localhost:7036',
            changeOrigin: true,
            secure: false,
          },
          '/swagger': {
            target: 'https://localhost:7036',
            changeOrigin: true,
            secure: false,
          },
          '^/mainHub/.*': {
            target: 'https://localhost:7036',
            changeOrigin: true,
            secure: false,
            ws: true
          },
          '/hcdashboard': {
            target: 'https://localhost:7036',
            changeOrigin: true,
            secure: false,
          },
          '^/hc/.*': {
            target: 'https://localhost:7036',
            changeOrigin: true,
            secure: false,
          },
          '^/_framework/.*': {
            target: 'https://localhost:7036',
            changeOrigin: true,
            secure: false,
          },
          '^/_vs/.*': {
            target: 'https://localhost:7036',
            changeOrigin: true,
            secure: false,
          }
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          $fonts: resolve('./src/assets/fonts')
        }
      }
    });
  }else{
    const hash = Math.floor(Math.random() * 90000) + 10000;

    return defineConfig({
      plugins: [react()],
      esbuild: {
        supported: {
          'top-level-await': true
        },
      },
      build: {
        rollupOptions: {
          // external: [
          //   "/src/assets/css/unicons.line.css",
          //   "/src/assets/css/noto.sans.kr.css",
          // ],
          output: {
            entryFileNames: `[name]` + hash + `.js`,
            chunkFileNames: `[name]` + hash + `.js`,
            assetFileNames: `[name]` + hash + `.[ext]`
          }
        }        
      }
    });
  }  
}