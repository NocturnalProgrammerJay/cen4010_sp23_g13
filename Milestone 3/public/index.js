 // Initialize an empty array to store items in the cart and state
        const state = []
        const cart = []


        // Initialize the variable isLoggedIn to false
        let isLoggedIn = false

        // Get references to the login button and the modal
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginButton = document.querySelector('#loginModal .modal-footer button.btn-primary');
        const loginButtonHide = document.querySelector('button[data-target="#loginModal"]');
        const modal = document.getElementById('loginModal');

        // Attach event listener to the login button
        loginButton.addEventListener('click', function () {

            // Get the username and password values from the input fields
            const username = usernameInput.value;
            const password = passwordInput.value;

            // Check if the entered username and password are valid
            if (username === 'username@fau.edu' && password === 'password123') {

                // If valid, set isLoggedIn to true and hide the login modal
                isLoggedIn = true
                var modalDialog = document.querySelector('.modal-dialog');
                modalDialog.style.display = 'none';

                modal.classList.remove('show');
                document.querySelector('.modal-backdrop').remove();
                loginButtonHide.style.display = 'none';
                const loginButton = document.querySelector('button[data-target="#loginModal"]');
                loginButton.style.display = 'none';
                updateLogin()

            } else {

                // If invalid, display an error message
                alert('Invalid username or password. Please try again.');
            }
        });

        // Define function for sending search request to Google Books API
        const search = async () => {
            try {

                // Get the search query from the search input field
                const query = document.getElementById('search').value;

                // Return if search query is empty
                if (query === "") {
                    return
                }

                // Set the API key
                const key = "AIzaSyAj2K6rhZ7wT_dlp65rCuua2zQr8HYG-Io"

                // Construct the API URL
                const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&${key}&maxResults=9`

                // Send a GET request to the API URL and store the response in a variable called response
                const response = await fetch(url)

                // Extract the search results from the response object and store them in a variable called searchResults
                const { items: searchResults } = await response.json()

                // Call the updateTable function to display the search results in a table
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
            searchResults.forEach(({ volumeInfo }) => {

                const book = {
                    title: volumeInfo.title || 'Unknown title',
                    author: Array.isArray(volumeInfo.authors) ? volumeInfo.authors[0] : volumeInfo.authors || 'Unknown author',
                    published: volumeInfo.publishedDate ? volumeInfo.publishedDate.slice(0, 4) : 'Unknown year',
                    isbn: volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0].identifier : 'Unknown ISBN',
                    img: volumeInfo.imageLinks ? volumeInfo.imageLinks.smallThumbnail : 'https://via.placeholder.com/150x200.png?text=No+image',
                    isSelected: false
                };

                // Update state with new books
                const existingBook = Boolean(state.find((item) => item.title === book.title));

                // If book doesn't exist in state, then append book to state
                if (!existingBook) {
                    state.push(book);
                }

                // Create a new table row for the search result
                const row = document.createElement('tr');

                // Populate the table row with data from the search result
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.published}</td>
                    <td>${book.isbn}</td>
                    <td><img src="${book.img}"></td>
                    <td><button id="book-button" class="btn btn-primary" data-book="${book.title}">Add to Cart</button></td>
                `;

                // set the inner HTML of the new row with data from the book object
                tableBody.appendChild(row);
            });

            //create eventListener for each button thats create each time the client makes an API call
            buttonEventListener()
        }

        // This function adds an event listener to all buttons with the class "btn-primary"
        const buttonEventListener = () => {
            const btnPrimary = document.querySelectorAll('button.btn-primary');

            // Iterate over each button and add a click event listener
            btnPrimary.forEach((button) => {

                // If the user is not logged in, show an alert message
                button.addEventListener('click', (event) => {
                    if (!isLoggedIn) {
                        alert('You must log in first...');
                    } else {
                        const book = event.target.dataset.book;
                        const existingCartItem = Boolean(cart.find(el => el.title === book));

                        // If the book is already in the cart, show an alert message
                        if (existingCartItem === true) {
                            alert(`Book is already in cart`)

                            // If the book is not in the cart, add it to the cart and update the cart count
                        } else {

                            // If the user is logged in, check if the book is already in the cart
                            cart.push(...state.filter(el => el.title === book));
                            addToCart()
                        }
                    }
                })
            });
        }

        // This function updates the cart count when a book is added to the cart
        const addToCart = () => {
            var cartCount = document.getElementById("cartCount");
            var count = parseInt(cartCount.innerText);
            count++;
            cartCount.innerText = count;
            cartCount.classList.add("added");
        }

        // This function updates the login/logout button in the navbar based on the user's login status
        const updateLogin = () => {
            const navbar = document.querySelector('.navbar-nav');
            if (isLoggedIn) {
                // If the user is logged in, show a logout button
                const logoutItem = document.createElement('li');
                logoutItem.classList.add('nav-item');
                const logoutButton = document.createElement('button');
                logoutButton.type = 'button';
                logoutButton.classList.add('btn', 'btn-outline-dark');
                logoutButton.textContent = 'Logout';
                logoutButton.addEventListener('click', () => {

                    // When the logout button is clicked, log the user out and wipe their cart and state
                    isLoggedIn = false;
                    updateLogin();

                    //wipe user memory
                    state.length = 0
                    cart.length = 0
                });
                logoutItem.appendChild(logoutButton);
                navbar.replaceChild(logoutItem, navbar.children[navbar.children.length - 1]);
            } else {

                // If the user is not logged in, show a login button
                const loginButton = document.createElement('button');
                loginButton.type = 'button';
                loginButton.classList.add('btn', 'btn-outline-dark');
                loginButton.textContent = 'Login';
                loginButton.addEventListener('click', () => {

                    // When the login button is clicked, log the user in and update the navbar
                    isLoggedIn = true;
                    updateLogin();
                });
                navbar.replaceChild(loginButton, navbar.children[navbar.children.length - 1]);
            }
        }

        const viewCartLink = document.getElementById('view-cart');
        viewCartLink.addEventListener('click', () => {
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.href = "cart";
        }); 