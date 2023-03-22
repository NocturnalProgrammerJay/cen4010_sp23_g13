const mysql = require('mysql2')

// create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'cen4010sp23g13',
  password: 'ASpring#2023',
  database: 'cen4010sp23g13'
})

// connect to the database
connection.connect(function(err) {
  if (err) throw err
  console.log('Connected to MySQL database!')
})

// perform database operations here...

// close the connection when finished
connection.end(function(err) {
  if (err) throw err
  console.log('Disconnected from MySQL database!')
})