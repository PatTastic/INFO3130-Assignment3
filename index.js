import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser  from 'body-parser';
import Game from './game';

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('www'));
app.use(cookieParser());

app.get('/users/:uname', (req, res) => {
    res.end('Hello ' + req.params.uname);
});

app.post('/sms', (req, res) =>{
    let body = req.body.Body;
    let from = req.body.From;

    Game.play(body, from);
});

app.listen(process.env.PORT || 3000, () => console.log('listening on port ' + (process.env.PORT || 3000)));
console.log('index.js loaded successfully');
