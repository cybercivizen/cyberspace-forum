// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "cyberspace",
      script: "server.js",                    // Next.js standalone server
      cwd: "./next",                      // folder where you built Next.js
      instances: "max",                       // or set a number like 2
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: "500M",
    },
    {
      name: "socket-server",
      script: "socket-server.ts",
      interpreter: "ts-node",                  // or tsx if you prefer
      cwd: ".",                               // root folder
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4000,                           // socket server port
      },
      watch: false,
      autorestart: true,
    },
  ],
};