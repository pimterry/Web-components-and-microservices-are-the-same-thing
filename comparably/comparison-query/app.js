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

// Returns the full model of a specific comparison
app.get('/comparisons/:id', function (req, res) {
    var query = "match (c:Comparison) where id(c) = {comparisonId} " +
                "optional match (c)-[:includes]->(f:Facet)<-[:described_by]-(i:Item) " +
                "return c, f, i";
    var comparisonId = parseInt(req.params.id, 10);

    db.query(query, {comparisonId: comparisonId}, function (err, results) {
        if (err) {
            res.status(500).end();
        } else if (results.length === 0) {
            res.json(null);
        } else {
            var comparison = dataWithId(results[0].c);
            comparison.items = comparisonResultsToItemList(results);
            res.json(comparison);
        }
    });
});

function comparisonResultsToItemList(results) {
    var itemMap = results.filter(function (row) {
        // Skip rows that didn't optionally match (for comparisons without facets)
        return row.i && row.f;
    }).reduce(function (items, row) {
        var item = dataWithId(row.i);
        items[item.id] = items[item.id] ||
                         { id: item.id, name: item.name, facets: [] };

        items[item.id].facets.push(dataWithId(row.f));
        return items;
    }, {});

    return Object.keys(itemMap).map(function (itemId) {
        return itemMap[itemId];
    });
}

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

var port = process.env.PORT || 8086;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});