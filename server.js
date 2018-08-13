var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	"html" : "text/html",
	"jpeg" : "image/jpeg",
	"jpg" : "image/jpeg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css",
};

//create Server
http.createServer(function (req,res) {
	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd(),unescape(uri));
	console.log("loading.." + uri);
	
	var stats;
	try {
		stats = fs.lstatSync(filename);
	} catch (e) {
		res.writeHead(404, {'Content-Type': 'text/plain'});	
		res.write('404 Not found!\n');
		res.end();
		return;
	}
	
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
		res.writeHead(200, {'Content-Type': mimeType});
		
		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	} else if(stats.isDirectory()) {
		res.writeHead(302, {'Location': 'index.html'});
		res.end();
	} else {
		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.write('500 Internal Server Error!\n');
		res.end();		
	}
}).listen(1337, '127.0.0.1');
console.log("A server is listening on http://127.0.0.1:1337");