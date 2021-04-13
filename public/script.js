window.addEventListener("load", main);

async function main() {
  console.log("start");
  addEventListeners();
}

function addEventListeners() {
  // Hanlde form submit
  // const form = document.getElementById("form");
  // form.addEventListener("submit", handleFormSubmit);
  // Get all books
  const allBooksBtn = document.getElementById("allBooks");
  allBooksBtn.addEventListener("click", getAllBooks);
  // Get specific book
  const specificBookBtn = document.getElementById("specificBook");
  specificBookBtn.addEventListener("click", getSpecificBook);
  // Add book
  const addNewBookBtn = document.getElementById("addBook");
  addNewBookBtn.addEventListener("click", addBook);
  // Update book
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

// function handleFormSubmit(e) {
//   e.preventDefault();

//   const data = new FormData(e.target);
//   const formJSON = Object.fromEntries(data.entries());

//   const newBook = JSON.stringify(formJSON, null, 2);
//   addBookFromForm(newBook);
// }

// async function addBookFromForm(newBook) {
//   console.log(newBook);
// }

async function addBook(title, author, genre) {
  let body = { title: title, author: author, genre: genre };
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
  const book = await requestResource("/api/books/" + "1", "GET");
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
  clearUl();
  p.innerHTML = "Book updated";
  return book;
}

async function deleteBook(id) {
  const book = await requestResource("/api/books/" + "2", "DELETE");
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
