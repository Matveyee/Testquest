import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import querystring from 'querystring';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const client = new MongoClient('mongodb+srv://matveykarlovw:screemer228@cluster0.sfz0dsq.mongodb.net/');
try{
    client.connect();
    console.log('База данных поключена');
}catch (e) {
    console.log(e);
}
const ques = client.db().collection('questions');

async function getStat(){
    let arr = await ques.find().toArray();
    return JSON.stringify(arr)
}

const server = http.createServer( (req,res) => {
    console.log(req.url)
    if (req.url == '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.writeHead(200, {"Content-type" : "text/html"});
            res.end(data);
        })
    }
    if (req.url == '/stat') {
        fs.readFile(path.join(__dirname, 'stat.html'), (err, data) => {
            res.writeHead(200, {"Content-type" : "text/html"});
            res.end(data);
        })
    }
    if (req.url === '/getStat') {
        getStat().then( arr => {
            res.writeHead(200, {"Content-type" : "text"});
            res.end(arr);
        } )
    }
    let parsedData;
    if (req.method == 'POST') {
        let data = '';
        
        req.on('data', chunk => {
        data += chunk.toString();
        });
        req.on('end', () => {
            parsedData = querystring.parse(data);
            console.log(typeof parsedData)
            console.log(parsedData)
            ques.insertOne(parsedData)
        } )
    }
} );

server.listen( 3000, () => { console.log('Server is working...') });