const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');
const bdsutil = require('./src/api/bds-util.js');

bdsutil.createNedbTitles();


const hostname = '127.0.0.1';
const port = 8080;
const server = http.createServer(async (req, res) => {
    const {headers, method} = req;
    const pathname = url.parse(req.url,true).pathname;
    const qs = url.parse(req.url,true).query;
    console.log(method, pathname);
    switch (method) {
        case 'GET':
            switch(pathname) {
                case '/':
                    res.setHeader('content-Type', 'text/html');
                    res.writeHead(200);
                    fs.readFile(path.join(__dirname, './index.html'), 'utf-8', (err, data) => {
                        res.end(data);
                    });
                    break;
                case '/getTitles':
                    console.log(qs);
                    const titles = await bdsutil.searchTitles('Madhu', 'file1.xml.json', 'title', qs.searchkey, qs.pagenum, qs.pagesize);
                    res.setHeader('content-Type', 'application/json');
                    res.writeHead(200);
                    res.end(JSON.stringify(titles));
                    break;
                default:
                    res.setHeader('content-Type', `${pathname.search(/.js/) !== -1 ? 'text/javascript' : 'image/png'}`);
                    res.writeHead(200);
                    fs.readFile(path.join(__dirname, pathname), (err, data) => res.end(data));
                    break;
            }
            break;
        case 'POST':
            break;
        default:
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`BDS Server running at http://${hostname}:${port}`);
});