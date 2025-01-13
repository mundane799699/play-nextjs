cd /home/play-nextjs/
npm run build
pm2 stop readsync
pm2 del readsync
pm2 start ecosystem.config.js