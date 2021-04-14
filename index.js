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
      return res.status(404).res.json(books);
    }
    res.json(books);
  });
});

// Get specific book
app.get("/api/books/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./bookList.json", (err, data) => {
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data.toString());
    if (err) {
      return res.status(404).json(books);
    }
    const book = books.find((book) => book.id === parseInt(id));
    if (!book) {
      return res
        .status(404)
        .json(`There is no book with the provided id of ${id}`);
    }
    res.json(book);
  });
});

// Create book
app.post("/api/books", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data.toString());
    if (err) {
      return res.status(404).json(books);
    }

    let idToSave = 0;
    books.forEach((book) => {
      if (book.id > idToSave) {
        idToSave = book.id;
      }
    });
    idToSave++;
    const book = req.body;
    const newBook = {
      id: idToSave,
      title: book.title,
      author: book.author,
      genre: book.genre,
    };
    if (!book.title)
      return res.status(400).json("Please provide a title to add the book.");
    if (!book.author)
      return res.status(400).json("Please provide a author to add the book.");
    if (!book.genre)
      return res.status(400).json("Please provide a genre to add the book.");
    books.push(newBook);
    fs.writeFile("./bookList.json", JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.status(400).json(books);
      }
      res.status(201).json(`${book.title} has been added`);
    });
  });
});

// Update book
app.put("/api/books/:id", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    const { id } = req.params;
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data.toString());
    if (err) {
      return res.status(404).json(books);
    }
    const book = books.find((book) => book.id === parseInt(id));
    if (!book) {
      return res.json("The book with the provided ID does not exist.");
    }
    // const index = books.findIndex((book) => book.id === parseInt(id));
    const updatedBook = {
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
    };
    books.splice(book, 1, updatedBook);

    fs.writeFile("./bookList.json", JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.status(404);
      }
      res.status(200).json(`Book with the ID of ${book.id} has been updated.`);
    });
  });
});

// Delete book
app.delete("/api/books/:id", (req, res) => {
  fs.readFile("./bookList.json", (err, data) => {
    const { id } = req.params;
    data = fs.readFileSync("./bookList.json");
    const books = JSON.parse(data.toString());
    if (err) {
      return res.status(400).json(books);
    }
    const book = books.find((book) => book.id === parseInt(id));
    if (!book) {
      return res.json("The book with the provided ID does not exist.");
    }
    const index = books.findIndex((book) => book.id === parseInt(id));
    books.splice(index, 1);
    fs.writeFile("./bookList.json", JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.status(404);
      }
      res.status(202).json(`Book with the ID of ${id} has been deleted.`);
    });
  });
});

app.listen(port, () => console.log(`Running on port http://localhost:${port}`));
