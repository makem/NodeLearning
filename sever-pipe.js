var http = require('http');    //
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var root = __dirname;
console.log('__dirname=',root);

var server = http.createServer(function(req, res){
    var url = parse(req.url);
    var path = join(root, url.pathname);
    fs.stat(path, function(err,stat){
       if(err){
           if(err.code == 'ENOENT'){
               res.statusCode = 404;
               res.end('Not found');
           } else {
               res.statusCode = 500;
               res.end('Internal server error');
           }
       }else{
           res.setHeader('Content-Length',stat.size);
           var stream = fs.createReadStream(path);
           stream.pipe(res);
           stream.on('error',function(){
               res.statusCode = 500;
               res.end('Internal Server Error ');
           });

       }
    });
});
server.listen(3000);