import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookCard from "../components/BookCard.svelte";
import { createReadingSessions } from "../lib/api/reading-sessions.api.js";
import { renderWithQueryClient } from "./test-utils";

vi.mock("../lib/api/reading-sessions.api.js", () => ({
  createReadingSessions: vi.fn()
}));

const baseBook = {
  id: "1",
  title: "Wiedźmin",
  author: "Andrzej Sapkowski",
  totalPages: 100,
  pagesRead: 50,
  pagesLeft: 50,
  progressPercent: 50
};

describe("BookCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders book info and disables button initially", () => {
    renderWithQueryClient(BookCard, { book: baseBook, index: 0 });

    expect(screen.getByText("1. Wiedźmin")).toBeInTheDocument();
    expect(screen.getByText("Andrzej Sapkowski")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /add page/i });
    expect(button).toBeDisabled();
  });

  it("enables button after typing pages", async () => {
    renderWithQueryClient(BookCard, { book: baseBook, index: 0 });

    const input = screen.getByPlaceholderText("Pages read");
    await fireEvent.input(input, { target: { value: "10" } });

    const button = screen.getByRole("button", { name: /add page/i });
    expect(button).toBeEnabled();
  });

  it("calls mutation and shows success message on submit", async () => {
    vi.mocked(createReadingSessions).mockResolvedValue({});

    renderWithQueryClient(BookCard, { book: baseBook, index: 0 });

    const input = screen.getByPlaceholderText("Pages read");
    await fireEvent.input(input, { target: { value: "10" } });

    const button = screen.getByRole("button", { name: /add page/i });
    await fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Reading session added.");
    });

    expect(createReadingSessions).toHaveBeenCalledWith({
      bookId: "1", pagesRead: 10, readingDate: expect.any(String)
    }, expect.anything());
  });

  it("shows error message when mutation fails", async () => {
    vi.mocked(createReadingSessions).mockRejectedValue(new Error("boom"));

    renderWithQueryClient(BookCard, { book: baseBook, index: 0 });

    const input = screen.getByPlaceholderText("Pages read");
    await fireEvent.input(input, { target: { value: "10" } });

    const button = screen.getByRole("button", { name: /add page/i });
    await fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Nie udało się połączyć z serwerem. Spróbuj ponownie.");
    });
  });
});