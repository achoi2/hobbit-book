var http = require('http');
var fs = require('fs');
var promisify = require('util').promisify;

var writeFile = promisify(fs.writeFile);
var readFile = promisify(fs.readFile);

var server = http.createServer(function(req, res) {
    var contactPrefix = '/contacts/';
    if (req.url === '/contacts' && req.method === 'GET') {
        readFile('hobbit.json').then(function(data) {
            var dataString = data.toString();
            res.end(dataString);
        });
    } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
        readFile('hobbit.json').then(function(data) {
            var dataJSON = JSON.parse(data.toString());
            var name = req.url.slice(contactPrefix.length);
            res.end('You asked for ' + JSON.stringify(dataJSON[name]));
        });
    } else if (req.url.startsWith(contactPrefix) && req.method === 'DELETE') {
        readFile('hobbit.json').then(function(data) {
            var dataJSON = JSON.parse(data.toString());
            var name = req.url.slice(contactPrefix.length);
            delete dataJSON[name];
            res.end('success');
        });
    } else if (req.url.startsWith(contactPrefix) && req.method === 'POST') {
        var readbody = function(req, callback) {
            var body = '';
            req.on('data', function(chunk) {
                body += chunk.toString();
            });
            req.on('end', function() {
                callback(body);
            });
        };

        readbody(req, function(body) {
            var contact = JSON.parse(body);
            readFile('hobbit.json').then(function(data) {
                var dataJSON = JSON.parse(data.toString());
                var newArr = dataJSON.push(contact)
                JSON.stringify(newArr)
            });
            res.end('created contact');
        });
    }
});

server.listen(3000);
