var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var chatServer = require('./lib/chat-server');

function send404(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found.');
    res.end();
}

function sendFile(res, filePath, fileContents) {
    res.writeHead(
        200,
        {"content-type": mime.lookup(path.basename(filePath))}
    );
    res.end(fileContents);
}

function serveStatic(res, cache, path) {
    if (cache[path]) {
        sendFile(res, path, cache[path]);
    } else {
        fs.exists(path, function(exists) {
            if (exists) {
                fs.readFile(path, function(err, data) {
                    if (err) {
                        send404(res);
                    } else {
                        cache[path] = data;
                        sendFile(res, path, data);
                    }
                });
            } else {
                send404(res);
            }
        });
    }
}

var serverPort = 3000;

var server = http.createServer(function(req, res) {
    var filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }
    var path = './' + filePath;
    serveStatic(res, cache, path);
});

server.listen(serverPort, function() {
    console.log("Server listening on port", serverPort);
});

chatServer.listen(server);
