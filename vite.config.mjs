/// <reference types="vite/client" />

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
      proxy: {
        '/foo': 'http://localhost:5173/',
        '/api': {
          target: 'http://localhost:5155/',
          changeOrigin: true,
          secure: false,      
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:'+req.url, req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    },
});