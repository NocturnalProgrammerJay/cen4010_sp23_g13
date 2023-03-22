const search = async () => {
    console.log(HOST);
    try {
        const query = document.getElementById('search').value;
        const key = "AIzaSyAj2K6rhZ7wT_dlp65rCuua2zQr8HYG-Io"
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&${key}&maxResults=3`
        const response = await fetch(url)

        const { items: searchResults } = await response.json()
        console.log(searchResults);

        updateTable(searchResults)
    } catch (error) {
        console.error(error);
    }
}

function updateTable(searchResults) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    searchResults.forEach((book) => {
        const row = document.createElement('tr');
        const title = document.createElement('td');
        const author = document.createElement('td');
        const year = document.createElement('td');
        const ISBN = document.createElement('td');
        const image = document.createElement('td');
        const button = document.createElement('td');
        const addToCartButton = document.createElement('button');
        const bookCover = document.createElement('img'); // create image element
      
        title.innerText = book.volumeInfo.title;
        author.innerText = book.volumeInfo.authors[0];
        year.innerText = book.volumeInfo.publishedDate.slice(0, 4);
        ISBN.innerText = book.volumeInfo.industryIdentifiers[0].identifier;
        bookCover.src = book.volumeInfo.imageLinks.smallThumbnail; // set image source
        addToCartButton.innerText = 'Add to Cart';
        addToCartButton.classList.add('btn', 'btn-primary');
      
        image.appendChild(bookCover); // add image element to table data element
        button.appendChild(addToCartButton);
        row.appendChild(title);
        row.appendChild(author);
        row.appendChild(year);
        row.appendChild(ISBN);
        row.appendChild(image);
        row.appendChild(button);
      
        tableBody.appendChild(row);
      });
}