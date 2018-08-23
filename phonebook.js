const http = require('http');
const fs = require('fs');
const promisify = require('util').promisify;
const pg = require('pg-promise')();
const dbConfig = 'postgres://andrewchoi@localhost:5432/phonebook';
const db = pg(dbConfig);

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

db.query('select * from people;')
    .then((results) => {
        console.log(results)
    });

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

let createContact = (req, res) => {
    readbody(req, body => {
        let contact = JSON.parse(body);
        let dataJSON = JSON.stringify(contact);
        writeFile('hobbit.json', dataJSON).then(() => {
            console.log('success');
        });
        res.end('created contact');
    });
};

let fileServe = (req, res) => {
    readFile(req.url.slice(1)).then(data => {
        res.end(data);
    }).catch(err => {
        notfound(err, res)
    });
};

let notfound = (err, res) => {
    res.end(JSON.stringify(err));
};

const routes = [
    {
        method: 'GET',
        url: /^\/contacts\/[0-9]+$/,
        run: getContact
    },
    {
        method: 'DELETE',
        url: /^\/contacts\/[0-9]+$/,
        run: deleteContact
    },
    {
        method: 'GET',
        url: /^\/contacts\/?$/,
        run: getContacts
    },
    {
        method: 'POST',
        url: /^\/contacts\/?$/,
        run: createContact
    },
    {
        method: 'GET',
        url: /^.*$/,
        run: fileServe
    }
];


let server = http.createServer((req, res) => {
    let route = routes.find(route => route.url.test(req.url) && req.method === route.method);
    route.run(req, res);
});

server.listen(3000);
