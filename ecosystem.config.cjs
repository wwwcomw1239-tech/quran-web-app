module.exports = {
  apps: [{
    name: 'quran-app',
    script: 'npx',
    args: 'serve out -l 3000 --no-clipboard',
    env: { NODE_ENV: 'production', PORT: 3000 },
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
