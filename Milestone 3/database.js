// Import required modules
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BiblioTech API',
      version: '1.0.0',
      description:
        'A library API for browsing  and borrowing books using google books.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./*.js'],
};

const specs = swaggerJsDoc(options);

// Create Express app & Set up middleware
const app = express();
app.set('view engine', 'ejs');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.static(path.join(__dirname, 'js')));

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  res.render('index');
});

app.get('/cart', async (req, res) => {
  res.render('cart');
});

app.get('/borrowedBooks', async (req, res) => {
  res.render('borrowed');
});

const BookSchema = require('./schema');
// Define MongoDB connection string
const db = `mongodb+srv://jamar:1XKbCHqW2NMFOVK2@cen4010.7zaydxl.mongodb.net/BOOKSDB?retryWrites=true&w=majority`;
mongoose.connect(db);
// const collection = db.collection('BOOKSDB');

/**
 *  @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *      - title
 *      - author
 *      - year
 *      - ISBN
 *      properties:
 *        title:
 *          type: string
 *          description: The title of the book
 *        author:
 *          type: string
 *          description: The author of the book
 *        year:
 *          type: int
 *          description: Publication year of the book
 *        ISBN:
 *          type: int
 *          description: The books unique International Standard Book Number
 *      example:
 *        title: Moby Dick
 *        author: Herman Melville
 *        year: 1992
 *        ISBN: 1853260088
 *
 */

/**
 * @swagger
 * paths:
 *  /getBorrowedBooks:
 *    get:
 *      summary: returns a list of borrowed books from the database via 'BookSchema'
 *      responses:
 *        200:
 *          description: returns the mongoose query class containing the currently borrowed books
 */

app.get('/getBorrowedBooks', async function (req, res) {
  try {
    const data = await BookSchema.find();
    return res.status(200).send(data);
  } catch (err) {
    const rsp_obj = { message: 'error - resource not found' };
    return res.status(404).end(rsp_obj.message);
  }
});

/**
 * @swagger
 * paths:
 *  /addBooks:
 *    post:
 *      summary: adds new book instance to borrowed books
 *      parameters:
 *      - in: body
 *        name: book
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *            author:
 *              type: string
 *            published:
 *              type: string
 *            isbn:
 *              type: string
 *      responses:
 *        201:
 *          description: Book(s) record created successfully
 *
 */

app.post('/addBooks', async function (req, res) {
  try {
    const data = req.body;

    for (const book of data) {
      let { author, title, published, isbn, img } = book;

      const bookExists = await BookSchema.find({ title });
      if (bookExists.length > 0) {
        continue;
      }

      let bookData = new BookSchema({ author, title, published, isbn, img });
      await bookData.save();
    }

    const rsp_obj = {
      message: 'Book(s) record created successfully.',
      status: '201',
    };

    return res.status(201).json(rsp_obj);
  } catch (err) {
    const rsp_obj = { message: 'error - resource not found' };
    return res.status(404).end(rsp_obj.message);
  }
});

/**
 * @swagger
 * paths:
 *  /returnBook:
 *    delete:
 *      summary: delete specified book from list by title
 *      parameters:
 *      - in: body
 *        name: book
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *      responses:
 *        200:
 *          description: succesfully deleted book
 *
 *
 */

app.delete('/returnBook', async function (req, res) {
  try {
    const { title } = req.body;

    // Delete book record from database
    await BookSchema.deleteOne({ title });

    // Respond with success message and book title
    return res.status(200).json({
      message: `Record ${title} deleted successfully!`,
      title,
    });
  } catch (err) {
    const rsp_obj = { message: 'Error - resource not found' };
    return res.status(404).end(rsp_obj.message);
  }
});

//start the server
app.listen(3000);
console.log('Server is running...');
