// Import required modules
const mongoose = require("mongoose")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const ejs = require("ejs");

// Create Express app & Set up middleware
const app = express()
const mime = require('mime');
const path = require('path');

app.set("view engine", "ejs")

app.use(
  cors({
    origin: "http://localhost:3000",
  }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")


app.get("/", async (req, res) =>  {
  res.render("index");
});

app.get("/cart", async (req, res) => {
    res.render("cart");
});

app.get("/borrowedBooks", async (req, res) => {
    res.render("borrowed");
});


const BookSchema = require("./schema")
// Define MongoDB connection string
const db = `mongodb+srv://jamar:1XKbCHqW2NMFOVK2@cen4010.7zaydxl.mongodb.net/BOOKSDB?retryWrites=true&w=majority`
mongoose.connect(db)
// const collection = db.collection('BOOKSDB');

app.get("/getBorrowedBooks", async function (req, res) {
    try {
        const data = await BookSchema.find();
        return res.status(200).send(data);
    } catch (err) {
      const rsp_obj = { message: "error - resource not found" };
      return res.status(404).end(rsp_obj.message);
    }
});

app.post("/addBooks", async function (req, res) {
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
      message: "Book(s) record created successfully.",
      status: "201",
    };

    return res.status(201).json(rsp_obj);
  } catch (err) {
    const rsp_obj = { message: "error - resource not found" };
    return res.status(404).end(rsp_obj.message);
  }
});

app.delete("/returnBook", async function (req, res) {
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
    const rsp_obj = { message: "Error - resource not found" };
    return res.status(404).end(rsp_obj.message);
  }
});


//start the server
app.listen(3000)
console.log("Server is running...")