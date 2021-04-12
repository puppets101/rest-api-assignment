const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.static("./public"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("REST API - BOOKS");
});

// Get books
app.get("/api/books", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data);
    if (err) {
      return res.status(404).json({ msg: "Error" });
    }
    if (books < 1) {
      res.status(404).json({ msg: `There are no books to see.` });
      return;
    }
    res.json(books);
  });
});

// Get single book
app.get("/api/books/:id", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data);
    if (err) {
      return res.status(404).json({ msg: "Error" });
    }
    const book = books.find((book) => book.id === parseInt(req.params.id));
    if (!book) {
      res.status(404).json({
        msg: `There is no book with the provided id of ${req.params.id}`,
      });
      return;
    }
    res.json(book);
  });
});

// Create book
app.post("/api/books", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data);
    if (err) {
      return res.status(404).json({ msg: "Error" });
    }

    const book = req.body;
    let idToSave = 0;
    books.forEach((book) => {
      if (book.id > idToSave) {
        idToSave = book.id;
      }
    });

    idToSave++;
    const newBook = {
      id: idToSave,
      title: book.title,
      author: book.author,
      genre: book.genre,
    };
    if (!book.title)
      return res.json({ msg: "Please provide a title to add the book." });
    if (!book.author)
      return res.json({ msg: "Please provide a author to add the book." });
    if (!book.genre)
      return res.json({ msg: "Please provide a genre to add the book." });
    books.push(newBook);
    fs.writeFile("./bookList.json", JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.json({ msg: "Error" });
      }
      res.json({ msg: `${book.title} has been added` });
    });
  });
});

// Update book
app.put("/api/books/:id", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data);
    if (err) {
      return res.status(404).json({ msg: "Error" });
    }
    const book = books.find((book) => book.id === parseInt(req.params.id));
    if (!book) {
      return res.json({ msg: "The book with the provided ID does not exist." });
    }
    fs.writeFile("./bookList.json", JSON.stringify(book, null, 2), (err) => {
      const { title, author, genre } = req.body;
      if (title) book.title = title;
      if (author) book.author = author;
      if (genre) book.genre = genre;

      res.json({ msg: `Book with the ID of ${book.id} has been updated.` });
    });
  });
});

// Delete book
app.delete("/api/books/:id", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data);
    const book = books.find((book) => book.id === parseInt(req.params.id));
    if (!book) {
      return res.json({ msg: "The book with the provided ID does not exist." });
    }
    fs.writeFile("./bookList.json", JSON.stringify(book, null, 2), (err) => {
      const index = books.indexOf(book);
      books.splice(index, 1);
      res.json({ msg: `Book with the ID of ${book.id} has been deleted.` });
    });
  });
});

app.listen(port, () => console.log(`Running on port http://localhost:${port}`));
