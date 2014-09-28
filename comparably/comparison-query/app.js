var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var neo4j = require('neo4j');

var app = express();
app.use(bodyParser.text());
app.use(cors());

var db = new neo4j.GraphDatabase({ url: process.env.NEO4J_URL });

// Returns all comparisons in the DB
app.get('/comparisons', function (req, res) {
    var query = "match (c:Comparison) return c";

    db.query(query, {}, function (err, results) {
        if (err) {
            res.status(500).send(err);
        } else {
            var comparisons = results.map(resultToNodeData('c'));
            res.json(comparisons);
        }
    });
});

// Returns all comparisons owned by a given user
app.get('/comparisons/user/:id', function (req, res) {
    var query = "match (u:User)-[:owns]->(c:Comparison)" +
                "where u.userId = {userId}" +
                "return c";

    db.query(query, {userId: req.params.id}, function (err, results) {
        if (err) {
            res.status(500).send(err);
        } else {
            var comparisons = results.map(resultToNodeData('c'));
            res.json(comparisons);
        }
    });
});

function resultToNodeData(key) {
    return function (result) {
        var nodeData = result[key].data;
        nodeData.id = result[key].id;
        return nodeData;
    }
}

var port = process.env.PORT || 8086;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});