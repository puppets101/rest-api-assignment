const express = require("express");
const books = require("./Books");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("REST API - BOOKS");
});

// Get books
app.get("/api/books", (req, res) => {
  res.send(books);
});

// Get single book
app.get("/api/books/:id", (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));
  if (!book) {
    res
      .status(404)
      .send({ msg: `There's no book with the id of ${req.params.id}` });
    return;
  }
  res.send(book);
});

app.post("/api/books", (req, res) => {
  const newBook = {
    id: books.length + 1,
    name: "Superintelligence",
    author: "Nick Boström",
    genre: "Science",
  };
  books.push(newBook);
  res.send(books);
});

app.listen(port, () => console.log(`Running on port http://localhost:${port}`));
