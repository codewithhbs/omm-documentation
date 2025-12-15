module.exports = {
  apps: [
    {
      name: "omm-documentation",
      script: "npm",
      args: "start",
      cwd: "/root/omm-documentation/frontend",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
