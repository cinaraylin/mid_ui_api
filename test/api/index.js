const { expect } = require("chai");
const API_URL = "/api/books";

describe('Task API Routes', () => {
    beforeEach(function(done) {
        app.db.books = [];
        done();
    });

    describe('GET /books', () => {
      it('Verify that the API starts with an empty store', function(done) {
        request.get(API_URL)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.lengthOf(0);
            done(err);
          });
      });
    });

    describe('PUT /books', () => {
        it('Verify that title is required field', function(done) {
            let book = {
                "author": "stephen king"
            }
            let errorMessage = 'Field title is required.'
            request.put(API_URL)
                .send(book)
                .expect(400)
                .end(function(err, res) {
                    expect(res.error.text).to.equal(errorMessage)
                    done(err);
                });
        });

        it('Verify that author is required field', function(done) {
            let book = {
                "title": "Kujo"
            }
            let errorMessage = 'Field author is required.'
            request.put(API_URL)
                .send(book)
                .expect(400)
                .end(function(err, res) {
                    expect(res.error.text).to.equal(errorMessage)
                    done(err);
                });
          });

          it('Verify that author cannot be empty', function(done) {
            let book = {
                "author": "",
                "title": "title of my test"
            }
            let errorMessage = 'Field author cannot be empty.'
            request.put(API_URL)
                .send(book)
                .expect(400)
                .end(function(err, res) {
                    expect(res.error.text).to.equal(errorMessage)
                    done(err);
                });
            });

            it('Verify that author cannot be empty', function(done) {
                let book = {
                    "author": "Duygu Asena",
                    "title": ""
                }
                let errorMessage = 'Field title cannot be empty.'
                request.put(API_URL)
                    .send(book)
                    .expect(400)
                    .end(function(err, res) {
                        expect(res.error.text).to.equal(errorMessage)
                        done(err);
                    });
            });

            it('Verify that the id field is read−only', function(done) {
                let book = {
                    "id": "4242",
                    "author": "Agatha Christie",
                    "title": "Nil'de Olum"
                }
                let errorMessage = 'Unknown property name: id'
                request.put(API_URL)
                    .send(book)
                    .expect(400)
                    .end(function(err, res) {
                        expect(res.error.text).to.equal(errorMessage)
                        done(err);
                    });
            });

            it('Verify that you can create a new book via PUT', function(done) {
                let book = {
                    "author": "Paul Auster",
                    "title": "City of Glass"
                }
                
                request.put(API_URL)
                    .send(book)
                    .expect(201)
                    .end(function(err, res) {
                        const { id, ...returnedBook } = res.body;
                        expect(returnedBook).to.eql(book)
                        done(err);
                    });
            });
            
            it('Verify that you cannot create a duplicate book', function(done) {
                let book = {
                    "author": "Ursula K. Le Guin",
                    "title": "Mulksuzler"
                }
                const errorMessage = "Another book with similar title and author already exists."
                
                request.put(API_URL)
                    .send(book)
                    .expect(201)
                    .end(function(err, res) {
                        const { id, ...returnedBook } = res.body; 
                        expect(returnedBook).to.eql(book)
                    });

                request.put(API_URL)
                .send(book)
                .expect(400)
                .end(function(err, res) {
                    expect(res.error.text).to.equal(errorMessage)
                    done(err);
                });
            });
      });
});