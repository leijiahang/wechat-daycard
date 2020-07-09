const $ = require("axios");
const request = require('request');
const fs = require('fs');
const path = require('path');
const Qr = require('./vapi.js');

const URL = `https://c.musicapp.migu.cn/MIGUM2.0/v2.0/content/getNinanByDate.do?columnTitle=`
const _DAY_DATA = {};

async function getNnData(day, callback) {
	if (_DAY_DATA[day]) {
		callback && callback(_DAY_DATA[day]);
		return;
	}

	let d = await $.get(`${URL}${day}`);
	if(d && d.data && d.data.code === '000000') {
		let img = d.data.object.contents[0].objectInfo.img;
		let songId = d.data.object.contents[2].objectInfo.contentId;
		let _data = {
			img,
			songId
		}
		let imgName = `nn_${day}.jpg`;
		let url = path.join(__dirname, `../imgs/nnimg/${imgName}`);
		let imgStream = fs.createWriteStream(url);
		request(img).pipe(imgStream);
		imgStream.on('finish', async () => {
			_data.localImg = url;
			// 获取歌曲小程序二维码
			_data.qrImg = await Qr.getQrImg(songId);
			if (!_DAY_DATA[day]) {
				_DAY_DATA[day] = _data
			}
			callback && callback(_data);
		})
		
	}
}

exports.getDayData = async function(day) {
	return new Promise((resolve, reject) => {
		getNnData(day, d => {
			resolve(d);
		})
	})
}

