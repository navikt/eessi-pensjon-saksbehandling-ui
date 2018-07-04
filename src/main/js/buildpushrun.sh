#!/usr/bin/env bash
REPO="docker.adeo.no:5000"
APP_NAME="eessi-fagmodul-frontend"
NUM=$(cat ./version)
VERSION="0.0.1-SNAPSHOT-${NUM}"

ENV=${1:-t1}
NS=${2:-t1}

## Bump snapshot-version
echo $((NUM + 1)) > ./version

#rm -rf ./dist/
npm install
npm run build

# build & push
echo "Running docker build"
docker build . -t ${REPO}/${APP_NAME}:${VERSION}
if [ ! $? -eq 0 ]; then
    echo "Error during docker build"
    exit
fi

docker push ${REPO}/${APP_NAME}:${VERSION}
if [ ! $? -eq 0 ]; then
    echo "Error during docker push"
    exit
fi

# stop old and run new
docker stop $(docker ps | grep ${APP_NAME} | sed 's/.* //g')
docker run -d -p :80 ${REPO}/${APP_NAME}:${VERSION}
if [ ! $? -eq 0 ]; then
    echo "Error during docker run"
    exit
fi

# print new container name
docker ps | grep ${APP_NAME}

echo "Running nais validate"
nais validate
if [ ! $? -eq 0 ]; then
    echo "Error during nais validate"
    exit
fi

echo "Running nais upload"
nais upload -a ${APP_NAME} -v ${VERSION}
if [ ! $? -eq 0 ]; then
    echo "Error during nais upload"
    exit
fi

echo "Running nais deploy"
nais deploy -a ${APP_NAME} -v ${VERSION} -e ${ENV} -n ${NS} -u ${NAIS_UN} -p ${NAIS_PW} | sed "s/${NAIS_PW}/******/g"
if [ ! ${PIPESTATUS[0]} -eq 0 ]; then
    echo "Error during nais deploy"
    exit
fi

echo "Checking deploy progress"
STATUS="InProgress"
until [ ${STATUS} != "InProgress" ]; do
    JSON_RES=$(curl --silent -k https://daemon.nais.preprod.local/deploystatus/${ENV}/${APP_NAME})
    STATUS=$(echo ${JSON_RES} | python -c "import sys, json; print(json.load(sys.stdin)['Status'])")
    echo ${JSON_RES} | python -c "import sys, json; print(json.load(sys.stdin)['Reason'])"
    sleep 5
done
echo ${JSON_RES}
