
class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || []
    this.tableBody = document.querySelector('tbody');
    this.viewCartLink = document.getElementById('my-books');
    this.checkoutModal = document.getElementById('checkout-modal');
    this.checkoutModal2 = document.getElementById("checkoutModal");
    this.modalBackdrop = document.createElement('div');
    this.confirmCheckoutButton = document.getElementById('confirmCheckoutButton');
    this.logoutButton = document.querySelector('.btn-info');
  }

  updateTable() {
    // Clear the contents of the table body
    this.tableBody.innerHTML = '';

    // Loop through each book in the cart and add it to the table
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

  deleteHandler(){
    // Add event listeners to the "Remove from Cart" buttons
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

      // Redirect to the borrowedBooks page
      setTimeout(() => {
        this.cart = []
        localStorage.setItem("cart", JSON.stringify(this.cart))
        window.location.href = "borrowedBooks";
      }, 2500);
    });
  }

  logout() {
    this.logoutButton.addEventListener("click", () => {
      this.cart = [];
      window.location.href = "http://localhost:3000/";
    });
  }

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

}
  
const cartManager = new CartManager();
cartManager.init();