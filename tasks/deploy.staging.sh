#!/usr/bin/env bash
tsc

source "$(pwd)/tasks/deploy.util.sh"

start_log "Staging Deployment"

SERVER_NAME="payplo"
set "ssh 서버이름 변수를 설정합니다." "SERVER_NAME=$SERVER_NAME"

DIST_DIR="$PWD/.next"
set "빌드결과폴더 변수를 설정합니다." "DIST_DIR=$DIST_DIR"

APP_NAME="front-staging"
set "서버내 pm2 앱 이름 변수를 설정합니다." "APP_NAME=$APP_NAME"

run "기존 빌드결과 폴더가 있다면 삭제합니다." "rm -rf $DIST_DIR"
rm -rf "$DIST_DIR"

run "로컬에서 빌드를 실행합니다." "NODE_ENV=production APP_ENV=staging yarn build:staging"
echo ""
NODE_ENV=production APP_ENV=staging yarn build:staging

run "서버가 Git repo 를 pull 받습니다." "ssh $SERVER_NAME \"cd ~/$APP_NAME && git pull origin main\""
echo ""
ssh "$SERVER_NAME" "cd ~/$APP_NAME && git pull origin main"

run "서버의 기존 빌드결과 폴더가 있다면 삭제합니다." "ssh $SERVER_NAME \"rm -rf ~/$APP_NAME/.next\""
ssh "$SERVER_NAME" "rm -rf ~/$APP_NAME/.next"

run "로컬의 빌드결과 폴더를 서버에 업로드 합니다. (2-3 분 정도 소요됨)" "scp -r $DIST_DIR $SERVER_NAME:~/$APP_NAME"
echo ""
scp -r "$DIST_DIR" payplo:~/front-staging

run "서버의 reboot 스크립트를 실행합니다." "ssh $SERVER_NAME \"bash ~/deploy-staging.sh\""
echo ""
ssh "$SERVER_NAME" "bash ~/deploy-staging.sh"

#run "서버의 pm2 프로세스를 제거합니다." "ssh payplo \"pm2 delete $APP_NAME\""
#ssh payplo "pm2 delete $APP_NAME"
#
#run "서버의 pm2 프로세스를 생성합니다." "ssh payplo \"NODE_ENV=production APP_ENV=staging PORT=3001 pm2 start \"yarn start\" --name $APP_NAME --update-env -w -i max -- start\""
#ssh payplo "NODE_ENV=production APP_ENV=staging PORT=3001 pm2 start \"yarn start\" --name $APP_NAME --update-env -w -i max -- start"

printf "\n\n%s" "========================"
printf "\n\t%s\n" "배포완료!"
printf "\n\t\t%s\n" "# 로그를 확인하려면 다음을 실행하세요."
printf "\t\t%s\n" "$ ssh $SERVER_NAME \"pm2 log $APP_NAME\""
echo ""
printf "\n\t\t%s\n" "# 만약 pm2 명령어를 ssh shell 에서 인식하지 못하면, 다음을 순서대로 실행하세요."
printf "\t\t%s\n" "$ ssh $SERVER_NAME"
printf "\t\t%s\n" "$ pm2 log $APP_NAME"
printf "%s\n" "========================"

send_slack '*[스테이징 배포 완료!]*\n:point_right: 사이트 바로가기 <https://scordi.io:8080>\n'"$1"'\n'
