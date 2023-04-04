
/**
 * Class for managing the user's cart
 */
class CartManager {
  constructor() {
    // Initialize the cart with the contents of local storage or an empty array
    this.cart = JSON.parse(localStorage.getItem("cart")) || []

    // Get references to relevant elements in the DOM
    this.tableBody = document.querySelector('tbody');
    this.viewCartLink = document.getElementById('my-books');
    this.checkoutModal = document.getElementById('checkout-modal');
    this.checkoutModal2 = document.getElementById("checkoutModal");
    this.modalBackdrop = document.createElement('div');
    this.confirmCheckoutButton = document.getElementById('confirmCheckoutButton');
    this.logoutButton = document.querySelector('.btn-info');
  }
  
  // Clear the cart and redirect to the home page
  init() {
    this.cart.length > 0 && this.updateTable()
    this.buttonEventListener();
    this.logout();
 
    this.viewCartLink.addEventListener('click', () => {
      localStorage.setItem("cart", JSON.stringify(this.cart));
      window.location.href = "borrowedBooks";
    });
  
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutModal2 = document.getElementById("checkoutModal");
    const modalBackdrop = document.createElement('div');
    const confirmCheckoutButton = document.getElementById('confirmCheckoutButton');
  
    confirmCheckoutButton.addEventListener('click', async () => {
      if (this.cart.length === 0) {
        alert("cart is empty...")
        return;
      }
  
      checkoutModal2.style.display = "none";
  
      document.getElementsByClassName('my-5')[0].style.display = 'none';
      document.getElementsByClassName('my-3')[0].style.display = 'none';
      document.getElementsByClassName('center')[0].style.display = 'none';
  
      checkoutModal.classList.add('show');
      checkoutModal.style.display = 'block';
  
      document.body.appendChild(modalBackdrop);
      document.body.style.backdropFilter = 'blur(5px)';
  
      await fetch('http://localhost:3000/addBooks', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.cart)
      });
  
      setTimeout(() => {
        this.cart = []
        localStorage.setItem("cart", JSON.stringify(this.cart));
        window.location.href = "borrowedBooks";
      }, 2500);
    });
  }
  
  // Method to update the table with the contents of the cart
  updateTable() {
    this.tableBody.innerHTML = '';
    this.cart.forEach((book) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.published}</td>
        <td>${book.isbn}</td>
        <td><img src="${book.img}"></td>
        <td><button class="btn btn-danger" data-isbn="${book.isbn}">Remove from Cart</button></td>
      `;
      this.tableBody.appendChild(row);
    });
    this.deleteHandler()
  }
  
  // Adds event listener to the "Checkout" button
  buttonEventListener() {
    this.confirmCheckoutButton.addEventListener('click', async () => {
      if (this.cart.length === 0) {
        alert("cart is empty...");
        return;
      }

      // Hide the checkout modal
      this.checkoutModal2.style.display = "none";

      // Hide other elements on the page
      document.getElementsByClassName('my-5')[0].style.display = 'none';
      document.getElementsByClassName('my-3')[0].style.display = 'none';
      document.getElementsByClassName('center')[0].style.display = 'none';

      // Show the success modal
      this.checkoutModal.classList.add('show');
      this.checkoutModal.style.display = 'block';

      // Add the modal backdrop to the body
      document.body.appendChild(this.modalBackdrop);

      // Add the "blur" effect to the body
      document.body.style.backdropFilter = 'blur(5px)';

      // Send a POST request to the server
      await fetch('http://localhost:3000/addBooks', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.cart)
      });

      // Redirect to the borrowedBooks page after 2.5 seconds
      setTimeout(() => {
        this.cart = []
        localStorage.setItem("cart", JSON.stringify(this.cart))
        window.location.href = "borrowedBooks";
      }, 2500);
    });
  }


  // Adds event listeners to the "Remove from Cart" buttons
  deleteHandler(){
    const btnPrimary = document.querySelectorAll('button.btn-danger');
    btnPrimary.forEach((button) => {
      button.addEventListener('click', (event) => {
        const isbn = event.target.dataset.isbn;
        this.cart = this.cart.filter(el => el.isbn !== isbn);
        localStorage.setItem("cart", JSON.stringify(this.cart))
        this.updateTable()
      });
    });
  }

  // Adds event listener to the "Logout" button
  logout() {
    this.logoutButton.addEventListener("click", () => {
      this.cart = [];
      window.location.href = "http://localhost:3000/";
    });
  }
}

// Create a new instance of the CartManager class and initialize it
const cartManager = new CartManager();
cartManager.init();