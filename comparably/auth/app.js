console.log("Starting!");

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.text());

app.get('/validate/token/:token', function (req, res) {
    var token = req.params.token;
    res.json({ token: token, valid: token === "1" });
});

app.post('/user/:username/login', function (req, res) {
    var username = req.params.username;
    var password = req.body;

    var success = (username === "tim" && password === "password1");

    if (success) {
        var token = 1;
        res.json({ username: username, token: token });
    } else {
        res.status(401).end();
    }
});

var port = process.env.PORT || 8085;

console.log("Starting server on %d", port)
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});