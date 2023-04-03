let cart = JSON.parse(localStorage.getItem("cart"))
        function updateTable() {

            // Get a reference to the table body and clear its contents
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = '';

            // Loop through each search result and add it to the cart array
            cart.forEach((book) => {
                // Create a new table row for the search result
                const row = document.createElement('tr');

                // Populate the table row with data from the search result
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.published}</td>
                    <td>${book.isbn}</td>
                    <td><img src="${book.img}"></td>
                    <td><button id="book-button" class="btn btn-danger" data-book="${book.title}">Remove from Cart</button></td>
                `;
                // set the inner HTML of the new row with data from the book object
                tableBody.appendChild(row);

            });
            buttonEventListener()
        }

        // This function adds an event listener to all buttons with the class "btn-danger"
        const buttonEventListener = () => {
            const btnPrimary = document.querySelectorAll('button.btn-danger');
            btnPrimary.forEach((button) => {
                button.addEventListener('click', (event) => {
                    const book = event.target.dataset.book;
                    cart = cart.filter(el => el.title !== book)
                    updateTable()
                })
            });
        }

        const logout = document.querySelector('.btn-info');
        logout.addEventListener("click", () => {
            cart = []
            window.location.href = "http://localhost:3000/";
        })


        const viewCartLink = document.getElementById('my-books');
        viewCartLink.addEventListener('click', () => {
            window.location.href = "borrowedBooks";
        });

        const checkoutModal = document.getElementById('checkout-modal');
        const checkoutModal2 = document.getElementById("checkoutModal");
        const modalBackdrop = document.createElement('div');
        const confirmCheckoutButton = document.getElementById('confirmCheckoutButton');

        confirmCheckoutButton.addEventListener('click', async function () {

            if (cart.length === 0) {
                alert("cart is empty...")
                return
            }

            //hides checkout modal
            checkoutModal2.style.display = "none";


            document.getElementsByClassName('my-5')[0].style.display = 'none';
            document.getElementsByClassName('my-3')[0].style.display = 'none';
            document.getElementsByClassName('center')[0].style.display = 'none';

            // Show the success modal
            checkoutModal.classList.add('show');
            checkoutModal.style.display = 'block';

            // Add the modal backdrop to the body
            document.body.appendChild(modalBackdrop);

            // Add the "blur" effect to the body
            document.body.style.backdropFilter = 'blur(5px)';

            await fetch('http://localhost:3000/addBooks', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cart)
            })

            setTimeout(() => {
                window.location.href = "borrowedBooks";
                //send post request 

            }, 2500);
        });
