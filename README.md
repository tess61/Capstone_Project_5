# Capstone Project 5: Book Management Application

This project is the fifth in a series of capstone projects for **The Complete 2024 Web Development Bootcamp** by Dr. Angela Yu on Udemy. The application uses **Open Library's public API** and **PostgreSQL** to manage a collection of books, allowing users to perform CRUD (Create, Read, Update, Delete) operations.

## Project Structure

project-root/
│
├── public/
│   └── css/
│       └── style.css               # Main stylesheet
│
├── views/
│   ├── partials/                   # Reusable partial templates
│   │   ├── footer.ejs              # Footer component
│   │   └── header.ejs              # Header component
│   │
│   ├── create.ejs                  # Template for creating new book entries
│   ├── details.ejs                 # Template for viewing book details
│   ├── edit.ejs                    # Template for editing book details
│   └── index.ejs                   # Homepage template listing all books
│
├── app.js                          # Main server file
├── package-lock.json               # Auto-generated dependencies
└── package.json                    # Project metadata and dependencies


## Features

- **Book Search**: Uses Open Library's public API to search and retrieve book data.
- **CRUD Operations**: Allows users to create, view, edit, and delete book entries.
- **Database Integration**: Uses PostgreSQL to persist book data.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Capstone_project_5.git

2. Navigate to the project directory:

```bash
   cd Capstone_project_5
```
3.Install dependencies:

```bash
  npm install
```
4. Set up PostgreSQL:

5. 