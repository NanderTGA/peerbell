#! /bin/bash
# This script is ran daily at 18:00 (6:00PM) in my timezone
cd "$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
nvs use latest
pm2 stop peerbell --watch
git reset --hard
git pull
npm i
npm audit fix
npx tsc
pm2 start peerbell
