const path = require('path');
const fs = require('fs');
const http = require('http');


const hostname = '127.0.0.1';
const port = 8080;
const server = http.createServer(async (req, res) => {
    const {headers, method, url} = req;
    console.log(method, url);
    switch (method) {
        case 'GET':
            switch(url) {
                case '/':
                    res.setHeader('content-Type', 'text/html');
                    res.writeHead(200);
                    // res.end('<h2>Welcome to Bookdatasolutions!</h2>');
                    fs.readFile(path.join(__dirname, './index.html'), 'utf-8', (err, data) => {
                        res.end(data);
                    });
                    break;
                // case '/search':
                //     const titles = await searchTitles('Madhu', 'file1.xml.json', 'title', 'Title 00000', 1);
                //     console.log(titles);
                //     res.setHeader('content-Type', 'application/json');
                //     res.writeHead(200);
                //     res.end(JSON.stringify(titles));
                //     break;
                default:
                    res.setHeader('content-Type', `${url.search(/.js/) !== -1 ? 'text/javascript' : 'image/png'}`);
                    // console.log(`${url.search(/.js/) !== -1 ? 'text/javascript' : 'image/png'}`);
                    // console.log(path.join(__dirname, url));
                    res.writeHead(200);
                    fs.readFile(path.join(__dirname, url), (err, data) => {
                        res.end(data);
                    });
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