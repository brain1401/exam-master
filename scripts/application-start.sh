export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.11.1/bin

pm2 describe exam-master > /dev/null
RUNNING=$?

cd /home/ubuntu/nextjs/exam-master/
if [ "${RUNNING}" -ne 0 ]; then
  pm2 start npm --name exam-master --time -- run start --port=3000
else
  pm2 reload exam-master --update-env
fi;
