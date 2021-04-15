window.addEventListener("load", main);

async function main() {
  console.log("start");
  addEventListeners();
}

async function addEventListeners() {
  // Handle add book form submits
  const addBookForm = document.getElementById("addBookForm");
  addBookForm.addEventListener("submit", handleAddBookFormSubmit);

  const handleSpecificIdInput = document.getElementById("getSpecificBook");
  handleSpecificIdInput.addEventListener("submit", handleGetSpecificBookSubmit);

  // Get all books
  const allBooksBtn = document.getElementById("allBooks");
  allBooksBtn.addEventListener("click", getAllBooks);
}

// Helper functions
function clearUl() {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
}
function clearInputFields() {
  const addBookForm = document.getElementById("addBookForm");
  addBookForm.reset();
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
  clearInputFields();
}

function handleGetSpecificBookSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById("idInput");
  const idValue = idInput.value;
  idValue.toString();
  getSpecificBook(idValue);
}

function handleUpdateBook() {
  const updateBookForm = document.getElementById("updateBookForm");
  updateBookForm.classList.add("showForm");
  const book = this;
  console.log(book);

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
  console.log(
    Number(updateIdInput),
    updateTitleInput,
    updateAuthorInput,
    updateGenreInput
  );
  updateBook(
    Number(updateIdInput),
    updateTitleInput,
    updateAuthorInput,
    updateGenreInput
  );
  updateBookForm.classList.remove("showForm");
  updateBookForm.classList.add("hideForm");
}

async function addBook(title, author, genre) {
  const body = { title: title, author: author, genre: genre };
  const book = await requestResource("/api/books", "POST", body);
  getAllBooks();
  return book;
}

async function getAllBooks() {
  const books = await requestResource("/api/books", "GET");
  const ul = document.getElementById("list");
  ul.innerHTML = "";
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

async function getSpecificBook(id) {
  const book = await requestResource("/api/books/" + id, "GET");
  const ul = document.getElementById("specificBook");
  ul.innerHTML = "";
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(book.title + " - "));
  li.appendChild(document.createTextNode(book.author + " - "));
  li.appendChild(document.createTextNode(book.genre));
  ul.appendChild(li);
  return book;
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
  console.log(body);
  const books = await requestResource(
    `/api/books/${updateIdInput}`,
    "PUT",
    body
  );
  return books;
}

async function deleteBook() {
  console.log("deleted " + this);
  const id = this;
  await requestResource("/api/books/" + id, "DELETE");
  getAllBooks();
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
