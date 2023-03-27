const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Libster API',
      version: '1.0.0',
      description: 'A library API for browsing books using google books.',
    },
    servers: [
      {
        url: 'cen4010-sp23-g13@lamp.cse.fau.edu',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

const port = 3000;
const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.static(path.join(__dirname, 'js')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}/index.html`);
});
