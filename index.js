import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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

const server = http.createServer( (req,res) => {
    if (req.url == '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.writeHead(200, {"Content-type" : "text/html"});
            res.end(data);
        })
    }
} );

server.listen( 3000, () => { console.log('Server is working...') });