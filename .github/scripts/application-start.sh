pm2 describe exam-master > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start yarn --name app -- start
else
  pm2 reload app
fi;
