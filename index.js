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
    console.log('ошибка')
    console.log(e);
}
const ques = client.db().collection('questions');

async function getStat(){
    let arr = await ques.find().toArray();
    return JSON.stringify(arr)
}
async function findUser(x) {
    let user = await ques.findOne({name : x});
    return user;
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
    if (req.url === '/getRes') {
        fs.readFile(path.join(__dirname, 'getres.html'), (err, data) => {
            res.writeHead(200, {"Content-type" : "text/html"});
            res.end(data);
        })
    }
    if (req.url.split('=')[0] === '/result?name') {
        findUser(req.url.split('=')[1]).then( usr => {
            fs.readFile(path.join(__dirname, 'result.html'), (err, data) => {
            let answer ='';
            if (usr.q1 == 'a1') {
                answer = 'Вы любитель экономики - значит вам пойдойдет профессия, связанная с банковским делом, или вы сможете стать бизнесменом.<br>'
            }else if (usr.q1 == 'a2') {
                answer = 'Ваш интерес к техническим наукам говорит о том, что шансы стать инженером или учёным неплохи, главное - стараться и тогда вы сможете достичь своей цели<br>'
            }else if (usr.q1 == 'a3') {
                answer = 'Ваша любовь к книгам показывает, что вы отлично умеете выражать свои мысли и имеете большой словарный запас, а также можете рассуждать на глубокие филосовские темы. Такой набор навыков пригодится писателям, журналистам, режиссёрам.<br>'
            }
            if (usr.q2 == 'a1') {
                answer = answer + 'Интерес к политике может помочь вам освить юридическое дело. Возможно у вас получится занять высокие должности у власти.<br>'
            }else if(usr.q2 == 'a2') {
                answer = answer + 'Любите науку?Отлично, работа учёным-исследователем или профессором в ВУЗе уже не за горами.<br>'
            }else if(usr.q2 == 'a3') {
                answer = answer + 'Все любят фильмы, однако именно ваше воображение может создать гениальный сценарий, который поразит весь мир.<br>'
            }else if (usr.q2 == 'a4') {
                answer = answer + 'Читаете статьи о книгах? Может быть вы будущий литературовед?<br>'
            }
            if (usr.q3 == 'a1') {
                answer = answer + 'Вам нужна работа, которая позволит вам путешевствовать. Не прикрепляйтесь к одному месту.<br>'
            }else if(usr.q3 == 'a2') {
                answer = answer + 'Стабильность - ваше второе имя. Выбирайте профессию, которая позволит хорошо освоиться на одном месте.<br>'
            }
            if (usr.q5 == 'a1') {
                answer = answer + 'Вам необходима профессия, которая подарит вам свободу мысли и творчества, например архитектор, художник, фотограф.<br>'
            }else if (usr.q5 == 'a2'){
                answer = answer + 'Такому отзывчивому человеку как вы подойдёт профессия врача. А может быть вы хотите стать учителем?Такая тяга к работе с людми там очень нужна.<br>'
            }else if(usr.q5 == 'a3') {
                answer = answer + 'Ваша тяга к решение хардкорных задач отлично сочетается с работой программистом. Они там постоянно решают сложные проблемы.<br>'
            }else if(usr.q5 == 'a4') {
                answer = answer + 'Смело можете устраиваться инженером. Желание работать с техникой не даст вам заскучать на этой работе.<br>'
            }
            if(usr.q8 == 'a1') {
                answer = answer + 'Выбирайте работу, позволит раскрыть весь ваш творческий потенциал, например художник, писатель, архитектор или фотограф.<br>'
            }else if(usr.q8 == 'a2') {
                answer = answer + 'Выбирайте профессию, где вы всегда будете работать в команде, например учитель, строитель или программист.<br>'
            }else if(usr.q8 == 'a3') {
                answer = answer + 'Выбирайте работу, где вы сможете структурировать большие массивы данных, например Data-scientist.<br> '
            }
            
            data = data.toString().replace('{result}',answer)
            res.writeHead(200, {"Content-type" : "text/html"});
            res.end(data);
            })
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
            if ( req.url == '/getRes' ) ques.insertOne(parsedData)

        } );

    }
} );

server.listen( 3000, () => { console.log('Server is working...') });