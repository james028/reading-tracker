CREATE TABLE books
(
    id          UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    author      VARCHAR(255),
    total_pages INTEGER      NOT NULL CHECK (total_pages > 0),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_books_title ON books (title);