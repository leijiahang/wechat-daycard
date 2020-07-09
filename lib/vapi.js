const util = require("./util.js");
const fs = require("fs");
const path = require("path");


const APPID = "wxe9188e46b544384b",
    APPSECRET = "99dc50207b3750d748a3817a85a6033c";
let ACCESS_TOKEN = null;


function getAccessToken(callback) {
    const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;

    util.Req.get(URL, function(data) {
        if (data.access_token) {
            ACCESS_TOKEN = data.access_token;
            console.log('==================ACCESS_TOKEN', ACCESS_TOKEN)
            callback && callback(data.access_token);
        } else {
            setTimeout(getAccessToken, 5 * 1000);
        }
    });
}

function getQrcode(id, callback) {
    const URL = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${ACCESS_TOKEN}`;
    let body = {
        scene: id,
        page: "pages/index/index",
        width: 300,
        encoding: 'base64'
    };
    util.Req.post(URL, body, data => {
        let file = path.join(__dirname, `../imgs/qr/${id}.png`);
        let buffer = Buffer.from(data, 'base64');
        fs.writeFile(file, buffer, err => {
            if (err) {
                console.log(err);
                callback && callback(false);
                return;
            }
            callback && callback(file);
        });
    });
}

function getQrImg(id) {
    return new Promise((resolve, reject) => {
        getQrcode(id, file => {
            resolve(file);
        })
    })
}

getAccessToken();
// =============================保存2小时
setInterval(() => {
    getAccessToken();
}, 7100 * 1000);

exports.getQrImg = getQrImg;



