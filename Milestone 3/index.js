// Initialize an empty array to store items in the cart
const cart = []

// Initialize the variable isLoggedIn to false
let isLoggedIn = false

// Get references to the login button and the modal
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('#loginModal .modal-footer button.btn-primary');
const loginButtonHide = document.querySelector('button[data-target="#loginModal"]');
const modal = document.getElementById('loginModal');

// Attach a click event listener to the login button
loginButton.addEventListener('click', function() {

  // Get the username and password values from the input fields
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Check if the entered username and password are valid
  if (username === 'username@fau.edu' && password === 'password123') {

    // If valid, set isLoggedIn to true and hide the login modal
    isLoggedIn = true
    modal.classList.remove('show');
    document.querySelector('.modal-backdrop').remove();
    loginButtonHide.style.display = 'none';
    const loginButton = document.querySelector('button[data-target="#loginModal"]');
    loginButton.style.display = 'none';
  } else {

    // If invalid, display an error message
    alert('Invalid username or password. Please try again.');
  }
});

// Define an asynchronous function called search that sends a request to the Google Books 
const search = async () => {
    try {

        // Get the search query from the search input field
        const query = document.getElementById('search').value;

        // Set the API key
        const key = "AIzaSyAj2K6rhZ7wT_dlp65rCuua2zQr8HYG-Io"

        // Construct the API URL
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&${key}&maxResults=3`

        // Send a GET request to the API URL and store the response in a variable called response
        const response = await fetch(url)

        // Extract the search results from the response object and store them in a variable called searchResults
        const { items: searchResults } = await response.json()

        // Call the updateTable function to display the search results in a table
        console.log(searchResults);
        updateTable(searchResults)

    } catch (error) {

        // If an error occurs, log it to the console
        console.error(error);
    }
}

// Define a function called updateTable that updates the table with search results
function updateTable(searchResults) {

    // Get a reference to the table body and clear its contents
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    // Loop through each search result and add it to the cart array
    searchResults.forEach((book) => {
        cart.push(book)

        // Create a new table row for the search result
        const row = document.createElement('tr');

        // Populate the table row with data from the search result
        row.innerHTML = `
            <td>${book.volumeInfo.title}</td>
            <td>${book.volumeInfo.authors[0]}</td>
            <td>${book.volumeInfo.publishedDate.slice(0, 4)}</td>
            <td>${book.volumeInfo.industryIdentifiers[0].identifier}</td>
            <td><img src="${book.volumeInfo.imageLinks.smallThumbnail}"></td>
            <td><button id="book-button" class="btn btn-primary">Add to Cart</button></td>
        `;

        // set the inner HTML of the new row with data from the book object
        tableBody.appendChild(row);
      });

      tableBody.addEventListener('click', (event) => {
        if (event.target.matches('button.btn-primary')) {
          if (!isLoggedIn) {
            alert('You must log in first...');
          } else {
            const bookTitle = event.target.parentNode.parentNode.firstChild.textContent;
            console.log(`Added ${bookTitle} to the cart`);
          }
        }
      })
      
}
