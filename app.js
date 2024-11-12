import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import axios from "axios";
import pg from "pg";
import { Console } from "console";


const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Books",
    password: "postgres123",
    port: 5433,
  });
  db.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
  
app.get('/', async (req, res) => {
    try {

        const sort = req.query.sort;

        // Define base SQL query
        let sortQuery = "";

        // Adjust the query based on the sorting parameter
        if (sort === 'title') {
            sortQuery = " ORDER BY title ASC";
        } else if (sort === 'best') {
            sortQuery = " ORDER BY rating DESC";
        } else if (sort === 'newest') {
            sortQuery = " ORDER BY finished_date DESC";
        }



        // Fetch all titles, descriptions, ratings, and dates from the database
        const ans = await db.query(`SELECT title, summary, rating, finished_date FROM mybooks ${sortQuery}`);
        const booksFromDB = ans.rows;  // Array of books with fields from 'mybooks'

        // Use Promise.all to fetch data for each title asynchronously
        const bookData = await Promise.all(
            booksFromDB.map(async dbBook => {
                // Fetch data from the Open Library API for each title
                const response = await axios.get(`https://openlibrary.org/search.json?q=${dbBook.title}`);
                const book = response.data.docs[0];  // Get the first result for each title

                // Combine API data with database fields
                return {
                    cover_id: book?.cover_i || null,
                    title: dbBook.title,
                    authors_name: book?.author_name?.[0] || "Unknown Author",
                    pages: book?.number_of_pages_median || "N/A",
                    summary: dbBook.summary || "No description available.",
                    rating: dbBook.rating || "N/A",
                    finished_date: dbBook.finished_date || "N/A"
                };
            })
        );

        // Render the 'index.ejs' template with the combined data
        res.render("index.ejs", { searchedBooks: bookData });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("An error occurred while fetching data.");
    }
});

app.get("/details/:title",  async (req, res)=> {
    try {
        // Fetch all titles, descriptions, ratings, and dates from the database
        const title = decodeURIComponent(req.params.title);
        console.log(title);
        const ans = await db.query("SELECT title, summary, notes, rating, finished_date FROM mybooks where title = $1", [title]);
        const booksFromDB = ans.rows[0];  // Array of books with fields from 'mybooks'
        console.log(booksFromDB);
        const response = await axios.get(`https://openlibrary.org/search.json?q=${title}`);
        const book = response.data.docs[0];
        const bookData = {
                    cover_id: book?.cover_i || null,
                    title: title,
                    authors_name: book?.author_name?.[0] || "Unknown Author",
                    pages: book?.number_of_pages_median || "N/A",
                    summary: booksFromDB.summary || "No description available.",
                    notes: booksFromDB.notes.replace(/\n/g, '<br>') || "No Note Has Been Submited",
                    rating: booksFromDB.rating || "N/A",
                    finished_date: booksFromDB.finished_date || "N/A"
        } 
        res.render("details.ejs", { searchedBooks: bookData });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("An error occurred while fetching data.");
    }
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    console.log("Started");
    const { title, finished_date, rating, notes, summary } = req.body;
    try {
        await db.query(
            "INSERT INTO mybooks (title, finished_date, rating, notes, summary) VALUES ($1, $2, $3, $4, $5)",
            [title, finished_date, rating, notes, summary]
        );
        res.redirect('/');  // Redirect to home page after insertion
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("An error occurred while saving the data.");
    }
});

// Route to render the edit form
app.get('/edit/:title', async (req, res) => {
    const bookId = req.params.title;
    try {
        const bookDetails = await db.query("SELECT * FROM mybooks WHERE title = $1", [bookId]);

        const bookData = {
            title: bookId,
            summary: bookDetails.rows[0].summary || "No description available.",
            notes: bookDetails.rows[0].notes || "No Note Has Been Submited",
            rating: bookDetails.rows[0].rating || "N/A",
            finished_date: bookDetails.rows[0].finished_date || "N/A"
}
        if (!bookDetails) {
            return res.status(404).send("Book not found");
        }
        res.render('edit.ejs', { book: bookData });
    } catch (error) {
        console.error("Error fetching book for edit:", error);
        res.status(500).send("An error occurred while fetching the book details.");
    }
});

// Route to handle the update form submission
app.post('/edit/:title', async (req, res) => {
    const bookId = req.params.title;
    const { title, finished_date, rating, notes, summary } = req.body;
    try {
        await db.query(
            "UPDATE mybooks SET title = $1, finished_date = $2, rating = $3, notes = $4, summary = $5 WHERE title = $6",
            [title, finished_date, rating, notes, summary, bookId]
        );
        res.redirect(`/details/${title}`);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send("An error occurred while updating the book.");
    }
});

// Route to handle the delete request
app.post('/delete/:title', async (req, res) => {
    const bookId = req.params.title;
    try {
        await db.query("DELETE FROM mybooks WHERE title = $1", [bookId]);
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send("An error occurred while deleting the book.");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});