INSERT INTO books (title,
                   author,
                   total_pages)
VALUES ($1,
        $2,
        $3)
RETURNING
    id,
    title,
    author,
    total_pages,
    created_at,
    updated_at;