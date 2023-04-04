class App {
    constructor() {
      this.state = [];
      this.cart = [];
      this.isLoggedIn = true;
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
  
    init() {
      this.loginButton.addEventListener('click', this.handleLoginButtonClick);
      this.searchIcon.addEventListener('click', this.handleSearch.bind(this))
      this.searchButton.addEventListener('click', this.handleSearch.bind(this))
      this.searchInput.addEventListener('keyup', this.handleSearch.bind(this))
      this.viewCartLink.addEventListener('click', this.viewCartHandler.bind(this))
    }
  
    async handleSearch(event) {
      if (event.key === 'Enter' || event.type === 'click') {
        await this.search();
      }
    }
  
    async search() {
      try {
        const query = this.searchInput.value.trim();
  
        if (query === '') {
          return;
        }
  
        const key = 'AIzaSyAj2K6rhZ7wT_dlp65rCuua2zQr8HYG-Io';
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${key}&maxResults=9`;
        const response = await fetch(url);
        const { items: searchResults } = await response.json();
  
        this.searchResults = searchResults || [];
        this.updateTable();
  
      } catch (error) {
        console.error(error);
      }
    }
  
    updateTable() {
      this.tableBody.innerHTML = '';
  
      this.searchResults.forEach(({ volumeInfo }) => {
        const book = {
          title: volumeInfo.title || 'Unknown title',
          author: Array.isArray(volumeInfo.authors) ? volumeInfo.authors[0] : volumeInfo.authors || 'Unknown author',
          published: volumeInfo.publishedDate ? volumeInfo.publishedDate.slice(0, 4) : 'Unknown year',
          isbn: volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0].identifier : 'Unknown ISBN',
          img: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : 'https://via.placeholder.com/150x200.png?text=No+image',
        };
  
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
  
    handleLoginButtonClick() {
      const username = this.usernameInput.value.trim();
      const password = this.passwordInput.value.trim();
  
      if (username === 'username@fau.edu' && password === 'pass') {
        this.isLoggedIn = true;
  
        const modalDialog = document.querySelector('.modal-dialog');
        modalDialog.style.display = 'none';
        this.modal.classList.remove('show');
        document.querySelector('.modal-backdrop').remove();
        this.modal.style.display = 'none';
  
        document.querySelector('button[data-target="#loginModal"]').innerHTML = 'logout'
        document.querySelector('button[data-target="#loginModal"]').addEventListener('click', this.handleLogoutButtonClick.bind(this))
  
        // Load the cart items from the local storage
        const cartItems = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(cartItems)) {
          this.cart = cartItems;
        }
      } else {
        alert('Invalid username or password');
      }
    }

    handleLogoutButtonClick(){
      window.location.href = "http://localhost:3000/"
    }
  
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
                this.addToCart()
            }
        }

    }

    addToCart = () => {
        var cartCount = document.getElementById("cartCount");
        var count = parseInt(cartCount.innerText);
        count++;
        cartCount.innerText = count;
        cartCount.classList.add("added");
    }

    viewCartHandler = () => {
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }
}
  

  const app = new App()
  app.init()
  