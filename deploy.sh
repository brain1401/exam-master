#!/bin/bash
RUN_DIR=$(pwd -LP)

IS_RUNNING=$(pm2 list | grep -w "$APP_NAME" | grep -w "online")
if [ -z "$IS_RUNNING" ]; then
  echo "앱이 실행 중이 아니므로, 배포 후 새로 시작할 예정입니다."
else
  echo "앱이 이미 실행 중이므로, 배포 후 리로드할 예정입니다."
fi

# .env 파일의 존재는 production 파일을 오버라이드하며, production은 staging을, staging은 local을 오버라이드합니다.
source ../../.env.local
source ../../.env.staging
source ../../.env.production
source ../../.env

# 다음 변수들은 위에 나열된 파일 중 적어도 하나에 있어야 합니다.
#APP_NAME="앱-이름" #pm2에서 프로세스를 핸들링하기 위한 이름
#APP_DIR="/home/userdir/$APP_NAME"  #절대 경로가 필요합니다. 웹서버는 "current" 하위 디렉토리를 가리켜야 합니다.
#REPO="git@gitlab.yourhost.com:project/repo.git"
#BRANCH="master"
#ENV="production" #또는 staging 또는 local. 기본값은 production입니다.
#PORT=앱을 실행할 포트
#STORAGE_DIR="$APP_DIR/storage" #필요한 경우, 영구 저장소를 위한 디렉토리

echo "앱 이름: $APP_NAME"
echo "앱 디렉토리: $APP_DIR"
echo "리포지토리: $REPO"
echo "브랜치: $BRANCH"
echo "환경: $ENV"
echo "포트: $DEPLOY_PORT"
echo "저장소 디렉토리: $STORAGE_DIR"
echo "실행 디렉토리: $RUN_DIR"

cd $APP_DIR/current
LAST=$(git rev-parse HEAD)
echo "$LAST 가 최신 커밋 해시입니다"

# 새로운 릴리스를 위한 디렉토리 생성
DATE=$(date +%Y%m%d%H%M%S)
echo "$APP_DIR/releases/$DATE 생성"
mkdir $APP_DIR/releases/$DATE
cd $APP_DIR/releases/$DATE

# 리포지토리를 릴리스 디렉토리로 클론
echo "${REPO}를 ${APP_DIR}/releases/${DATE}에 클론 시작"
git clone -b $BRANCH $REPO .

# 실제로 새 커밋인지 확인
NEW=$(git rev-parse HEAD)
echo "$NEW 가 새 커밋입니다"
if [ $LAST = $NEW ]; then
  echo "커밋 해시가 동일하여 중단합니다!!"
  cp -f $RUN_DIR/latest_deploy.log $APP_DIR/latest_deploy.log

  if [ -z "$IS_RUNNING" ]; then
    # 애플리케이션이 실행 중이지 않을 때, 나중에 시작하기 위한 플래그 설정
    echo "앱이 실행 중이지 않으므로 나중에 시작하기 위한 플래그를 설정합니다."
    SHOULD_START_APP="true"
  else
    # 애플리케이션이 실행 중일 때, 추가 작업 없이 종료
    echo "앱이 실행 중이므로 추가 작업 없이 종료합니다."
    cd $APP_DIR
    rm -Rf $APP_DIR/releases/$DATE
    if [[ -t 0 || -p /dev/stdin ]]; then
      return
    else
      exit 1
    fi
  fi
fi

# 영구 서버 환경 파일에 대한 심볼릭 링크 생성
DOTENV=""
if [ ! -z "$ENV" ]; then
  DOTENV=.$ENV #ENV가 설정되어 있으면 파일 이름 앞에 점을 추가합니다.
fi
echo "$APP_DIR/.env$DOTENV 를 .env로 링크합니다"
ln -s $APP_DIR/.env$DOTENV .env
# 필요한 경우 영구 저장소에 대한 링크 추가
if [ $STORAGE_DIR ]; then
  echo "$STORAGE_DIR 를 $APP_DIR/releases/$DATE/storage로 링크합니다"
  ln -s $STORAGE_DIR $APP_DIR/releases/$DATE/storage
fi

echo "npm 패키지 설치 중"
npm install
echo "$APP_DIR/releases/$DATE $DOTENV 빌드 중"
if dotenv -e .env$DOTENV -- npx next build; then
  echo "빌드 성공"
else
  echo "빌드 실패! 릴리스 삭제 및 중단" #실패한 배포가 쌓이지 않도록 합니다.
  cp -f $RUN_DIR/latest_deploy.log $APP_DIR/latest_deploy.log
  cd $APP_DIR
  rm -Rf $APP_DIR/releases/$DATE
  if [[ -t 0 || -p /dev/stdin ]]; then
    return
  else
    exit 1
  fi
fi

# 기존의 /current 링크를 제거하고 이 최신 디렉토리로 재링크
echo "$APP_DIR/releases/$DATE 를 $APP_DIR/current로 링크합니다"
rm $APP_DIR/current
ln -s $APP_DIR/releases/$DATE $APP_DIR/current

# 노드 서버를 재시작하여 최신 빌드를 서비스
echo "$APP_NAME 에 대한 노드 서버 리로딩"
if [ "$SHOULD_START_APP" = "true" ]; then
  # 애플리케이션이 실행 중이지 않을 때 처음으로 시작
  echo "PM2로 처음으로 앱 시작"
  cd $APP_DIR/current
  pm2 start npx --name "$APP_NAME" --time -- next start --port=$DEPLOY_PORT
else
  # $SHOULD_START_APP이 "true"가 아니라면, 이미 실행 중인 애플리케이션을 환경 변수와 함께 리로드
  echo "PM2로 앱 리로드"
  pm2 reload $APP_NAME --update-env
fi

# 마지막 4개 릴리스를 제외하고 모두 삭제
OLD=$(ls -tl $APP_DIR/releases | grep '^d' | awk '{print $NF}' | tail -n+5 | sed "s|^|$APP_DIR/releases/|")
OLD_ONELINE=$(echo "$OLD" | sed -z 's/\n/ /g')
echo "다음을 제거 중: $OLD"
if [ ! "$OLD_ONELINE" = "$APP_DIR/releases/" ]; then
  rm -Rf $OLD
fi

echo "앱 디렉토리에서 최신 리포지토리의 이 스크립트 복사본을 업데이트 중"
chmod u+x $APP_DIR/releases/$DATE/deploy.sh
cp -f $APP_DIR/releases/$DATE/deploy.sh $APP_DIR/deploy.sh
chmod u+x $APP_DIR/deploy.sh

echo "배포됨!"
#echo "cp -f $RUN_DIR/last_deploy.log $APP_DIR/last_deploy.log"
