SELECT COUNT(*) AS total
FROM books
WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%');