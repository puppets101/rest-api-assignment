window.addEventListener("load", main);

async function main() {
  console.log("start");
  addEventListeners();
}

async function addEventListeners() {
  // Handle form submits
  const form = document.getElementById("form");
  form.addEventListener("submit", handleAddBookFormSubmit);

  const handleSpecificIdInput = document.getElementById("getSpecificBook");
  handleSpecificIdInput.addEventListener("submit", handleGetSpecificBookSubmit);

  // TODO - UPDATE AND DELETE

  // Get all books
  const allBooksBtn = document.getElementById("allBooks");
  allBooksBtn.addEventListener("click", getAllBooks);
}

function handleAddBookFormSubmit(e) {
  e.preventDefault();
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

function handleGetSpecificBookSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById("idInput");
  const idValue = idInput.value;
  idValue.toString();
  getSpecificBook(idValue);
}

function handleUpdateBookFormSubmit() {
  console.log("Book Updated");

  const idInput = document.getElementById("idInput");
  const idValue = idInput.value;
  const titleInput = document.getElementById("titleInput");
  const titleValue = titleInput.value;
  const authorInput = document.getElementById("authorInput");
  const authorValue = authorInput.value;
  const genreInput = document.getElementById("genreInput");
  const genreValue = genreInput.value;

  const updatedBook = {
    id: idValue,
    title: titleValue,
    author: authorValue,
    genre: genreValue,
  };
  const { id, title, author, genre } = updatedBook;
  updateBook(id, title, author, genre);
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
  return book;
}

async function getAllBooks() {
  const books = await requestResource("/api/books", "GET");
  clearParagraph();
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", deleteBook);
    const updateBtn = document.createElement("button");
    updateBtn.classList.add("btn");
    updateBtn.innerHTML = "Edit";
    updateBtn.addEventListener("click", updateBook);
    li.appendChild(document.createTextNode(book.title + " - "));
    li.appendChild(document.createTextNode(book.author + " - "));
    li.appendChild(document.createTextNode(book.genre));
    ul.appendChild(li).appendChild(deleteBtn).appendChild(updateBtn);
  });
  return books;
}

async function getSpecificBook(id) {
  const book = await requestResource("/api/books/" + id, "GET");
  clearParagraph();
  const ul = document.getElementById("specificBook");
  ul.innerHTML = "";
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(book.title + " - "));
  li.appendChild(document.createTextNode(book.author + " - "));
  li.appendChild(document.createTextNode(book.genre));
  ul.appendChild(li);
  return book;
}

async function updateBook(id, title, author, genre) {
  const body = { id: id, title: title, author: author, genre: genre };
  const book = await requestResource("/api/books/" + id, "PUT", body);
  const p = document.getElementById("para");
  clearUl();
  p.innerHTML = "Book updated";
  return book;
}

async function deleteBook(id) {
  console.log("deleted" + id);
  const book = await requestResource("/api/books/" + id, "DELETE");
  // const p = document.getElementById("para");
  // clearUl();
  // p.innerHTML = "Book deleted";
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
