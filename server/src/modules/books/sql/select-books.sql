SELECT b.id,
       b.title,
       b.author,
       b.total_pages,
       b.created_at,
       b.updated_at,
       COALESCE(SUM(rs.pages_read), 0) AS pages_read
FROM books b
         LEFT JOIN reading_sessions rs
                   ON rs.book_id = b.id
WHERE ($1::text IS NULL OR b.title ILIKE '%' || $1 || '%')
GROUP BY b.id,
         b.title,
         b.author,
         b.total_pages,
         b.created_at,
         b.updated_at
ORDER BY b.created_at DESC
LIMIT $2 OFFSET $3;