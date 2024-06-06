'use strict';

import fs from 'fs';
import https from 'https';

const port = 8443;

const server = https.createServer(
	{
		cert: fs.readFileSync('./server_crt.pem'),
		key : fs.readFileSync('./server_key.pem'),
	},
	(req, res) => {
		const path = req.url === '/' ? '/index.html' : req.url;
		const content = (() => {
			try {
				return fs.readFileSync('.' + path);
			} catch (e) {
				res.writeHead(404);
				return 'NOT FOUND';
			}
		})();
		res.end(content);
	}
);

server.listen(port, () => console.error(`Listen on port ${port}`));
