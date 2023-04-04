/**
 * This class represents a web application that allows users to search for books, add them to a cart, and view their cart.
 */
class App {
    constructor() {
      // Initialize the application state
      this.state = [];
      this.cart = [];
      this.isLoggedIn = true;

      // Initialize the input fields, buttons, and modal
      this.usernameInput = document.getElementById('username');
      this.passwordInput = document.getElementById('password');
      this.loginButton = document.querySelector('#loginModal .modal-footer button.btn-primary');
      this.loginButtonHide = document.querySelector('button[data-target="#loginModal"]');
      this.modal = document.getElementById('loginModal');
      this.searchInput = document.getElementById('search');
      this.tableBody = document.querySelector('tbody');
      this.searchResults = [];
      this.viewCartLink = document.getElementById('view-cart');
      this.searchIcon = document.getElementById('searchIcon')
      this.searchButton= document.getElementById('searchButton')
  
      // Bind methods to the class instance so they can be used as event listeners
      this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
      this.handleBookButtonClick = this.handleBookButtonClick.bind(this);
    }
  
    // Initializes the application by adding event listeners to buttons and input fields
    init() {
      this.loginButton.addEventListener('click', this.handleLoginButtonClick);
      this.searchIcon.addEventListener('click', this.handleSearch.bind(this))
      this.searchButton.addEventListener('click', this.handleSearch.bind(this))
      this.searchInput.addEventListener('keyup', this.handleSearch.bind(this))
      this.viewCartLink.addEventListener('click', this.viewCartHandler.bind(this))
    }
  
    /**
     * Handles search events, such as clicking the search button or pressing Enter in the search input field
     * @param {Event} event - The event object.
     */
    async handleSearch(event) {
      if (event.key === 'Enter' || event.type === 'click') {
        await this.search();
      }
    }
  
    // Sends a search request to the Google Books API and updates the search results table
    async search() {
      try {
        const query = this.searchInput.value.trim();
    
        if (query === '') {
          return;
        }
    
        const key = 'AIzaSyAj2K6rhZ7wT_dlp65rCuua2zQr8HYG-Io';
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${key}&maxResults=9`;
        const response = await axios.get(url);
        const { items: searchResults } = response.data;
    
        this.searchResults = searchResults || [];
        this.updateTable();
    
      } catch (error) {
        console.error(error);
      }
    }
  
    // Updates the search results table by creating rows for each book and adding them to the table
    updateTable() {
      this.tableBody.innerHTML = '';
  
      this.searchResults.forEach(({ volumeInfo }) => {
        // Extract relevant information from the volumeInfo object of the book
        const book = {
          title: volumeInfo.title || 'Unknown title',
          author: Array.isArray(volumeInfo.authors) ? volumeInfo.authors[0] : volumeInfo.authors || 'Unknown author',
          published: volumeInfo.publishedDate ? volumeInfo.publishedDate.slice(0, 4) : 'Unknown year',
          isbn: volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0].identifier : 'Unknown ISBN',
          img: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : 'https://via.placeholder.com/150x200.png?text=No+image',
        };
  
        
        // Add the book to the application state if it doesn't already exist in the cart
        const existingBook = Boolean(this.cart.find((item) => item.isbn === book.isbn));
        if (!existingBook) {
          this.state.push(book);
        }
  
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.published}</td>
          <td>${book.isbn}</td>
          <td><img class="book-img" src="${book.img}"></td>
          <td><button class="btn btn-primary" data-isbn="${book.isbn}">Add to Cart</button></td>
        `;
  
        row.querySelector('button').addEventListener('click', this.handleBookButtonClick);
        this.tableBody.appendChild(row);
      });
    }
  
    // This function handles the login button click event
    handleLoginButtonClick() {
      const username = this.usernameInput.value.trim();
      const password = this.passwordInput.value.trim();
  
      if (username === 'username@fau.edu' && password === 'pass') {
        this.isLoggedIn = true
        document.querySelector('#view-cart.nav-link').href = '/cart';
        this.cart = JSON.parse(localStorage.getItem('cart')) || []
        this.updateCartCount()

        // Close the login modal and update the search results table
        document.querySelector('.modal-dialog').style.display = 'none';
        this.modal.classList.remove('show');
        document.querySelector('.modal-backdrop').remove();
        this.updateTable()

        // Update the login/logout button text and functionality
        document.querySelector('button[data-target="#loginModal"]').innerHTML = 'logout'
        document.querySelector('button[data-target="#loginModal"]').addEventListener('click', this.handleLogoutButtonClick.bind(this))

      } else {
        alert('Invalid username or password');
      }
    }

    // This function handles the logout button click event
    handleLogoutButtonClick(){
      window.location.href = "http://localhost:3000/"
    }
  
    // This function handles the book button click event
    handleBookButtonClick(event) {
        if (!this.isLoggedIn) {
            alert('You must log in first...');
        } else {
            const isbn = event.target.dataset.isbn;
            const existingCartItem = Boolean(this.cart.find((item) => item.isbn === isbn));
        
            if (existingCartItem) {
                alert(`Book is already in cart`)
            } else {
                this.cart.push(...this.state.filter(el => el.isbn === isbn ));
                localStorage.setItem("cart", JSON.stringify(this.cart))
                this.updateCartCount()
            }
        }
    }

    // Updates the cart count in the navigation bar
    updateCartCount = () => {
        var cartCount = document.getElementById("cartCount");
        cartCount.innerText = this.cart.length.toString()
        console.log(this.cart.length.toString());
        cartCount.classList.add("added");
    }

    // Handler for viewing the cart
    viewCartHandler = () => {
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }
}

// Create a new instance of the App class and initialize it
const app = new App()
app.init()
