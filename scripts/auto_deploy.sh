#!/bin/bash

# 현재 서비스의 HTTP 상태 코드 확인
HTTPCODE=$(curl --max-time 5 --silent --write-out %{http_code} --output /dev/null https://exammaster.co.kr)

# NGINX 설정 파일에서 현재 설정된 포트 조회
PREVIOUS_PORT=$(grep "proxy_pass http://localhost" /etc/nginx/sites-available/exam-master | grep -o '[0-9]\+')

if [ -z "$PREVIOUS_PORT" ]; then
    echo "NGINX 설정 파일에서 포트 조회에 실패했습니다."
    exit 1
fi

# 새 컨테이너에 사용할 포트 결정
if [ "$PREVIOUS_PORT" -eq 3001 ]; then
    NEW_PORT=3002
    NEW="green"
    OLD="blue"
elif [ "$PREVIOUS_PORT" -eq 3002 ]; then
    NEW_PORT=3001
    NEW="blue"
    OLD="green"
else
    echo "현재 실행 중인 컨테이너의 포트( 3001, 3002 )를 찾을 수 없습니다."
    exit 1
fi

# 환경변수 파일 로드
if [ -f /tmp/CodeDeploy/.env ]; then
    source /tmp/CodeDeploy/.env
else
    echo "환경변수 파일이 존재하지 않습니다."
    exit 1
fi

# 도커 허브 로그인
echo "$DOCKERHUB_PASSWORD" | docker login -u $DOCKERHUB_USERNAME --password-stdin || {
    echo "도커 허브 로그인에 실패했습니다."
    exit 1
}

# 이미지를 끌어오는데 실패하면 스크립트 종료
docker pull exam-master:latest || {
    echo "이미지를 끌어오는데 실패했습니다."
    exit 1
}

# 기존 컨테이너 종료 및 제거
docker stop exam-master-${OLD} 2>/dev/null || true
docker rm exam-master-${OLD} 2>/dev/null || true

# 기존 이미지 제거
sudo docker rmi $( docker images -f "dangling=true" -q ) --force

# 새 컨테이너 시작
docker run -d --name exam-master-${NEW} -p ${NEW_PORT}:3000 exam-master:latest

# 컨테이너가 'healthy' 상태가 될 때까지 기다림
until [ "$(docker inspect --format='{{.State.Health.Status}}' exam-master-${NEW})" == "healthy" ]; do
    sleep 1
    echo "컨테이너가 준비될 때까지 기다립니다..."
done

# NGINX 구성 업데이트하여 트래픽을 새 컨테이너로 리디렉션
sudo sed -i "s|\(proxy_pass http://localhost:\)${PREVIOUS_PORT}|\1${NEW_PORT}|" /etc/nginx/sites-available/exam-master
nginx -s reload

# 리디렉션이 완료되었는지 확인
HTTPCODE=$(curl --max-time 5 --silent --write-out %{http_code} --output /dev/null https://exammaster.co.kr)
IS_DOCKER_NEW_IMAGE=$(docker ps -a | grep "exam-master-${NEW}")

if [ "$HTTPCODE" -eq 200 ] && [ -n "$IS_DOCKER_NEW_IMAGE" ]; then
    echo "배포가 완료되었습니다."
else
    echo "배포에 실패했습니다."
    exit 1
fi
