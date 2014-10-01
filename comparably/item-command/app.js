var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var neo4j = require('neo4j');
var request = require('request');

var app = express();
app.use(bodyParser.json());
app.use(cors());

var db = new neo4j.GraphDatabase({ url: process.env.NEO4J_URL });

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

var port = process.env.PORT || 8087;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});