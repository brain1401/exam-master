#!/bin/bash

# 프로필 파일 경로 설정
PROFILE_PATH="/home/ubuntu/.profile"

# 프로필 파일 존재 및 읽을 수 있는지 확인
if [ -f "$PROFILE_PATH" ] && [ -r "$PROFILE_PATH" ]; then
    # 프로필 파일 로드
    source "$PROFILE_PATH"
else
    echo "Warning: Unable to load profile file at '$PROFILE_PATH'."
fi

cd /home/ubuntu/nextjs/exam-master/

# node_modules 디렉토리가 존재하면 삭제
if [ -d "node_modules" ]; then
    rm -rf node_modules/
fi

# npm install 실행
npm install
