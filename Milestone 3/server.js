const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BiblioTech API',
      version: '1.0.0',
      description: 'A library API for browsing books using google books.',
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

const port = 3000;
const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.static(path.join(__dirname, 'js')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

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
 *        id:
 *          type: string
 *          description: Identifier unique to each book
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
 *        id: 123456
 *        title: Moby Dick
 *        author: Herman Melville
 *        year: 1992
 *        ISBN: 1853260088
 *
 */

/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      summary: Loads the landing page of the API application
 *      responses:
 *        200:
 *          description: Sends the index.html file successfuly
 *          content:
 *            text/html:
 *              schema:
 *                type: string
 *
 */

app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}/index.html`);
});
