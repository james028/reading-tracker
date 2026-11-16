INSERT INTO reading_sessions (book_id,
                              reading_date,
                              pages_read,
                              note)
VALUES ($1,
        $2,
        $3,
        $4)
RETURNING
    id,
    book_id,
    reading_date,
    pages_read,
    note,
    created_at,
    updated_at;