#!/bin/bash

# 리디렉션이 완료되었는지 확인
HTTPCODE=$(curl --max-time 5 --silent --write-out %{http_code} --output /dev/null https://exammaster.co.kr)

if [ "$HTTPCODE" -eq 200 ]; then
    echo "배포가 성공적으로 완료되었습니다."
else
    echo "배포가 실패했습니다."
    exit 1
fi
