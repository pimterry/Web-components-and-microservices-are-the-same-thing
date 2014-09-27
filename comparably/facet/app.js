var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var cors = require('cors');

var app = express();
app.use(bodyParser.text());
app.use(cors());

// Returns all facets, or a specific subset of facets, depending on whether
// zero or more facet 'id' query parameters are provided.
app.get('/facets', function (req, res) {
    var ids = req.query.id;
    if (!ids) {
        res.json("all!");
    } else if (Array.isArray(ids)) {
        res.json("some!");
    } else {
        res.json("one!");
    }
});

// Creates a new facet with the given details (JSON body), returning its 'id'
app.post('/facets', function (req, res) {
});

// Updates a facet with the provided text
app.put('/facets/:id', function (req, res) {
    var facetId = req.params.id;
});

var port = process.env.PORT || 8086;

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});