require('dotenv').config()
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack)
    return
  }

  console.log('Connected to database with ID: ' + connection.threadId)
})

// Read all data from the database
const readAllData = () => {
    const sql = 'SELECT * FROM my_table'
  
    connection.query(sql, (err, result) => {
      if (err) throw err
  
      return result
    })
  }

// Read data basic off id
const readData = (id) => {
    const sql = 'SELECT * FROM my_table WHERE id = ?'
  
    connection.query(sql, [id], (err, result) => {
      if (err) throw err
  
      //DB DATA
      console.log(result)
    })
}

connection.end((err) => {
  if (err) {
    console.error('Error disconnecting from database: ' + err.stack)
    return
  }

  console.log('Disconnected from database.')
})

//----------------------------------------------------------------------------------------

const results = readAllData()
