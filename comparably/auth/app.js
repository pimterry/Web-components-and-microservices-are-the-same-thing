var express = require('express');

var app = express();

app.get('/tokens/validate/:token', function (req, res) {
    var token = req.params.token;
    res.json({ token: token, valid: token === "1" });
});

var port = process.env.PORT || 8085;
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});