var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var neo4j = require('neo4j');
var request = require('request');

var app = express();
app.use(bodyParser.text());
app.use(cors());

var db = new neo4j.GraphDatabase({ url: process.env.NEO4J_URL });

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

function dataWithId(node) {
    var result = node.data;
    result.id = node.id;

    return result;
}

var port = process.env.PORT || 8086;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});