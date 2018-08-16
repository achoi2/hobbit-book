const http = require('http');
const fs = require('fs');
const promisify = require('util').promisify;

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

let server = http.createServer((req, res) => {
    let readbody = (req, callback) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => callback(body));
    };
    
    let contactPrefix = '/contacts/';
    if (req.url === '/contacts' && req.method === 'GET') {
        readFile('hobbit.json').then(data => {
            let dataString = data.toString();
            res.end(dataString);
        });
    } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
        readFile('hobbit.json').then(data => {
            let dataJSON = JSON.parse(data.toString());
            let name = req.url.slice(contactPrefix.length);
            res.end('You asked for ' + JSON.stringify(dataJSON[name]));
        });
    } else if (req.url.startsWith(contactPrefix) && req.method === 'DELETE') {
        readFile('hobbit.json').then(data => {
            let dataJSON = JSON.parse(data.toString());
            let name = req.url.slice(contactPrefix.length);
            delete dataJSON[name];
            res.end('success');
        });
    } else if (req.url.startsWith(contactPrefix) && req.method === 'POST') {
        readbody(req, body => {
            let contact = JSON.parse(body);
            readFile('hobbit.json').then(data => {
                let dataJSON = JSON.parse(data.toString());
                let newArr = dataJSON.push(contact);

                JSON.stringify(newArr);
            });
            res.end('created contact');
        });
    } else if (req.url.startsWith(contactPrefix) && req.method === 'PUT') {
        readbody(req, body => {
            let contact = JSON.parse(body);
            res.end('created contact');
        });
    }
});

server.listen(3000);
