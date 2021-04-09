const express = require("express");
const json = require("./bookList.json");
const books = json.BookList;
const app = express();
const port = 3000;

app.use(express.static("./public"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("REST API - BOOKS");
});

// Get books
app.get("/api/books", (req, res) => {
  if (books < 1) {
    res.status(404).json({ msg: `There are no books to see.` });
    return;
  }
  res.json(books);
});

// Get single book
app.get("/api/books/:id", (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));
  if (!book) {
    res.status(404).json({
      msg: `There is no book with the provided id of ${req.params.id}`,
    });
    return;
  }
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const book = req.body;

  const titleToSave = book.title;
  const authorToSave = book.author;
  const genreToSave = book.genre;

  let idToSave = 0;
  books.forEach((book) => {
    if (book.id > idToSave) {
      idToSave = book.id;
    }
  });
  if (!book.title)
    return res.json({ msg: "Please provide a title to add the book." });
  if (!book.author)
    return res.json({ msg: "Please provide a author to add the book." });
  if (!book.genre)
    return res.json({ msg: "Please provide a genre to add the book." });

  idToSave++;
  books.push({
    id: idToSave,
    title: titleToSave,
    author: authorToSave,
    genre: genreToSave,
  });
  res.json({ msg: `${book.title} has been added` });
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res.json({ msg: "The book with the provided ID does not exist." });
    return;
  }

  const { title, author, genre } = req.body;

  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;

  res.json({ msg: `Book with the ID of ${book.id} has been updated.` });
});

app.delete("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res.json({ msg: "The book with the provided ID does not exist." });
    return;
  }
  const index = books.indexOf(book);
  books.splice(index, 1);

  res.json(books);
});

app.listen(port, () => console.log(`Running on port http://localhost:${port}`));
