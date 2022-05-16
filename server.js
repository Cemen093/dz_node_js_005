/*NodeJS - создать CRUD архитектуру для работы с таблицей товары предоставив доступ к ней через Http 	запросы.
    Использовать Express для удобства роутинга.
    Mongobd - выступает хранилищем данных. Описать таблицу "Product" и нормализировать ее.*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const hostname = '127.0.0.1';
const port = 3000;

var ObjectID = require('mongodb').ObjectId;
var db;

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err){
        return console.log(err);
    }
    db = client.db('my_bd');
    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.get('/', function (req, res) {
    res.send('Hello API');
})

app.get('/products', function (req, res) {
    db.collection('products').find().toArray(function (err, docs) {
        if (err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
})

app.get('/products/:id', function (req, res) {
    db.collection('products').findOne({ _id: ObjectID(req.params.id)}, function (err, doc) {
        if (err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    });
})

app.post('/products', function (req, res) {
    let product = {
        name: req.body.name,
        id_manufacturer: req.body.id_manufacturer,
        id_category: req.body.id_category
    }
    db.collection('products').insert(product, function (err, result) {
        if (err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(product);
    })
})

app.put('/products/:id', function (req, res) {
    db.collection('products').updateOne(
        {_id: ObjectID(req.params.id)},
        {$set: {name: req.body.name,
            id_manufacturer: req.body.id_manufacturer,
            id_category: req.body.id_category}},
        function (err, result) {
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
})

app.delete('/products/:id', function (req, res) {
    db.collection('products').deleteOne(
        { _id: ObjectID(req.params.id) },
        function (err, result) {
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});