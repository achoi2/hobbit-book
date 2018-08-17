const http = require('http');
const fs = require('fs');
const promisify = require('util').promisify;

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

let readbody = (req, callback) => {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => callback(body));
};

let getContacts = (req, res) => {
    readFile('hobbit.json').then(data => {
        let dataString = data.toString();
        res.end(dataString);
    });
};

let getContact = (req, res) => {
    readFile('hobbit.json').then(data => {
        let dataJSON = JSON.parse(data.toString());
        let name = req.url.slice(contactPrefix.length);
        res.end('You asked for ' + JSON.stringify(dataJSON[name]));
    });
};

let deleteContact = (req, res) => {
    readFile('hobbit.json').then(data => {
        let dataJSON = JSON.parse(data.toString());
        let name = req.url.slice(contactPrefix.length);
        delete dataJSON[name];
        res.end('success');
    });
};

let postContact = (req, res) => {
    readbody(req, body => {
        let contact = JSON.parse(body);
        let dataJSON = JSON.stringify(contact);
        writeFile('hobbit.json', dataJSON).then(() => {
            console.log('success');
        });
        res.end('created contact');
    });
};

let putContact = (req, res) => {
    readbody(req, body => {
        let contact = JSON.parse(body);
        res.end('created contact');
    });
};

let contactPrefix = '/contacts/';

let server = http.createServer((req, res) => {
    if (req.url === '/contacts' && req.method === 'GET') {
        getContacts(req, res);
    } else if (req.url.startsWith(contactPrefix) && req.method === 'GET') {
        getContact(req, res);
    } else if (req.url.startsWith(contactPrefix) && req.method === 'DELETE') {
        deleteContact(req, res);
    } else if (req.url.startsWith(contactPrefix) && req.method === 'POST') {
        postContact(req, res);
    } else if (req.url.startsWith(contactPrefix) && req.method === 'PUT') {
        putContact(req, res);
    }
});

server.listen(3000);
