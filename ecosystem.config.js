module.exports = {
  apps: [
    {
      name: "zim-tracking-client",
      script: "node",
      args: "node_modules/next/dist/bin/next start -p 3021",
      watch: false,
    },
  ],
};
