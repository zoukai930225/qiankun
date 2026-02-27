current_dir=$(basename "$PWD")

if [[ "$current_dir" == "Front-Test-Web@2" ]]; then
    echo "当前操作的是 Front-Test-Web@2"
    cd /home/jenkins/workspace/Front-Test-Web@2
    elif [[ "$current_dir" == "Front-Test-Web" ]]; then
    echo "当前操作的是 Front-Test-Web"
    cd /home/jenkins/workspace/Front-Test-Web
else
    echo "未知目录: $current_dir"
fi
rm -rf node_modules dist
/usr/local/src/node-v16.20.2/bin/pnpm install
/usr/local/src/node-v16.20.2/bin/npm run build:test
rm -f package.tar.gz
tar -czvf package.tar.gz ./dist/