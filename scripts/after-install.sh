#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use 20

cd /home/ubuntu/nextjs/exam-master/

if [ ! -d "node_modules" ]; then
    echo "node_modules not found, installing dependencies"
    npm install
else
    echo "node_modules exists, skipping dependency installation"
fi

# npm install 실행
npm install
