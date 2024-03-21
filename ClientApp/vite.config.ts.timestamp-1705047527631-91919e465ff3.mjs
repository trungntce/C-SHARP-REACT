// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/SIFLEX/MES/WebAppV2/ClientApp/node_modules/.pnpm/vite@4.4.10_@types+node@16.18.57_sass@1.68.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/SIFLEX/MES/WebAppV2/ClientApp/node_modules/.pnpm/@vitejs+plugin-react@3.1.0_vite@4.4.10/node_modules/@vitejs/plugin-react/dist/index.mjs";
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
    const hash = Math.floor(Math.random() * 9e4) + 1e4;
    return defineConfig({
      plugins: [react()],
      esbuild: {
        supported: {
          "top-level-await": true
        }
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
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxTSUZMRVhcXFxcTUVTXFxcXFdlYkFwcFYyXFxcXENsaWVudEFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcU0lGTEVYXFxcXE1FU1xcXFxXZWJBcHBWMlxcXFxDbGllbnRBcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1NJRkxFWC9NRVMvV2ViQXBwVjIvQ2xpZW50QXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgZG5zIGZyb20gJ2RucydcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9KSA9PiB7XHJcbiAgaWYobW9kZSA9PT0gJ2RldmVsb3BtZW50Jyl7XHJcbiAgICBwcm9jZXNzLmVudiA9IHsuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKX07XHJcblxyXG4gICAgdmFyIGNlcnQgPSBwcm9jZXNzLmVudi5WSVRFX1NTTF9DUlRfRklMRTtcclxuICAgIHZhciBrZXkgPSBwcm9jZXNzLmVudi5WSVRFX1NTTF9LRVlfRklMRTtcclxuICBcclxuICAgIGRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoJ3ZlcmJhdGltJyk7XHJcbiAgXHJcbiAgICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgICAgc2VydmVyOiB7XHJcbiAgICAgICAgcG9ydDogNTE3MyxcclxuICAgICAgICBodHRwczoge1xyXG4gICAgICAgICAga2V5OiBmcy5yZWFkRmlsZVN5bmMoa2V5KSxcclxuICAgICAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhjZXJ0KSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgICAnXi9hcGkvLionOiB7XHJcbiAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbG9jYWxob3N0OjcwMzYnLFxyXG4gICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJy9zd2FnZ2VyJzoge1xyXG4gICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDo3MDM2JyxcclxuICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdeL21haW5IdWIvLionOiB7XHJcbiAgICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vbG9jYWxob3N0OjcwMzYnLFxyXG4gICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdzOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJy9oY2Rhc2hib2FyZCc6IHtcclxuICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NzAzNicsXHJcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAnXi9oYy8uKic6IHtcclxuICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NzAzNicsXHJcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAnXi9fZnJhbWV3b3JrLy4qJzoge1xyXG4gICAgICAgICAgICB0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDo3MDM2JyxcclxuICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdeL192cy8uKic6IHtcclxuICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NzAzNicsXHJcbiAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAkZm9udHM6IHJlc29sdmUoJy4vc3JjL2Fzc2V0cy9mb250cycpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9ZWxzZXtcclxuICAgIGNvbnN0IGhhc2ggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA5MDAwMCkgKyAxMDAwMDtcclxuXHJcbiAgICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgICBlc2J1aWxkOiB7XHJcbiAgICAgICAgc3VwcG9ydGVkOiB7XHJcbiAgICAgICAgICAndG9wLWxldmVsLWF3YWl0JzogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgLy8gZXh0ZXJuYWw6IFtcclxuICAgICAgICAgIC8vICAgXCIvc3JjL2Fzc2V0cy9jc3MvdW5pY29ucy5saW5lLmNzc1wiLFxyXG4gICAgICAgICAgLy8gICBcIi9zcmMvYXNzZXRzL2Nzcy9ub3RvLnNhbnMua3IuY3NzXCIsXHJcbiAgICAgICAgICAvLyBdLFxyXG4gICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgW25hbWVdYCArIGhhc2ggKyBgLmpzYCxcclxuICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBbbmFtZV1gICsgaGFzaCArIGAuanNgLFxyXG4gICAgICAgICAgICBhc3NldEZpbGVOYW1lczogYFtuYW1lXWAgKyBoYXNoICsgYC5bZXh0XWBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSAgXHJcbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRSLFNBQVMsY0FBYyxlQUFlO0FBQ2xVLE9BQU8sV0FBVztBQUNsQixPQUFPLFFBQVE7QUFDZixPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBRXhCLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUMzQixNQUFHLFNBQVMsZUFBYztBQUN4QixZQUFRLE1BQU0sRUFBQyxHQUFHLFFBQVEsS0FBSyxHQUFHLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQyxFQUFDO0FBRTlELFFBQUksT0FBTyxRQUFRLElBQUk7QUFDdkIsUUFBSSxNQUFNLFFBQVEsSUFBSTtBQUV0QixRQUFJLHNCQUFzQixVQUFVO0FBRXBDLFdBQU8sYUFBYTtBQUFBLE1BQ2xCLFFBQVE7QUFBQSxRQUNOLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxVQUNMLEtBQUssR0FBRyxhQUFhLEdBQUc7QUFBQSxVQUN4QixNQUFNLEdBQUcsYUFBYSxJQUFJO0FBQUEsUUFDNUI7QUFBQSxRQUNBLE9BQU87QUFBQSxVQUNMLFlBQVk7QUFBQSxZQUNWLFFBQVE7QUFBQSxZQUNSLGNBQWM7QUFBQSxZQUNkLFFBQVE7QUFBQSxVQUNWO0FBQUEsVUFDQSxZQUFZO0FBQUEsWUFDVixRQUFRO0FBQUEsWUFDUixjQUFjO0FBQUEsWUFDZCxRQUFRO0FBQUEsVUFDVjtBQUFBLFVBQ0EsZ0JBQWdCO0FBQUEsWUFDZCxRQUFRO0FBQUEsWUFDUixjQUFjO0FBQUEsWUFDZCxRQUFRO0FBQUEsWUFDUixJQUFJO0FBQUEsVUFDTjtBQUFBLFVBQ0EsZ0JBQWdCO0FBQUEsWUFDZCxRQUFRO0FBQUEsWUFDUixjQUFjO0FBQUEsWUFDZCxRQUFRO0FBQUEsVUFDVjtBQUFBLFVBQ0EsV0FBVztBQUFBLFlBQ1QsUUFBUTtBQUFBLFlBQ1IsY0FBYztBQUFBLFlBQ2QsUUFBUTtBQUFBLFVBQ1Y7QUFBQSxVQUNBLG1CQUFtQjtBQUFBLFlBQ2pCLFFBQVE7QUFBQSxZQUNSLGNBQWM7QUFBQSxZQUNkLFFBQVE7QUFBQSxVQUNWO0FBQUEsVUFDQSxZQUFZO0FBQUEsWUFDVixRQUFRO0FBQUEsWUFDUixjQUFjO0FBQUEsWUFDZCxRQUFRO0FBQUEsVUFDVjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsTUFDakIsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBLFVBQ0wsUUFBUSxRQUFRLG9CQUFvQjtBQUFBLFFBQ3RDO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsT0FBSztBQUNILFVBQU0sT0FBTyxLQUFLLE1BQU0sS0FBSyxPQUFPLElBQUksR0FBSyxJQUFJO0FBRWpELFdBQU8sYUFBYTtBQUFBLE1BQ2xCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxNQUNqQixTQUFTO0FBQUEsUUFDUCxXQUFXO0FBQUEsVUFDVCxtQkFBbUI7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMLGVBQWU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBS2IsUUFBUTtBQUFBLFlBQ04sZ0JBQWdCLFdBQVcsT0FBTztBQUFBLFlBQ2xDLGdCQUFnQixXQUFXLE9BQU87QUFBQSxZQUNsQyxnQkFBZ0IsV0FBVyxPQUFPO0FBQUEsVUFDcEM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
