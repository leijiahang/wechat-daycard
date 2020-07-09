
const path = require('path');
const _IMG = require("./lib/imgjoin.js");
const _NN = require("./lib/getnn.js");

	
setTimeout(async () => {
	let d = await _NN.getDayData('20200708');
	_IMG.joinImage(d.localImg, [
	  path.join(__dirname, "imgs/avatar/1.jpg"),
	  d.qrImg
	], 'Ray')
}, 1000);


