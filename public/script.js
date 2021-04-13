window.addEventListener("load", main);

async function main() {
  console.log("start");
  addEventListeners();
}

function addEventListeners() {
  // Get all books button
  const allBooksBtn = document.getElementById("allBooks");
  allBooksBtn.addEventListener("click", getAllBooks);
  // Get specific book button
  const specificBookBtn = document.getElementById("specificBook");
  specificBookBtn.addEventListener("click", getSpecificBook);
  // Add new book
  const addNewBookBtn = document.getElementById("addBook");
  addNewBookBtn.addEventListener("click", addNewBook);
  // Update Book
  const updateBookBtn = document.getElementById("updateBook");
  updateBookBtn.addEventListener("click", updateBook);
  // Delete book
  const deleteBookBtn = document.getElementById("deleteBook");
  deleteBookBtn.addEventListener("click", deleteBook);
}

function clearParagraph() {
  const p = document.getElementById("para");
  p.innerHTML = "";
}
function clearUl() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
}

async function addNewBook(title, author, genre) {
  const form = document.getElementById("form");
  console.log(form);
  console.log("New book added");
  const body = { title: title, author: author, genre: genre };
  const newBook = {
    title: title,
    author: author,
    genre: genre,
  };
  const status = await requestResource("/api/books", "POST", body);
  const ul = document.getElementById("list");
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(JSON.stringify(newBook)));
  ul.appendChild(li);
  return status;
}

async function getAllBooks() {
  const books = await requestResource("/api/books", "GET");
  clearParagraph();
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(book.title + " - "));
    li.appendChild(document.createTextNode(book.author + " - "));
    li.appendChild(document.createTextNode(book.genre));
    ul.appendChild(li);
  });
  return books;
}

async function getSpecificBook(id) {
  const book = await requestResource("/api/books/" + "5", "GET");
  clearParagraph();
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(book.title + " - "));
  li.appendChild(document.createTextNode(book.author + " - "));
  li.appendChild(document.createTextNode(book.genre));
  ul.appendChild(li);
  return book;
}

async function updateBook(id) {
  const book = await requestResource("/api/books/" + "2", "PUT");
  const p = document.getElementById("para");
  p.innerHTML = "Book updated";
  clearUl();
  return book;
}

async function deleteBook(id) {
  const book = await requestResource("/api/books/" + "1", "DELETE");
  const p = document.getElementById("para");
  clearUl();
  p.innerHTML = "Book deleted";
  return book;
}

async function requestResource(url, method, body) {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
}
