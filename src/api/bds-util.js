// const { once } = require('events');
const path = require('path');
const fs = require('fs');
// const { title } = require('process');
const readline = require('readline');
// const http = require('http');
// const { hostname } = require('os');

const db = require('nedb');
const coll = new db({filename:`${__dirname}/users/Madhu/temp/neDbSample.txt`, autoload: true});
console.log(`${__dirname}/users/Madhu/temp/neDbSample.txt`);
// create random nedb data
const createNedbTitles = () => {
    const titles = [];
    for (let i=5; i>0; i--) {
        let titlesuffix = '0'.repeat(7-i.toString().length) + i.toString();
        const title = JSON.parse(`{"recref": "${Math.floor(Math.random() * 100000000)}", "title": "Title ${titlesuffix}", "author": "Author ${Math.random().toString(36).substring(2)}"}\n`);
        titles.push(title);
        coll.insert(titles, (err, docs) => {
           console.log(docs.length);
        });
    }
}

// create random json data
const createRandomTitles = (file) => {
    for (let i=1000000; i>0; i--) {
        let titlesuffix = '0'.repeat(7-i.toString().length) + i.toString();
        fs.appendFileSync(`${__dirname}/users/Madhu/${file}`,`{"recref": "${Math.floor(Math.random() * 100000000)}", "title": "Title ${titlesuffix}", "author": "Author ${Math.random().toString(36).substring(2)}"}\n`); 
      }      
}
// createRandomTitles('file1.xml.json');

const sortTitles = (user, file, sortby) => {
    let titles = [];
    let chunks = [];
    let reccount = 0;
    const stream = fs.createReadStream(`${__dirname}/users/${user}/${file}`, {flag: 'r', encoding: 'utf-8'});
    let count = 1;
    let json = '';
    stream.on('data', (chunk) => {
        let numrecs = 0;
        let jss = 0;
        let jso = 0;
        json += chunk;
        while (jso !== -1) {
            jss = json.search(/\{/g);
            jso = json.search(/\}\s*\{*/g);
            if (jso !== -1) {
                titles.push(JSON.parse(json.substring(jss,jso+1)));
                json = json.slice(jso+1);
                numrecs++;
            }
        }
        titles.sort((a,b) => (a[`${sortby}`].toUpperCase() > b[`${sortby}`].toUpperCase()) ? 1 : -1);
        fs.appendFileSync(`${__dirname}/users/${user}/temp/Chunk${count}.json`, `${JSON.stringify(titles,null,1)}`);
        chunks.push(`Chunk${count++}`);
        console.log(`Chunk${count++} => ${numrecs}`);
        reccount += numrecs;
        titles = [];
    });

  
    stream.on('end', (chunk) => {
        console.log(`Sorting [${file}] by [${sortby}] => ${reccount} records`);
        let msort = [];
        
        // read first object from each sorted file
        chunks.forEach(file => {
            let cl = [];
            cl = JSON.parse(fs.readFileSync(`${__dirname}/users/${user}/temp/${file}.json`));
            cl[0].file = file;

            // build a heap to hold intermediate min objects
            msort.push(cl[0]);

            // write back to file with first object removed;
            cl.shift();
            fs.writeFileSync(`${__dirname}/users/${user}/temp/${file}.json`, `${JSON.stringify(cl,null,1)}`);
        });

        // merge sort
        const ofile = `${__dirname}/users/${user}/${file}.${sortby}`;
        if(fs.existsSync(ofile)) fs.unlinkSync(ofile);
        let rec = 0
        do {
            // sort msort heap
            msort.sort((a,b) => (a[`${sortby}`].toUpperCase() > b[`${sortby}`].toUpperCase()) ? 1 : -1);

            // remove min object from msort heap
            let minobj = msort.shift();

            // write min object to final sorted file
            fs.appendFileSync(ofile, `${JSON.stringify(minobj)}\n`);

            // read the first object from the min file and push it to msort
            let fmin = minobj.file;
            let mf = JSON.parse(fs.readFileSync(`${__dirname}/users/Madhu/temp/${fmin}.json`));

            // write back to file with first object removed;
            if (mf.length > 0) {
                minobj = mf.shift();
                minobj.file = fmin;
                msort.push(minobj);
                fs.writeFileSync(`${__dirname}/users/${user}/temp/${minobj.file}.json`, `${JSON.stringify(mf,null,1)}`);
            }
        } while (++rec < reccount);

        // remove temp chunk files
        chunks.forEach(file => {fs.unlinkSync(`${__dirname}/users/${user}/temp/${file}.json`)});
    });
   
  }

// sortTitles('Madhu', 'file1.xml.json', 'title');
//sortTitles('Madhu', 'file1.xml.json', 'author');


const searchTitles = async (user, file, searchby, searchkey, pagenum, pagesize) => {
    let titles = [];
    let pagestart = (pagenum-1) * pagesize;
    let pageend = pagenum * pagesize;
    const stream = readline.createInterface ({
        input: fs.createReadStream(path.join(__dirname, `../../users/${user}/${file}.${searchby}`), {flag: 'r', encoding: 'utf-8'}),
        crlfDelay: Infinity
    });

    let ind = 0;
    for await (const line of stream) {
        const title = JSON.parse(line).title;
        if (title.search(`${searchkey}`) !== -1) {
            if (ind >= pagestart && ind < pageend) {
                if (titles.length < pagesize) {
                    titles.push(line);
                }
            }
            ind++;
        }
    }
    if (titles.length > 0) {
        const rec1 = JSON.parse(titles[0]);
        rec1.file = ind; // total records
        titles[0] = JSON.stringify(rec1);
    }
    console.log(titles, `${pagestart+1} - ${pageend} of ${ind}`);
    return titles;

}
// searchTitles('Madhu', 'file1.xml.json', 'title', 'Title 00000', 1);


// const hostname = '127.0.0.1';
// const port = 8080;
// const server = http.createServer(async (req, res) => {
//     const {headers, method, url} = req;
//     console.log(method, url);
//     switch (method) {
//         case 'GET':
//             switch(url) {
//                 case '/':
//                     res.setHeader('content-Type', 'text/html');
//                     res.writeHead(200);
//                     res.end('<h2>Welcome to Bookdatasolutions!</h2>');
//                     break;
//                 case '/search':
//                     const titles = await searchTitles('Madhu', 'file1.xml.json', 'title', 'Title 00000', 1);
//                     console.log(titles);
//                     res.setHeader('content-Type', 'application/json');
//                     res.writeHead(200);
//                     res.end(JSON.stringify(titles));
//                     break;
//             }
//             break;
//         case 'POST':
//             break;
//         default:
//             break;
//     }
// });

// server.listen(port, hostname, () => {
//     console.log(`BDS Server running at http://${hostname}:${port}`);
// });

module.exports = {createNedbTitles,searchTitles};