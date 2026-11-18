ALTER TABLE books
    ADD CONSTRAINT books_title_unique
        UNIQUE (title);