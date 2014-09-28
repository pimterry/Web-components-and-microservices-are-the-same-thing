var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uuid = require('uuid');
var cors = require('cors');

var app = express();
app.use(bodyParser.text());
app.use(cors());

mongoose.connect(process.env.MONGOLAB_URI);

var User = mongoose.model('User', { name: { type: String, unique: true },
                                    password: String,
                                    token: { type: String, unique: true } });

function generateToken() {
    return uuid.v4();
}

// Takes a token, returns with 'valid' bool, and the matching user 'id' (if valid)
app.get('/validate/token/:token', function (req, res) {
    var token = req.params.token;

    User.findOne({token: token}, function (err, user) {
        if (err) {
            res.status(500).send(err);
        } else if (!user) {
            res.json({ valid: false });
        } else {
            res.json({ id: user.id, valid: true });
        }
    });
});

// Creates a new user. Returns with the 'username' and a valid login 'token'
app.post('/user/:username/create', function (req, res) {
    var username = req.params.username;
    var password = req.body;

    var token = generateToken();
    var user = new User({name: username, password: password, token: token});

    user.save(function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ username: user.name, token: user.token });
        }
    });
});

// Logs in as an existing user, returning the 'username', 'id', and a valid login 'token'
app.post('/user/:username/login', function (req, res) {
    var username = req.params.username;
    var password = req.body;

    User.findOne({name: username, password: password}, function (err, user) {
        if (err) {
            res.status(500).send(err);
        } else if (!user) {
            res.status(401).end();
        } else {
            user.token = generateToken();
            user.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                }
                res.json({ username: user.name, id: user.id, token: user.token });
            });
        }
    });
});

var port = process.env.PORT || 8085;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});