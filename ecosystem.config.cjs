module.exports = {
  apps: [
    {
      name: 'quran-app',
      script: 'npx',
      args: 'serve out -l 3000 --no-clipboard',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
