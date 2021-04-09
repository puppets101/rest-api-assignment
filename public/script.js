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
}

async function getAllBooks() {
  const books = await requestResource("/api/books", "GET");
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(JSON.stringify(book)));
    ul.appendChild(li);
  });
  return books;
}

async function getSpecificBook(id) {
  //   const book = await requestResource("/api/books/" + id, "GET");
  const book = await requestResource("/api/books/" + "2", "GET");
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  console.log(book);
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(JSON.stringify(book)));
  ul.appendChild(li);
  return book;
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
  console.log(status);
  return status;
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
