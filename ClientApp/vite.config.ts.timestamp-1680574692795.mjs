// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Project-E/siflex/WebAppV2/ClientApp/node_modules/.pnpm/vite@4.2.1_kak4hs2a66ygjq5mwt6ytnsjhe/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Project-E/siflex/WebAppV2/ClientApp/node_modules/.pnpm/@vitejs+plugin-react@3.1.0_vite@4.2.1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import dns from "dns";
import { resolve } from "path";
var vite_config_default = ({ mode }) => {
  if (mode === "development") {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    var cert = process.env.VITE_SSL_CRT_FILE;
    var key = process.env.VITE_SSL_KEY_FILE;
    dns.setDefaultResultOrder("verbatim");
    return defineConfig({
      server: {
        port: 5173,
        https: {
          key: fs.readFileSync(key),
          cert: fs.readFileSync(cert)
        },
        proxy: {
          "/api": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
          },
          "/swagger": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
          },
          "/mainHub": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false,
            ws: true
          }
        }
      },
      plugins: [react()],
      resolve: {
        alias: {
          $fonts: resolve("./src/assets/fonts")
        }
      }
    });
  } else {
    return defineConfig({
      plugins: [react()],
      esbuild: {
        supported: {
          "top-level-await": true
        }
      }
    });
  }
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0LUVcXFxcc2lmbGV4XFxcXFdlYkFwcFYyXFxcXENsaWVudEFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdC1FXFxcXHNpZmxleFxcXFxXZWJBcHBWMlxcXFxDbGllbnRBcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3QtRS9zaWZsZXgvV2ViQXBwVjIvQ2xpZW50QXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgZG5zIGZyb20gJ2RucydcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9PiB7XHJcbiAgaWYobW9kZSA9PT0gJ2RldmVsb3BtZW50Jyl7XHJcbiAgICBwcm9jZXNzLmVudiA9IHsuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKX07XHJcblxyXG4gICAgdmFyIGNlcnQgPSBwcm9jZXNzLmVudi5WSVRFX1NTTF9DUlRfRklMRTtcclxuICAgIHZhciBrZXkgPSBwcm9jZXNzLmVudi5WSVRFX1NTTF9LRVlfRklMRTtcclxuICBcclxuICAgIGRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoJ3ZlcmJhdGltJylcclxuICBcclxuICAgIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBwb3J0OiA1MTczLFxyXG4gICAgICAgIGh0dHBzOiB7XHJcbiAgICAgICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhrZXkpLFxyXG4gICAgICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKGNlcnQpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICcvYXBpJzoge1xyXG4gICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDo3MDM2JyxcclxuICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICcvc3dhZ2dlcic6IHtcclxuICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NzAzNicsXHJcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAnL21haW5IdWInOiB7XHJcbiAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbG9jYWxob3N0OjcwMzYnLFxyXG4gICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdzOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgJGZvbnRzOiByZXNvbHZlKCcuL3NyYy9hc3NldHMvZm9udHMnKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgICBlc2J1aWxkOiB7XHJcbiAgICAgICAgc3VwcG9ydGVkOiB7XHJcbiAgICAgICAgICAndG9wLWxldmVsLWF3YWl0JzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gIFxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUE4UyxTQUFTLGNBQWMsZUFBZTtBQUNwVixPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDM0IsTUFBRyxTQUFTLGVBQWM7QUFDeEIsWUFBUSxNQUFNLEVBQUMsR0FBRyxRQUFRLEtBQUssR0FBRyxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUMsRUFBQztBQUU5RCxRQUFJLE9BQU8sUUFBUSxJQUFJO0FBQ3ZCLFFBQUksTUFBTSxRQUFRLElBQUk7QUFFdEIsUUFBSSxzQkFBc0IsVUFBVTtBQUVwQyxXQUFPLGFBQWE7QUFBQSxNQUNsQixRQUFRO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDTCxLQUFLLEdBQUcsYUFBYSxHQUFHO0FBQUEsVUFDeEIsTUFBTSxHQUFHLGFBQWEsSUFBSTtBQUFBLFFBQzVCO0FBQUEsUUFDQSxPQUFPO0FBQUEsVUFDTCxRQUFRO0FBQUEsWUFDTixRQUFRO0FBQUEsWUFDUixjQUFjO0FBQUEsWUFDZCxRQUFRO0FBQUEsVUFDVjtBQUFBLFVBQ0EsWUFBWTtBQUFBLFlBQ1YsUUFBUTtBQUFBLFlBQ1IsY0FBYztBQUFBLFlBQ2QsUUFBUTtBQUFBLFVBQ1Y7QUFBQSxVQUNBLFlBQVk7QUFBQSxZQUNWLFFBQVE7QUFBQSxZQUNSLGNBQWM7QUFBQSxZQUNkLFFBQVE7QUFBQSxZQUNSLElBQUk7QUFBQSxVQUNOO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxNQUNqQixTQUFTO0FBQUEsUUFDUCxPQUFPO0FBQUEsVUFDTCxRQUFRLFFBQVEsb0JBQW9CO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxPQUFLO0FBQ0gsV0FBTyxhQUFhO0FBQUEsTUFDbEIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLE1BQ2pCLFNBQVM7QUFBQSxRQUNQLFdBQVc7QUFBQSxVQUNULG1CQUFtQjtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
