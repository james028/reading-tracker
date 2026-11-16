INSERT INTO reading_sessions (book_id,
                              reading_date,
                              pages_read,
                              note)
VALUES ($1,
        $2,
        $3,
        $4)
ON CONFLICT (book_id, reading_date)
    DO UPDATE SET pages_read = EXCLUDED.pages_read,
                  note       = EXCLUDED.note,
                  updated_at = now()
RETURNING
    id,
    book_id,
    reading_date,
    pages_read,
    note,
    created_at,
    updated_at;