const fs = require("fs");
const path = require("path");
const gm = require("gm") // .subClass({ imageMagick: true });

function joinImage(TMP, files = [], nickname, callback) {
  if (!files[0]) {
    callback && callback(false);
    return;
  }
  
  let outputdir = path.join(__dirname, "../imgs/result");
  let name = `${outputdir}/${Date.now()}.jpg`;
  let output = `${outputdir}/circle.jpg`;

  let W = 710;
  let H = 960;
  let headerW = 105;
  let headerX = 0;
  let qrW = 200;
  let qrX = 24; // 右边距离
  let qrY = 180; // 距离底部距离
  let info = '咪咕音乐-呢喃'

  // 头像图片合成
  let posWH = `image Over ${W - headerW}, ${headerX}, ${headerW}, ${headerW}`;
  // 小程序码
  let posWH_2 = `image Over ${W - qrX - qrW}, ${H - qrW - qrY}, ${qrW}, ${qrW}`;
  let fontSize = "32";
  let txtX = 170;
  let txtY = 88;

  gm(TMP)
    .draw(`${posWH} "${files[0]}"`)
    .draw(`${posWH_2} "${files[1]}"`)
    .fontSize(fontSize)
    .font(path.join(__dirname, "/font.ttf"))
    .fill("#1D1D1D")
    .drawText(txtX, txtY, `| ${nickname}`)
    .fill("#C7C7C7")
    .drawText(W - 230, H - 30, info)
    .write(name, function(err) {
      if (!err) {
        callback && callback(name);
      } else {
        console.log("---gm", err || "出错了！");
        callback && callback(false);
      }
    });
}


function imgJoin(TMP, files = [], nickname) {
  return new Promise((resolve, reject) => {
    joinImage(TMP, files, nickname, d => {
      resolve(d)
    })
  })
}
exports.imgJoin = imgJoin;
