import express from 'express';
import bodyParser  from 'body-parser';
import game from './game';

const Game = game.Game;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('www'));
app.use(express.json());

/**
 * Entry point for the browser
 * @param {any} req - Request
 * @param {any} res - Result
 */
app.post('/web', (req, res) => {
    let body = req.body.body;
    let from = req.body.from;

    Game.play(req, res, body, from);
});

/**
 * Entry point for SMS, Twilio WebHook
 * @param {any} req - Request
 * @param {any} res - Result
 */
app.post('/sms', (req, res) =>{
    let body = req.body.Body;
    let from = req.body.From;

    Game.play(req, res, body, from);
});

app.listen(process.env.PORT || 3000, () => console.log('listening on port ' + (process.env.PORT || 3000)));
console.log('index.js loaded successfully');
