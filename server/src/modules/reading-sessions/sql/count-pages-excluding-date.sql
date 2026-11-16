SELECT COALESCE(SUM(pages_read), 0) AS pages_read
FROM reading_sessions
WHERE book_id = $1;