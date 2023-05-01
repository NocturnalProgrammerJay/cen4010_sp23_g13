
/**
 * A class that manages books and their borrowing status.
 */
class BookManager {
    constructor() {
      // The state of the book manager
      this.state = [];

      // Get references to relevant elements in the DOM
      this.tableBody = document.querySelector('tbody');
      this.logoutButton = document.querySelector('.btn-info');

      this.borrowedBooksUrl = "http://localhost:3000/getBorrowedBooks";
      this.returnBookUrl = "http://localhost:3000/returnBook";
    }

    //Initializes the book manager by fetching the borrowed books and updating the table.
    async init() {
      try {
        const response = await fetch(this.borrowedBooksUrl);
        const data = await response.json();
        this.state = data;
        this.updateTable();
      } catch (error) {
        console.log(error);
      }
    
      this.updateTable()
      this.logoutButton.addEventListener("click", this.logout.bind(this));
    }
    
  
    //Updates the table with the books in the current state
    updateTable() {
      this.tableBody.innerHTML = '';
  
      // Loop through each book in the state and add it to the table
      this.state.forEach((book) => {
        console.log(book.img)
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.published}</td>
          <td>${book.isbn}</td>
          <td><img src="${book.img}"></td>
          <td><button class="btn btn-success" data-isbn="${book.isbn}">Return Book</button></td>
        `;
        this.tableBody.appendChild(row);
      });
      // Add an event listener to the return book buttons
      this.buttonEventListener()
    }
  
    //Adds an event listener to each return book button.
    buttonEventListener() {
      const buttons = document.querySelectorAll('button.btn-success');
      buttons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          const isbn = event.target.dataset.isbn;
          const data = {
            isbn: isbn
          };
    
          // Send a DELETE request to the server to return the book
          await fetch(this.returnBookUrl, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });
    
          // Remove the book from the state and update the table
          this.state = this.state.filter(el => el.isbn !== isbn);
          this.updateTable();
        });
      });
    }
    
  
    // Logs the user out of the book manager and redirects them to the homepage.
    logout() {
      this.state = [];
      window.location.href = "http://localhost:3000/";
    }
  }

  // Create a new instance of the BookManager class and initialize it
  const bookManager = new BookManager();
  bookManager.init();
  