current_dir=$(basename "$PWD")

if [[ "$current_dir" == "Front-Prod-Web@2" ]]; then
    echo "当前操作的是 Front-Prod-Web@2"
    cd /home/jenkins/workspace/Front-Prod-Web@2
    elif [[ "$current_dir" == "Front-Prod-Web" ]]; then
    echo "当前操作的是 Front-Prod-Web"
    cd /home/jenkins/workspace/Front-Prod-Web
else
    echo "未知目录: $current_dir"
fi

rm -rf node_modules dist
/usr/local/src/node-v16.20.2/bin/pnpm install
/usr/local/src/node-v16.20.2/bin/npm run build:prod
# /home/jenkins/.nvm/versions/node/v20.5.0/bin/pnpm install
# /home/jenkins/.nvm/versions/node/v20.5.0/bin/npm run build:test
# tar -czvf package.tar.gz .
rm -f package.tar.gz
tar -czvf package.tar.gz ./dist/