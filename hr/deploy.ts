const { Client } = require('ssh2');
const { scp } = require('scp2');
const axios = require('axios');

const execSync = require('child_process').execSync //同步子进程
const gitName = execSync('git show -s --format=%cn').toString().trim() //姓名
const gitMessage = execSync('git show -s --format=%s').toString().trim() //说明


const host = '122.51.110.237'
const username = 'root'
const password = 'fq+y6kZ2Nj7cgV6'
// 连接到Linux服务器
const connectToServer = () => {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => {
      console.log('已连接到服务器')
      resolve(conn)
    })
    conn.on('error', (err) => {
      console.error('连接服务器时发生错误:', err)
      reject(err)
    })
    conn.connect({
      host: host,
      port: 22, // 默认SSH端口
      username: username,
      password: password
    })
  })
}

// command:'' // 删除命令 rm -rf /usr/share/nginx/html/dataV/stage
// 上传文件到服务器
const uploadFileToServer = (localPath, remotePath) => {
  return new Promise((resolve, reject) => {
    scp(
      localPath,
      {
        host: host,
        port: 22, // 默认SSH端口
        username: username,
        password: password,
        path: remotePath
      },
      (err) => {
        if (err) {
          console.error('上传文件时发生错误:', err)
          reject(err)
        } else {
          console.log('文件上传成功')
          resolve()
        }
      }
    )
  })
}

// 重启Nginx
const restartNginx = (conn) => {
  return new Promise((resolve, reject) => {
    conn.exec('nginx -s reload', (err, stream) => {
      if (err) {
        console.error('执行重启Nginx命令时发生错误:', err)
        reject(err)
      } else {
        stream
          .on('close', (code, signal) => {
            console.log('Nginx已重启')
            resolve()
          })
          .on('data', (data) => {
            console.log(data.toString())
          })
          .stderr.on('data', (data) => {
            console.error(data.toString())
          })
      }
    })
  })
}

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  const year = now.getFullYear();				// 获取年
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();				// 获取时
  const minutes = now.getMinutes();		// 获取分
  const seconds = now.getSeconds();		// 获取秒
  const currentTime = year + '-' +
    month.toString().padStart(2, '0') + '-' +
    day.toString().padStart(2, '0') + ' ' +
    hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0')
  return currentTime
}

// ############ 飞书消息 ############
// name:项目名称 env:部署环境 notice:通知@
const sendNotice = ({ name, env, notice }, noticeType) => {
  const startText = noticeType == 1 ? '开始' : '完成'

  const envText = '🖥    服务器环境：' + env

  const success = noticeType == 2 ? '失败' + ' ❌' : noticeType == 3 ? '成功' + ' ✅' : ''
  const successText = noticeType != 1 ? '\n 🆗   构建结果：' + success : ''

  const timeText = '\n 📅   发布时间：' + getCurrentTime()

  const gitContent = '\n 🤔   ' + '提交人：' + gitName + '\n 🗂   提交信息：' + gitMessage


  let atUser = ''
  if (notice && notice.length > 0 && noticeType != 1) {
    atUser = '\n👨‍🔧‍    提醒：'
    notice.forEach((item) => {
      // atUser = atUser + ' <at user_id = "' + item.openId + '">' + item.name + '</at>'
      atUser = atUser + ' <div>' + "@" + item.name + ' </div>'
    })
  }

  const content = envText + successText + timeText +  gitContent + atUser

  const stateIcon = noticeType == 2 ? ' 😢' : noticeType == 3 ? ' 😀' : ' 🙏'
  // 消息模版
  const data = {
    msg_type: 'interactive',
    card: {
      confing: {
        wide_screen_mode: true,
        enable_forward: true
      },
      header: {
        template: 'blue',
        title: {
          tag: 'plain_text',
          content: '🔔   ' + name + '前端' + '-' + '构建' + startText + ' (' + env + ')' + stateIcon
        }
      },
      elements: [
        {
          tag: 'hr'
        },
        {
          tag: 'div',
          text: {
            content: content,
            tag: 'lark_md'
          }
        },
        {
          actions: [{
            tag: "button",
            text: {
              content: "测试网址",
              tag: "lark_md"
            },
            url: "https://file.zhikejiaoyu.com",
            type: "primary",
            value: {}
          }],
          tag: "action"
        }
      ]
    }
  }

  const webhookUrl =
    'https://open.feishu.cn/open-apis/bot/v2/hook/22bd0b83-8521-4ee4-b3bd-e90f2a1d17b4'
  // 请求机器人发送消息
  axios({
    method: 'post',
    url: webhookUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

const project = {
  name: "SecretWorld Platform",
  env: "开发",
  notice:[{name:"所有人"}]
}

// 使用示例
const uploadAndRestart = async () => {
  try {
    const conn = await connectToServer();
    const remotePath = '/usr/share/nginx/html/dataV/stage'
    const localPath = `${__dirname}/dist-test`;
    await uploadFileToServer(localPath, remotePath);
    await restartNginx(conn);
    sendNotice(project, 3)
    conn.end(); // 关闭SSH连接
  } catch (err) {
    console.error('发生错误:', err)
  }
}

// 调用上传和重启函数
uploadAndRestart()
