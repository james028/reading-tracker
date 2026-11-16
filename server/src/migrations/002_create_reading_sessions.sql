CREATE TABLE reading_sessions
(
    id           UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    book_id      UUID        NOT NULL REFERENCES books (id) ON DELETE CASCADE,
    reading_date DATE        NOT NULL,
    pages_read   INTEGER     NOT NULL CHECK (pages_read > 0),
    note         TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (book_id, reading_date)
);

CREATE INDEX idx_reading_sessions_book_id
    ON reading_sessions (book_id);

CREATE INDEX idx_reading_sessions_reading_date
    ON reading_sessions (reading_date);