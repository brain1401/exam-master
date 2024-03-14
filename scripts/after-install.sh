#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use 20

cd /home/ubuntu/nextjs/exam-master/

# node_modules 디렉토리가 존재하면 삭제
# if [ -d "node_modules" ]; then
#     rm -rf node_modules/
# fi

# npm install 실행
npm install
