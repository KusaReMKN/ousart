'use strict';

/*
 * 時間稼ぎ。
 * 少なくとも ms ミリ秒待った後に解決するプロミスを返す。
 */
function
sleep(ms)
{
	return new Promise(r => setTimeout(() => r(), ms));
}

/*
 * 文字列のエンコード。
 * JavaScript の文字列 str を UTF-8 でエンコードして配列で返す。
 */
function
encodeUTF8(str)
{
	const encoder = new TextEncoder();
	return encoder.encode(str);
}

/*
 * クロックの ON/OFF。
 * 偽っぽい値を渡すとクロックが黒くなる。
 */
function
setClk(x)
{
	const ctx = clk.getContext('2d');
	ctx.fillStyle = x ? 'white' : 'black';
	ctx.fillRect(0,0, clk.width,clk.height);
}

/*
 * データの ON/OFF。
 * 偽っぽい値を渡すとクロックが黒くなる。
 */
function
setDat(x)
{
	const ctx = dat.getContext('2d');
	ctx.fillStyle = x ? 'white' : 'black';
	ctx.fillRect(0,0, dat.width,dat.height);
	sent.value += `${x?1:0} `;
}

async function
transmit(e)
{
	e.preventDefault();
	trigger.disabled = true;
	trigger.textContent = '送信中……';

	sent.value = '';

	const start = performance.now();
	const u8arr = encodeUTF8(message.value);
	const speed = 500 / +baud.value;

	for (let i = 0; i < u8arr.length; i++) {
		setClk(0);
		setDat(0);	// start bit
		await sleep(speed);
		setClk(1);
		await sleep(speed);
		for (let j = 0; j < 8; j++) {
			setClk(0);
			setDat(u8arr[i] & 1<<j);
			await sleep(speed);
			setClk(1);
			await sleep(speed);
		}
		setClk(0);
		setDat(1);	// stop bit
		await sleep(speed);
		setClk(1);
		await sleep(speed);
	}

	trigger.textContent = '送信する';
	trigger.disabled = false;
}
transmitter.addEventListener('submit', transmit);
