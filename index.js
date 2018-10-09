import express from 'express';
import bodyParser  from 'body-parser';
import game from './game';

const Game = game.Game;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('www'));

app.get('/test', (req, res) => {
    let body = 'test';
    let from = '5198076720';

    Game.play(req, res, body, from);
})

app.get('/users/:uname', (req, res) => {
    res.end('Hello ' + req.params.uname);
});

app.post('/sms', (req, res) =>{
    let body = req.body.Body;
    let from = req.body.From;

    Game.play(req, res, body, from);
});

app.listen(process.env.PORT || 3000, () => console.log('listening on port ' + (process.env.PORT || 3000)));
console.log('index.js loaded successfully');
