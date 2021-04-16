window.addEventListener("load", main);

async function main() {
  addEventListeners();
}

// EVENT LISTENERS
async function addEventListeners() {
  const addBookFormSubmit = document.getElementById("addBookForm");
  addBookFormSubmit.addEventListener("submit", handleAddBookFormSubmit);

  const specificIdInput = document.getElementById("getSpecificBook");
  specificIdInput.addEventListener("submit", handleGetSpecificBookSubmit);

  const getAllBooksBtn = document.getElementById("allBooks");
  getAllBooksBtn.addEventListener("click", getAllBooks);
}

// HELPER FUNCTIONS
function clearUl() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
}
function clearInputFields() {
  const addBookForm = document.getElementById("addBookForm");
  addBookForm.reset();
}
function clearSpecificBook() {
  const ul = document.getElementById("specificBook");
  ul.innerHTML = "";
}

// GET BOOK LIST
async function getAllBooks() {
  const books = await requestResource("/api/books", "GET");
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  clearSpecificBook();
  books.forEach((book) => {
    const li = document.createElement("li");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn");
    deleteBtn.innerHTML = '<i class="fa fa-remove"></i>';
    deleteBtn.addEventListener("click", deleteBook.bind(book.id));
    const updateBtn = document.createElement("button");
    updateBtn.classList.add("btn", "p-0", "mx-2");
    updateBtn.innerHTML = '<i class="fa fa-edit"></i>';
    updateBtn.addEventListener("click", handleUpdateBook.bind(book));

    li.appendChild(document.createTextNode(book.title + " - "));
    li.appendChild(document.createTextNode(book.author + " - "));
    li.appendChild(document.createTextNode(book.genre));
    li.appendChild(updateBtn);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
  });
  return books;
}

// CREATE BOOK
function handleAddBookFormSubmit(e) {
  e.preventDefault();

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
  if (!title) return alert("Please provide title to add the book");
  if (!author) return alert("Please provide author to add the book");
  if (!genre) return alert("Please provide genre to add the book");
  addBook(title, author, genre);
  clearInputFields();
}

async function addBook(title, author, genre) {
  const body = { title: title, author: author, genre: genre };
  const book = await requestResource("/api/books", "POST", body);
  getAllBooks();
  return book;
}

// GET SPECIFIC BOOK
async function handleGetSpecificBookSubmit(e) {
  e.preventDefault();

  const idInput = document.getElementById("idInput");
  const idValue = idInput.value;
  if (idValue) idValue.toString();
  if (!idValue) return alert("Please provide id to find specific book");

  const books = await requestResource("/api/books", "GET");
  const book = books.find((book) => book.id === parseInt(idValue));
  if (!book) return alert("There is no book with the provided id");

  getSpecificBook(idValue);
}

async function getSpecificBook(id) {
  const book = await requestResource("/api/books/" + id, "GET");
  const ul = document.getElementById("specificBook");
  clearSpecificBook();
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(book.title + " - "));
  li.appendChild(document.createTextNode(book.author + " - "));
  li.appendChild(document.createTextNode(book.genre));
  ul.appendChild(li);
  return book;
}

// UPDATE BOOK
function handleUpdateBook() {
  const updateBookForm = document.getElementById("updateBookForm");
  updateBookForm.classList.add("showForm");
  const book = this;

  const updateIdInput = document.getElementById("updateIdInput");
  updateIdInput.value = book.id;
  updatedIdValue = updateIdInput.value;
  const updateTitleInput = document.getElementById("updateTitleInput");
  updateTitleInput.value = book.title;
  updatedTitleValue = updateTitleInput.value;
  const updateAuthorInput = document.getElementById("updateAuthorInput");
  updateAuthorInput.value = book.author;
  updatedAuthorValue = updateAuthorInput.value;
  const updateGenreInput = document.getElementById("updateGenreInput");
  updateGenreInput.value = book.genre;
  updatedGenreValue = updateGenreInput.value;

  const updateBookFormSubmit = document.getElementById("updateBookForm");
  updateBookFormSubmit.addEventListener("submit", handleUpdateBookEvent);
}

function handleUpdateBookEvent(e) {
  e.preventDefault();
  const updateIdInput = document.getElementById("updateIdInput").value;
  const updateTitleInput = document.getElementById("updateTitleInput").value;
  const updateAuthorInput = document.getElementById("updateAuthorInput").value;
  const updateGenreInput = document.getElementById("updateGenreInput").value;

  if (!updateTitleInput) return alert("Please provide title to update book");
  if (!updateAuthorInput) return alert("Please provide author to update book");
  if (!updateGenreInput) return alert("Please provide genre to update book");

  updateBook(
    Number(updateIdInput),
    updateTitleInput,
    updateAuthorInput,
    updateGenreInput
  );

  updateBookForm.classList.remove("showForm");
  updateBookForm.classList.add("hideForm");
}

async function updateBook(
  updateIdInput,
  updateTitleInput,
  updateAuthorInput,
  updateGenreInput
) {
  const body = {
    id: updateIdInput,
    title: updateTitleInput,
    author: updateAuthorInput,
    genre: updateGenreInput,
  };

  const books = await requestResource(
    `/api/books/${updateIdInput}`,
    "PUT",
    body
  );
  getAllBooks();
  return books;
}

// DELETE BOOK
async function deleteBook() {
  const id = this;
  await requestResource("/api/books/" + id, "DELETE");
  getAllBooks();
}

// REQUEST RECOURSE
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
