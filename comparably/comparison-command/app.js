var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var neo4j = require('neo4j');
var request = require('request');

var app = express();
app.use(bodyParser.json());
app.use(cors());

var db = new neo4j.GraphDatabase({ url: process.env.NEO4J_URL });
var authServer = "http://comparably-auth.herokuapp.com";

// Creates a new item with the name from the JSON body, returning the id
// Unauthenticated, since items are not inherently tied to comparisons, and
// we only consider permissions at comparison level. Definitely just demo code!
app.post('/items', function (req, res) {
    var data = req.body;

    var insertQuery = "create (i:Item { name: {name} }) return id(i) as itemId";
    var parameters = { name: data.name };

    db.query(insertQuery, parameters, function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).end();
        } else {
            res.json({ success: true, id: results[0].itemId });
        }
    });
});

// Updates an item with a new name from the JSON body
// Unauthenticated, since items are not inherently tied to comparisons, and
// we only consider permissions at comparison level. Definitely just demo code!
app.put('/items/:itemId', function (req, res) {
    var itemId = parseInt(req.params.itemId, 10);
    var data = req.body;

    var updateQuery = "match (i:Item) where id(i) = {itemId} set i.name = {name}";
    var parameters = { name: data.name, itemId: itemId };

    db.query(updateQuery, parameters, function (err, results) {
        if (err) {
            console.error(err);
            res.status(500).end();
        } else {
            res.json({ success: true, });
        }
    });
});

// Creates a new facet of a comparison describing the given item,
// with the score/description from the JSON body
app.post('/comparisons/:comparisonId/items/:itemId/facets', function (req, res) {
    var comparisonId = parseInt(req.params.comparisonId, 10);
    var itemId = parseInt(req.params.itemId, 10);
    var data = req.body;

    validateForComparison(req.query.token, comparisonId, function (valid) {
        if (!valid) {
            res.status(401).end();
        } else {
            var insertQuery = "match (c:Comparison) where id(c) = {comparisonId} " +
                              "match (i:Item) where id(i) = {itemId} " +
                              "create (f:Facet { description: {description}, score: {score} }) " +
                              "create (f)<-[:includes]-(c) " +
                              "create (f)<-[:described_by]-(i) " +
                              "return id(f) as facetId";
            var parameters = {description: data.description,
                              score: data.score,
                              comparisonId: comparisonId,
                              itemId: itemId};

            db.query(insertQuery, parameters, function (err, results) {
                if (err) {
                    console.error(err);
                    res.status(500).end();
                } else {
                    res.json({ success: true, id: results[0].facetId });
                }
            });
        }
    });
});

// Updates a facet of a comparison with new description and score from the JSON body
app.put('/comparisons/:comparisonId/facets/:facetId', function (req, res) {
    var comparisonId = parseInt(req.params.comparisonId, 10);
    var facetId = parseInt(req.params.facetId, 10);
    var data = req.body;

    validateForComparison(req.query.token, comparisonId, function (valid) {
        if (!valid) {
            res.status(401).end();
        } else {
            var updateQuery = "match (f:Facet) where id(f) = {facetId} " +
                              "set f += { description: {description}, score: {score} }";
            var parameters = {description: data.description,
                              score: data.score,
                              comparisonId: comparisonId,
                              facetId: facetId};

            db.query(updateQuery, parameters, function (err, results) {
                if (err) {
                    console.error(err);
                    res.status(500).end();
                } else {
                    res.json({ success: true });
                }
            });
        }
    });
});

// Validate token and get the corresponding id
// Considers falsey tokens as valid, for userId -1 (guest) user.
function getValidIdForToken(token, callback) {
    if (!token) {
        callback(true, -1);
    } else {
        request(authServer + "/validate/token/" + token, function (error, response, body) {
            if (error || response.statusCode !== 200) callback(false, null);

            var data = JSON.parse(body);
            callback(data.valid, data.id);
        });
    }
}

// Valid the token with the auth server generally, for use with this specific comparison
function validateForComparison(token, comparisonId, callback) {
    getValidIdForToken(token, function (valid, userId) {
        if (valid) {
            // Find this comparison, if we're allowed to see it
            var query = "match (c:Comparison) " +
              "where not (:User)-[:owns]->(c) and id(c) = {comparisonId} return c " +
              "union " +
              "match (c:Comparison)<-[:owns]-(u:User) " +
              "where u.userId = {userId} and id(c) = {comparisonId} return c";
            var parameters = {comparisonId: comparisonId, userId: userId};

            db.query(query, parameters, function (err, results) {
                callback(!err && results.length !== 0);
            });
        } else {
            callback(false);
        }
    });
}

var port = process.env.PORT || 8087;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});