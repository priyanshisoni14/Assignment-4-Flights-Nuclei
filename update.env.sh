rm .env.local
echo VITE_ENV=$1 > .env
echo VITE_ACCESS_TOKEN=$2 >> .env
echo VITE_HOST_NAME=$3 >> .env
cp .env .env.local
