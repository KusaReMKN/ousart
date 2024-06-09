'use strict';

let receiving = false;

let prevClk = 1;
let dataBuf = [];

const d = 50;

const clkX = 600 / 2 - d;
const clkY = 300;
const datX = 600 / 2 + d;
const datY = 300;

function
check()
{
	const ctx = disp.getContext('2d');
	const clkData = ctx.getImageData(clkX, clkY, 1, 1).data;
	const datData = ctx.getImageData(datX, datY, 1, 1).data;
	const clk = clkData[0]/255*.299 + clkData[1]/255*.787 + clkData[2]/255*.114 < .5 ? 0 : 1;
	const dat = datData[0]/255*.299 + datData[1]/255*.787 + datData[2]/255*.114 < .5 ? 0 : 1;

	if (prevClk + 1 === clk)
		dataBuf.push(dat);
	prevClk = clk;

	buf.value = dataBuf.join(' ');
}

function
startReceiving()
{
	receiving = !receiving;
	start.textContent = receiving ? "受信中" : "受信開始";
}
start.addEventListener('click', startReceiving);

function
clearBuffer()
{
	dataBuf.length = 0;
}
clear.addEventListener('click', clearBuffer);

function
decodeBuffer()
{
	try {
	let b;
	while (dataBuf.length > 0 && (b = dataBuf.shift()))
		;
	dataBuf.unshift(b);

	let decodeBuf = [];
	while (dataBuf.length > 0 && dataBuf[0] === 0) {
		dataBuf.shift();
		let c = 0;
		for (let i = 0; i < 8; i++) {
			c |= dataBuf.shift() << i;
		}
		dataBuf.shift();
		decodeBuf.push(c);
	}
	const u8arr = new Uint8Array(decodeBuf);
	const decoder = new TextDecoder();
	data.value = decoder.decode(u8arr);
	} catch (err) {
		alert(err);
	}
}
decode.addEventListener('click', decodeBuffer);

let using = false;
const video = document.createElement('video');
async function
startCamera()
{
	if (using) {
		video.srcObject.getTracks().forEach(e => e.stop());
		video.srcObject = null;
		using = false;
		useCamera.textContent = 'カメラを開始';
		return;
	}
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
				width: 600,
				height: 600,
				frameRate: { ideal: 60 },
				facingMode: 'environment',
			},
		});
		video.srcObject = stream;
		using = true;
		useCamera.textContent = 'カメラを停止';
		setInterval(() => {
			const ctx = disp.getContext('2d');
			ctx.drawImage(video, 0,0, disp.width,disp.height);
			ctx.strokeStyle = 'red';
			ctx.strokeRect(clkX-15, clkY-15, 30, 30);
			ctx.strokeRect(clkX-5, clkY-5, 10, 10);
			ctx.strokeRect(datX-15, datY-15, 30, 30);
			ctx.strokeRect(datX-5, datY-5, 10, 10);

			if (receiving)
				check();
		});
		video.play();
	} catch (err) {
		alert(err);
	}
}
useCamera.addEventListener('click', startCamera);
