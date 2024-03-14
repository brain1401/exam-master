pm2 describe exam-master > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start npm --name exam-master --time -- run start --port=3000
else
  pm2 reload exam-master
fi;
