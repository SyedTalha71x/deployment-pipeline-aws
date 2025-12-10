module.exports = {
    apps: [
      {
        name: "lummilo-backend",
        script: "./index.js",  
        cwd: "/opt/myapp/server",
        instances: 1,
        exec_mode: "cluster",
        env: {
          NODE_ENV: "production",
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  }