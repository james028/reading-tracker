SELECT COALESCE(SUM(b.total_pages), 0)                    AS total_pages,
       COALESCE(SUM(COALESCE(progress.pages_read, 0)), 0) AS pages_read
FROM books b
         LEFT JOIN (SELECT book_id,
                           SUM(pages_read) AS pages_read
                    FROM reading_sessions
                    GROUP BY book_id) progress
                   ON progress.book_id = b.id;