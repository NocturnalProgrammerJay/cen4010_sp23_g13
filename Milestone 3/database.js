// Import required modules
const mongoose = require("mongoose")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const ejs = require("ejs");

// Create Express app & Set up middleware
const app = express()
app.set("view engine", "ejs")

app.use(
  cors({
    origin: "http://localhost:3000",
  }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")


app.get("/", async (req, res) => {
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


// app.post("/checkout", async function (req, res) {
//     try {
//       // Extract data from request body
//       const {bookBatch} = req.body;

//       if(bookBatch.length === 0) {
//         throw new Error('error')
//       }
        
//       await Promise.all(
//         bookBatch.map(async el => {
//           const data = new BookSchema({ title: el.title, author: el.author, published: el.published, isbn: el.isbn, img: el.img });
//           await data.save();
//         })
//       );
  
//       // Respond with success message and status code
//       const rsp_obj = {
//         message: "Books registered successfully.",
//         status: "201",
//       };
//       res.status(201).json(rsp_obj);
//     } catch (err) {
//       // Handle error response if student ID already exists
//       const rsp_obj = { message: err.message };
//       return res.status(400).json(rsp_obj);
//     }
//   });

// app.delete("/students/:_id", async function (req, res) {
//     try {
//       const _id = +req.params._id;
//       // Delete student record from database
//       await Students.deleteOne({ _id: _id });
//       // Respond with success message and record ID
//       return res.status(200).json({
//         message: `record ${_id} deleted!`,
//         _id,
//       });
//     } catch (err) {
//       // Handle error response if database operation fails
//       return res.status(404).json({
//         message: "error - resource not found",
//         _id: +req.params._id,
//       });
//     }
//   });


//start the server
app.listen(3000)
console.log("Server is running...")