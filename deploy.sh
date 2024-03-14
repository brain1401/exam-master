#!/bin/bash
RUN_DIR=$(pwd -LP)

IS_RUNNING=$(pm2 list | grep -w "$APP_NAME" | grep -w "online")
if [ -z "$IS_RUNNING" ]; then
  echo "App is not running, will perform fresh start after deployment."
else
  echo "App is already running, will perform reload after deployment."
fi

#the presence of a .env file overrides the production file, which overrides staging, which overrides local
source ../../.env.local
source ../../.env.staging
source ../../.env.production
source ../../.env

#the following variables need to be in at least one of the above files.
#APP_NAME="name-of-app" #pm2 handle for the process
#APP_DIR="/home/userdir/$APP_NAME"  #needs to be an absolute directory. Webserver should point to the "current" subdirectory within
#REPO="git@gitlab.yourhost.com:project/repo.git"
#BRANCH="master"
#ENV="production" #or staging or local.  defaults to production
#PORT=port to run the app on
#STORAGE_DIR="$APP_DIR/storage" #optional: a directory for persistant storage, if necessary

echo "App Name: $APP_NAME"
echo "App Dir: $APP_DIR"
echo "Repo: $REPO"
echo "Branch: $BRANCH"
echo "Environment: $ENV"
echo "Port: $DEPLOY_PORT"
echo "Storage Directory: $STORAGE_DIR"
echo "Run Dir: $RUN_DIR"

cd $APP_DIR/current
LAST=$(git rev-parse HEAD)
echo "$LAST is 가 최신 commit hash"

#새 realease를 위한 디렉토리 생성
DATE=$(date +%Y%m%d%H%M%S)
echo "$APP_DIR/releases/$DATE 생성"
mkdir $APP_DIR/releases/$DATE
cd $APP_DIR/releases/$DATE

#repo를 release 디렉토리로 clone
echo "${REPO}를 ${APP_DIR}/releases/${DATE}에 clone 시작"
git clone -b $BRANCH $REPO .

#check if it is indeed a new commit
NEW=$(git rev-parse HEAD)
echo "$NEW is new commit"
if [ $LAST = $NEW ]; then
  echo "Commit is same hash, aborting!!"
  cp -f $RUN_DIR/latest_deploy.log $APP_DIR/latest_deploy.log

  if [ -z "$IS_RUNNING" ]; then
    # 애플리케이션이 실행 중이지 않을 때, 나중에 서버 시작을 위해 플래그 설정
    echo "App was not running; setting flag for later start."
    SHOULD_START_APP="true"
  else
    # 애플리케이션이 실행 중일 때, 즉각적으로 반환하거나 종료
    echo "App is running; aborting with no further actions."
    cd $APP_DIR
    rm -Rf $APP_DIR/releases/$DATE
    if [[ -t 0 || -p /dev/stdin ]]; then
      return
    else
      exit 1
    fi
  fi
fi

# create symbolic links to persistant server environment files
DOTENV=""
if [ ! -z "$ENV" ]; then
  DOTENV=.$ENV #if ENV is set, add a period separator to the filename
fi
echo "linking $APP_DIR/.env$DOTENV to .env"
ln -s $APP_DIR/.env$DOTENV .env
#add link to persistant storage if necessary
if [ $STORAGE_DIR ]; then
  echo "linking $APP_DIR/releases/$DATE/storage to $STORAGE_DIR"
  ln -s $STORAGE_DIR $APP_DIR/releases/$DATE/storage
fi

echo "installing npm packages"
npm install
echo "building $APP_DIR/releases/$DATE $DOTENV"
if dotenv -e .env$DOTENV -- npx next build; then
  echo "build successful"
else
  echo "build failed! deleting release and aborting" #important to free the space in case failed deployments pile up
  cp -f $RUN_DIR/latest_deploy.log $APP_DIR/latest_deploy.log
  cd $APP_DIR
  rm -Rf $APP_DIR/releases/$DATE
  if [[ -t 0 || -p /dev/stdin ]]; then
    return
  else
    exit 1
  fi
fi

#remove existing /current link and re-link to this latest directory
echo "linking $APP_DIR/releases/$DATE to $APP_DIR/current"
rm $APP_DIR/current
ln -s $APP_DIR/releases/$DATE $APP_DIR/current

#restart the node server to serve latest build
echo "reloading node server for $APP_NAME"
if [ "$SHOULD_START_APP" = "true" ]; then
  # 애플리케이션이 실행 중이지 않을 때, 새로 시작
  echo "Starting app for the first time with PM2"
  cd $APP_DIR/current
  pm2 start npx --name "$APP_NAME" --time -- next start --port=$DEPLOY_PORT
else
  # $SHOULD_START_APP이 "true"가 아니라면, 애플리케이션은 이미 실행 중이므로, 환경 변수와 함께 reload합니다.
  echo "Reloading app with PM2"
  pm2 reload $APP_NAME --update-env
fi

#delete anything older than the last 4 releases
OLD=$(ls -tl $APP_DIR/releases | grep '^d' | awk '{print $NF}' | tail -n+5 | sed "s|^|$APP_DIR/releases/|")
OLD_ONELINE=$(echo "$OLD" | sed -z 's/\n/ /g')
echo "removing: $OLD"
if [ ! "$OLD_ONELINE" = "$APP_DIR/releases/" ]; then
  rm -Rf $OLD
fi

echo "updating this script copy in appdir with the latest from the repo"
chmod u+x $APP_DIR/releases/$DATE/deploy.sh
cp -f $APP_DIR/releases/$DATE/deploy.sh $APP_DIR/deploy.sh
chmod u+x $APP_DIR/deploy.sh

#cd ~
echo "deployed!"
#cp -f $RUN_DIR/last_deploy.log $APP_DIR/last_deploy.log
