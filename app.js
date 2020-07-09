const { Wechaty, FileBox } = require('wechaty');
const { ScanStatus } = require('wechaty-puppet');
const path = require('path');
const _IMG = require("./lib/imgjoin.js");
const _NN = require("./lib/getnn.js");

const bot = new Wechaty({
  name: 'NN_'
});


function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting) {
      require('qrcode-terminal').generate(qrcode, { small: false })  // show qrcode on console
      const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
      ].join('')
      console.log('请扫码登录：\n', qrcodeImageUrl)
  }
}

async function onLogin (user) {
  console.log(`${user} 登录成功`)
  // 给自己发消息
  let contact = await bot.Contact.find({ name:"Ray"});
  if(contact) {
      await contact.say('上线时间了');
  }
}

function onLogout(user) {
  console.log(`${user} 退出登录`)
}


async function onMessage (msg) {
  const contact = msg.from()
  let text = msg.text()
  const room = msg.room();

  if (text) {
    text = text.replace(/[。，、,.]$/gi, '').replace(/\s*/gi, "");
  }
  if (msg.type() === bot.Message.Type.Text && /^打卡+\d*?$/gi.test(text)) { // 文本消息
    const file = await contact.avatar()
    const avatar = path.join(__dirname, `/imgs/avatar/${file.name}`) 
    await file.toFile(avatar, true)
    let day = text.replace('打卡', '');
    if (day.length != 8) {
      day = false;
    }
    createImg(day, contact.name(), avatar, async sendImg => {
      if (sendImg) {
        try {
          const imgFile = FileBox.fromFile(sendImg);
          if (room) {
            await room.say(imgFile, contact);
          } else {
            await contact.say(imgFile);
          }
        }catch(e) {
          if (room) {
            await room.say('上传图片超时，请重新回复', contact);
          } else {
            await contact.say('上传图片超时，请重新回复');
          }
        }
      }
    });
  }
}

function getDay() {
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();

  m = m < 10 ? `0${m}`: m;
  d = d < 10 ? `0${d}`: d;
  
  return `${y}${m}${d}`;
}

// 生成主图
async function createImg(day, name, avatar, callback) {
  let d = await _NN.getDayData(day || getDay());
  let msgImg = await _IMG.imgJoin(d.localImg, [avatar, d.qrImg], name);
  callback && callback(msgImg)
}

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('正在开启微信机器人...'))
.catch(e => console.error(e))