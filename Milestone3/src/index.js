// Import required modules
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");

// Load environment variables from .env file
require('dotenv').config();


class System {
  static instance;

  // Define the MongoDB connection string using environment variables
  db = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cen4010.7zaydxl.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`

  constructor() {
    // Initialize the express app
    this.app = express();
    this.app.use(cors({ origin: "*" }));

    // Configure body parser
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Serve static files from the public directory
    this.app.use(express.static(path.join(__dirname, "../public")));

    // Set the view engine to EJS
    this.app.set("view engine", "ejs");
    this.app.use(this.systemMiddleware.bind(this));

    // Connect to the MongoDB database
    const BookSchema = require("../schema")
    mongoose.connect(this.db)

    // Define the handleRequest method for rendering EJS templates
    this.handleRequest = (pageName, req, res) => {
      const pageData = { pageTitle: pageName };
      res.render(pageName, pageData);
    }

    // Define the getBorrowedBooks method for retrieving borrowed books from the database
    this.getBorrowedBooks = async (req, res) => {
      try {
        const data = await BookSchema.find();
        return res.status(200).send(data);
      } catch (err) {
        const rsp_obj = { message: "error - resource not found" };
        return res.status(404).end(rsp_obj.message);
      }
    };

    // Define the addBooks method for adding books to the database
    this.addBooks = async (req, res) => {
      try {
        const data = req.body;

        for (const book of data) {
          let { author, title, published, isbn, img } = book;

          const bookExists = await BookSchema.find({ title });
          if (bookExists.length > 0) {
            continue;
          }

          let bookData = new BookSchema({
            author,
            title,
            published,
            isbn,
            img,
          });
          await bookData.save();
        }

        const rsp_obj = {
          message: "Book(s) record created successfully.",
          status: "201",
        };

        return res.status(201).json(rsp_obj);
      } catch (err) {
        const rsp_obj = { message: "error - resource not found" };
        return res.status(404).end(rsp_obj.message);
      }
    }

    // Define the returnBook method for deleting a book from the database
    this.returnBook = async(req, res) => {
      try {
        const { isbn } = req.body;

        // Delete book record from database
        await BookSchema.deleteOne({ isbn });

        // Respond with success message and book isbn
        return res.status(200).json({
          message: `Record ${isbn} deleted successfully!`,
          isbn,
        });
      } catch (err) {
        const rsp_obj = { message: "Error - resource not found" };
        return res.status(404).end(rsp_obj.message);
      }
    }
    
    this.app.listen(3000);
    console.log("Server is running...");

  }
  
  // This function returns the instance of the System class, and creates it if it doesn't exist already
  static getInstance() {
    if (!System.instance) {
      System.instance = new System();
    }
    return System.instance;
  }
  
  // This function handles the middleware for the express app, and routes requests to the appropriate handler functions
  systemMiddleware(req, res, next) {

    // Get the instance of System
    const system = System.getInstance();
    
    // Route requests based on method and URL
    switch (req.method) {
      case "GET":
        switch (req.url) {
          case "/":
            console.log("HELLO")
            res.render("homepage");
            break;
          case "/cart":
            system.handleRequest("cartPage", req, res);
            break;
          case "/borrowedBooks":
            system.handleRequest("borrowedBooksPage", req, res);
            break;
          case "/getBorrowedBooks":
            system.getBorrowedBooks(req, res);
            break;
          default:
            next();
            break;
        }
        break;
      case "POST":
        switch (req.url) {
          case "/addBooks":
            system.addBooks(req, res);
            break;
          default:
            next();
            break;
        }
        break;
      case "DELETE":
        switch (req.url) {
          case "/returnBook":
            system.returnBook(req, res);
            break;
          default:
            next();
            break;
        }
        break;
      default:
        next();
        break;
    }
  }
}

// Get the instance of System - starts backend application.
System.getInstance()