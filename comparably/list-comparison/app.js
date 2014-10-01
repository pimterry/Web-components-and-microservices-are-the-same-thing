var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var neo4j = require('neo4j');
var request = require('request');

var app = express();
app.use(bodyParser.text());
app.use(cors());

var db = new neo4j.GraphDatabase({ url: process.env.NEO4J_URL });
var authServer = "http://comparably-auth.herokuapp.com";

function validateToken(userId, token, callback) {
    request(authServer + "/validate/token/" + token, function (error, response, body) {
        if (error || response.statusCode !== 200) callback(false);

        var data = JSON.parse(body);
        callback(data.valid && data.id === userId);
    });
}

// Returns all comparisons owned by a given user - requires a ?token= parameter for that user
app.get('/comparisons/user/:userId', function (req, res) {
    var query = "match (u:User)-[:owns]->(c:Comparison) " +
                "where u.userId = {userId} " +
                "return c";

    var userId = req.params.userId;
    var token = req.query.token;

    validateToken(userId, token, function (valid) {
        if (valid) {
            db.query(query, {userId: userId}, function (err, results) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var comparisons = results.map(resultToNodeData('c'));
                    res.json(comparisons);
                }
            });
        } else {
            res.status(401).end();
        }
    });
});

// Returns all comparisons owned by a given user
app.get('/comparisons/guest', function (req, res) {
    var query = "match (c:Comparison) " +
                "where NOT (:User)-[:owns]->(c) " +
                "return c";

    db.query(query, function (err, results) {
        if (err) {
            res.status(500).end();
        } else {
            var comparisons = results.map(resultToNodeData('c'));
            res.json(comparisons);
        }
    });
});

function resultToNodeData(key) {
    return function (result) {
        return dataWithId(result[key]);
    }
}

function dataWithId(node) {
    var result = node.data;
    result.id = node.id;

    return result;
}

var port = process.env.PORT || 8088;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});