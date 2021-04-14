window.addEventListener("load", main);

async function main() {
  console.log("start");
  addEventListeners();
}

function addEventListeners() {
  // Handle add book form submit
  const form = document.getElementById("addBookForm");
  form.addEventListener("submit", handleAddBookFormSubmit);
  // Get all books
  const allBooksBtn = document.getElementById("allBooks");
  allBooksBtn.addEventListener("click", getAllBooks);
  // Get specific book
  const specificBookBtn = document.getElementById("specificBook");
  specificBookBtn.addEventListener("click", getSpecificBook);
  // Update book
  const updateBookBtn = document.getElementById("updateBook");
  updateBookBtn.addEventListener("click", updateBook);
  // Delete book
  const deleteBookBtn = document.getElementById("deleteBook");
  deleteBookBtn.addEventListener("click", deleteBook);
}

function handleAddBookFormSubmit() {
  console.log("Book Added");

  const titleInput = document.getElementById("titleInput");
  const titleValue = titleInput.value;
  const authorInput = document.getElementById("authorInput");
  const authorValue = authorInput.value;
  const genreInput = document.getElementById("genreInput");
  const genreValue = genreInput.value;

  const newBook = {
    title: titleValue,
    author: authorValue,
    genre: genreValue,
  };
  const { title, author, genre } = newBook;
  addBook(title, author, genre);
}

function clearParagraph() {
  const p = document.getElementById("para");
  p.innerHTML = "";
}
function clearUl() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
}

async function addBook(title, author, genre) {
  const body = { title: title, author: author, genre: genre };
  const book = await requestResource("/api/books", "POST", body);
  clearUl();
  const p = document.getElementById("para");
  p.innerHTML = "Book added";
  return book;
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
  const book = await requestResource("/api/books/" + "3", "GET");
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

async function updateBook(id, title, author, genre) {
  const body = { title: "title", author: "author", genre: "genre" };
  const book = await requestResource("/api/books/" + "2", "PUT", body);
  const p = document.getElementById("para");
  clearUl();
  p.innerHTML = "Book updated";
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return result;
}
