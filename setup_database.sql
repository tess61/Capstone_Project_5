-- Create the database
CREATE DATABASE Books;

-- Connect to the database

-- Create the "books" table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    finished_date DATE,
    rating DECIMAL(3, 1),
    notes TEXT,
    summary TEXT
);

-- Sample data insertion (optional, for testing)
INSERT INTO books (title, finished_date, rating, notes, summary) VALUES
('Mastery', '2012-12-06', 7, 'Thinking can be slow, and in its slowness can help mastery', 'Mostly detailed historical biographical tales of success'),
('12 Rules for Life', '2018-04-10', 8, 'Without rules we quickly become slaves to our passions', 'A unique thinker with strong opinions presented'),
('Sapiens', '2017-08-15', 7.8, 'Animals are said to belong to the same species...', 'This book is at its best when the author is scientific'),
('The Subtle Art of Not Giving a Fuck', '2016-09-26', 7.9, 'The key to a good life is giving a fuck about less', 'The opposite of every other book. Don’t try. Give up'),
('test', '2024-11-13', 3, 'test', 'test');
