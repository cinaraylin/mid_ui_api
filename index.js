var express = require('express');
var uuid = require('uuid');
var bodyParser = require('body-parser');
var mandatoryFields = ["title", "author"];

var app = express();
app.db = {books:[]};

app.use(bodyParser.json());

// list all books
app.get('/api/books', (req, res) => {
    return res.json(app.db['books']);
});

//add new book
app.put('/api/books', (req, res) => {
    var book = req.body;

    let errorMessage = "";
    Object.keys(book).forEach(attr => {
        if(!mandatoryFields.includes(attr)) {
            errorMessage = 'Unknown property name: ' + attr;
        }
    });
    mandatoryFields.forEach(field => {
        if(book[field] === undefined)
            errorMessage =  errorMessage || 'Field ' + field + ' is required.';
        else if(!book[field])
            errorMessage = errorMessage || 'Field ' + field + ' cannot be empty.';
    });

    const bookAlreadyExist = app.db.books.find(existingBook => existingBook.author === book.author && existingBook.title === book.title);
    if(bookAlreadyExist) errorMessage = errorMessage || 'Another book with similar title and author already exists.';

    if(errorMessage) return res.status(400).send(errorMessage);

    book.id = uuid.v1();
    app.db["books"].push(book);
    return res.status(201).json(book).end();
});

app.listen(3000, () => {
    console.log("Books API is up and running");
});

module.exports = app;