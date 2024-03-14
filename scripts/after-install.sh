#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.11.1/bin

cd /home/ubuntu/nextjs/exam-master/

# node_modules 디렉토리가 존재하면 삭제
if [ -d "node_modules" ]; then
    rm -rf node_modules/
fi

# npm install 실행
npm install
