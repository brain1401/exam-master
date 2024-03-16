#!/bin/bash

# 현재 서비스의 HTTP 상태 코드 확인
HTTPCODE=$(curl --max-time 5 --silent --write-out %{http_code} --output /dev/null https://exammaster.co.kr)

# 현재 "blue" 컨테이너의 포트를 조회
BLUE_PORT=$(docker inspect --format='{{(index (index .NetworkSettings.Ports "3000/tcp") 0).HostPort}}' exam-master-blue)
if [ -z "$BLUE_PORT" ]; then
    echo "BLUE_PORT 조회에 실패했습니다."
    exit 1
fi

# 현재 "green" 컨테이너의 포트를 조회
GREEN_PORT=$(docker inspect --format='{{(index (index .NetworkSettings.Ports "3000/tcp") 0).HostPort}}' exam-master-green)
if [ -z "$GREEN_PORT" ]; then
    echo "GREEN_PORT 조회에 실패했습니다."
    exit 1
fi

if [ "$HTTPCODE" -eq 200 ]; then
    # "green" 컨테이너 중지 및 제거
    docker stop exam-master-green
    docker rm exam-master-green
    PREVIOUS_PORT=$GREEN_PORT
else
    # "blue" 컨테이너 중지 및 제거
    docker stop exam-master-blue
    docker rm exam-master-blue
    PREVIOUS_PORT=$BLUE_PORT
fi

# 새 컨테이너에 사용할 포트 결정
if [ "$PREVIOUS_PORT" -eq 3001 ]; then
    NEW_PORT=3002
else
    NEW_PORT=3001
fi

# 새로운 배포 대상 결정
NEW=$([ "$PREVIOUS_PORT" -eq 3001 ] && echo "blue" || echo "green")


# 새로운 이미지를 끌어옴
docker login

docker pull exam-master:latest || {
    echo "이미지를 끌어오는데 실패했습니다."
    exit 1
}

# 새 컨테이너 시작
docker run -d --name exam-master-${NEW} -p ${NEW_PORT}:3000 exam-master:latest

# 컨테이너가 'healthy' 상태가 될 때까지 기다림
until [ "$(docker inspect --format='{{.State.Health.Status}}' exam-master-${NEW})" == "healthy" ]; do
    sleep 1
    echo "컨테이너가 준비될 때까지 기다립니다..."
done

# NGINX 구성 업데이트하여 트래픽을 새 컨테이너로 리디렉션
sed -i "s/localhost:${PREVIOUS_PORT}/localhost:${NEW_PORT}/g" /etc/nginx/sites-available/exammaster
nginx -s reload