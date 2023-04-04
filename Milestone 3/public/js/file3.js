class BookManager {
    constructor() {
      this.state = [];
      this.tableBody = document.querySelector('tbody');
      this.logoutButton = document.querySelector('.btn-info');
      this.borrowedBooksUrl = "http://localhost:3000/getBorrowedBooks";
      this.returnBookUrl = "http://localhost:3000/returnBook";
    }
  
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
  
    updateTable() {
      // Clear the table body contents
      this.tableBody.innerHTML = '';
  
      // Loop through each book in the state and add it to the table
      this.state.forEach((book) => {
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
      this.buttonEventListener()
    }
  
    buttonEventListener() {
      const buttons = document.querySelectorAll('button.btn-success');
      buttons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          const isbn = event.target.dataset.isbn;
          const data = {
            isbn: isbn
          };
  
          await fetch(this.returnBookUrl, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });
  
          this.state = this.state.filter(el => el.isbn !== isbn);
          this.updateTable();
        });
      });
    }
  
    logout() {
      this.state = [];
      window.location.href = "http://localhost:3000/";
    }
  }
  
  const bookManager = new BookManager();
  bookManager.init();
  