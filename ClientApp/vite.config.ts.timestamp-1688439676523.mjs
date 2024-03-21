// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/Project-E/siflex/WebAppV2/ClientApp/node_modules/.pnpm/vite@4.2.1_@types+node@16.18.23_sass@1.61.0/node_modules/vite/dist/node/index.js";
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
          "^/api/.*": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
          },
          "/swagger": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
          },
          "^/mainHub/.*": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false,
            ws: true
          },
          "/hcdashboard": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
          },
          "^/hc/.*": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
          },
          "^/_framework/.*": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
          },
          "^/_vs/.*": {
            target: "https://localhost:7036",
            changeOrigin: true,
            secure: false
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0LUVcXFxcc2lmbGV4XFxcXFdlYkFwcFYyXFxcXENsaWVudEFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdC1FXFxcXHNpZmxleFxcXFxXZWJBcHBWMlxcXFxDbGllbnRBcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3QtRS9zaWZsZXgvV2ViQXBwVjIvQ2xpZW50QXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgZG5zIGZyb20gJ2RucydcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9PiB7XHJcbiAgaWYobW9kZSA9PT0gJ2RldmVsb3BtZW50Jyl7XHJcbiAgICBwcm9jZXNzLmVudiA9IHsuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKX07XHJcblxyXG4gICAgdmFyIGNlcnQgPSBwcm9jZXNzLmVudi5WSVRFX1NTTF9DUlRfRklMRTtcclxuICAgIHZhciBrZXkgPSBwcm9jZXNzLmVudi5WSVRFX1NTTF9LRVlfRklMRTtcclxuICBcclxuICAgIGRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoJ3ZlcmJhdGltJylcclxuICBcclxuICAgIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBwb3J0OiA1MTczLFxyXG4gICAgICAgIGh0dHBzOiB7XHJcbiAgICAgICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhrZXkpLFxyXG4gICAgICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKGNlcnQpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICdeL2FwaS8uKic6IHtcclxuICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NzAzNicsXHJcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAnL3N3YWdnZXInOiB7XHJcbiAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbG9jYWxob3N0OjcwMzYnLFxyXG4gICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJ14vbWFpbkh1Yi8uKic6IHtcclxuICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NzAzNicsXHJcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgICAgd3M6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAnL2hjZGFzaGJvYXJkJzoge1xyXG4gICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDo3MDM2JyxcclxuICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdeL2hjLy4qJzoge1xyXG4gICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDo3MDM2JyxcclxuICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdeL19mcmFtZXdvcmsvLionOiB7XHJcbiAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbG9jYWxob3N0OjcwMzYnLFxyXG4gICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJ14vX3ZzLy4qJzoge1xyXG4gICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDo3MDM2JyxcclxuICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICRmb250czogcmVzb2x2ZSgnLi9zcmMvYXNzZXRzL2ZvbnRzJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcbiAgICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICAgICAgZXNidWlsZDoge1xyXG4gICAgICAgIHN1cHBvcnRlZDoge1xyXG4gICAgICAgICAgJ3RvcC1sZXZlbC1hd2FpdCc6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9ICBcclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFMsU0FBUyxjQUFjLGVBQWU7QUFDcFYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUNmLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQzNCLE1BQUcsU0FBUyxlQUFjO0FBQ3hCLFlBQVEsTUFBTSxFQUFDLEdBQUcsUUFBUSxLQUFLLEdBQUcsUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDLEVBQUM7QUFFOUQsUUFBSSxPQUFPLFFBQVEsSUFBSTtBQUN2QixRQUFJLE1BQU0sUUFBUSxJQUFJO0FBRXRCLFFBQUksc0JBQXNCLFVBQVU7QUFFcEMsV0FBTyxhQUFhO0FBQUEsTUFDbEIsUUFBUTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0wsS0FBSyxHQUFHLGFBQWEsR0FBRztBQUFBLFVBQ3hCLE1BQU0sR0FBRyxhQUFhLElBQUk7QUFBQSxRQUM1QjtBQUFBLFFBQ0EsT0FBTztBQUFBLFVBQ0wsWUFBWTtBQUFBLFlBQ1YsUUFBUTtBQUFBLFlBQ1IsY0FBYztBQUFBLFlBQ2QsUUFBUTtBQUFBLFVBQ1Y7QUFBQSxVQUNBLFlBQVk7QUFBQSxZQUNWLFFBQVE7QUFBQSxZQUNSLGNBQWM7QUFBQSxZQUNkLFFBQVE7QUFBQSxVQUNWO0FBQUEsVUFDQSxnQkFBZ0I7QUFBQSxZQUNkLFFBQVE7QUFBQSxZQUNSLGNBQWM7QUFBQSxZQUNkLFFBQVE7QUFBQSxZQUNSLElBQUk7QUFBQSxVQUNOO0FBQUEsVUFDQSxnQkFBZ0I7QUFBQSxZQUNkLFFBQVE7QUFBQSxZQUNSLGNBQWM7QUFBQSxZQUNkLFFBQVE7QUFBQSxVQUNWO0FBQUEsVUFDQSxXQUFXO0FBQUEsWUFDVCxRQUFRO0FBQUEsWUFDUixjQUFjO0FBQUEsWUFDZCxRQUFRO0FBQUEsVUFDVjtBQUFBLFVBQ0EsbUJBQW1CO0FBQUEsWUFDakIsUUFBUTtBQUFBLFlBQ1IsY0FBYztBQUFBLFlBQ2QsUUFBUTtBQUFBLFVBQ1Y7QUFBQSxVQUNBLFlBQVk7QUFBQSxZQUNWLFFBQVE7QUFBQSxZQUNSLGNBQWM7QUFBQSxZQUNkLFFBQVE7QUFBQSxVQUNWO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxNQUNqQixTQUFTO0FBQUEsUUFDUCxPQUFPO0FBQUEsVUFDTCxRQUFRLFFBQVEsb0JBQW9CO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxPQUFLO0FBQ0gsV0FBTyxhQUFhO0FBQUEsTUFDbEIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLE1BQ2pCLFNBQVM7QUFBQSxRQUNQLFdBQVc7QUFBQSxVQUNULG1CQUFtQjtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
