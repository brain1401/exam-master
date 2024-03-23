#!/bin/bash

# AWS AutoScaling, ELB, blue/green CodeDeploy를 이용한 자동 배포 스크립트

APP_PORT=3000

# 환경변수 파일 로드
if [ -f /tmp/CodeDeploy/.env ]; then
    # 임시 파일 생성
    TMP_ENV="/tmp/CodeDeploy/.env_tmp"
    tail -n +2 /tmp/CodeDeploy/.env >"$TMP_ENV"
    source "$TMP_ENV"
    # 임시 파일 삭제
    rm "$TMP_ENV"
else
    echo "환경변수 파일이 존재하지 않습니다."
    exit 1
fi

echo ${DOCKERHUB_TOKEN} >password.txt

# 도커 허브 로그인
cat password.txt | docker login -u $DOCKERHUB_USERNAME --password-stdin || {
    echo "도커 허브 로그인에 실패했습니다."
    exit 1
}

# 도커 허브 로그인 성공 후 비밀번호 파일 삭제
rm -f password.txt

# 이미지를 끌어오는데 실패하면 스크립트 종료
docker pull brain1401/exam-master:latest || {
    echo "이미지를 끌어오는데 실패했습니다."
    exit 1
}

# 기존 컨테이너 제거
docker stop exam-master
docker rm -f exam-master

# 새 컨테이너 시작
docker run -d --name exam-master -p ${APP_PORT}:3000 brain1401/exam-master:latest

# 컨테이너가 'healthy' 상태가 될 때까지 기다림
while true; do
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' exam-master)

    if [ "$STATUS" == "healthy" ]; then
        echo "컨테이너가 준비되었습니다."
        break
    elif [ "$STATUS" == "unhealthy" ]; then
        echo "컨테이너가 정상적으로 준비되지 않았습니다."
        exit 1
    else
        echo "컨테이너가 준비될 때까지 기다립니다..."
        sleep 1
    fi
done

# NGINX 구성 업데이트

sudo nginx -s reload

# 이상이 없는지 확인을 위한 반복 시도
RETRY_LIMIT=5
RETRY_COUNT=0
SUCCESS=false

while [ $RETRY_COUNT -lt $RETRY_LIMIT ]; do
    HTTPCODE=$(curl --max-time 3 --silent --write-out %{http_code} --output /dev/null http://localhost:${APP_PORT})
    if [ "$HTTPCODE" -eq 200 ]; then
        SUCCESS=true
        break
    else
        echo "배포 확인 중... 시도 ${RETRY_COUNT}/${RETRY_LIMIT}"
        RETRY_COUNT=$((RETRY_COUNT + 1))
        sleep 3
    fi
done

if [ "$SUCCESS" = true ]; then

    # 기존 이미지 제거
    sudo docker image prune -a -f

    echo "배포가 완료되었습니다."
    exit 0
else
    echo "배포에 실패했습니다."
    exit 1
fi
