let state = []
        const loadBooks = async () => {
            try {
                const response = await fetch("http://localhost:3000/getBorrowedBooks");
                const data = await response.json();
                state = data
                updateTable()
            } catch (error) {
                console.log(error);
            }
        }

        function updateTable() {
            // Get a reference to the table body and clear its contents
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = '';

            // Loop through each search result and add it to the cart array
            state.forEach((book) => {
                // Create a new table row for the search result
                const row = document.createElement('tr');

                // Populate the table row with data from the search result
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.published}</td>
                    <td>${book.isbn}</td>
                    <td><img src="${book.img}"></td>
                    <td><button id="book-button" class="btn btn-success" data-book="${book.title}">Return Book</button></td>
                `;
                // set the inner HTML of the new row with data from the book object
                tableBody.appendChild(row);

            });
            buttonEventListener()
        }

        // This function adds an event listener to all buttons with the class "btn-primary"
        const buttonEventListener = () => {
            const btnPrimary = document.querySelectorAll('button.btn-success');

            // Iterate over each button and add a click event listener
            btnPrimary.forEach((button) => {

                // If the user is not logged in, show an alert message
                button.addEventListener('click', async (event) => {
                    const book = event.target.dataset.book;
                    const data = {
                        title: book
                    }

                    await fetch('http://localhost:3000/returnBook', {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    })


                    state = state.filter(el => el.title !== book)
                    updateTable()

                })
            });
        }

        const logout = document.querySelector('.btn-info');
        logout.addEventListener("click", () => {
            state = []
            window.location.href = "http://localhost:3000/";
        })
