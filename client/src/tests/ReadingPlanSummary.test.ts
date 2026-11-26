// import { screen, waitFor } from "@testing-library/svelte";
// import { beforeEach, describe, expect, it, vi } from "vitest";
// import { getReadingPlan } from "#lib/index";
// import { getBooks } from "#lib/api/books.api.ts";
// import { renderWithQueryClient } from "./test-utils";
// import ReadingPlanSummary from "../components/ReadingPlanSummary.svelte";
//
// console.log(typeof getReadingPlan, getReadingPlan);
//
// vi.mock("#lib/api/reading-plan.api.ts", () => ({
//   getReadingPlan: vi.fn(),
// }));
//
// vi.mock("#lib/api/books.api.ts", () => ({
//   getBooks: vi.fn(),
// }));
//
// describe("ReadingPlanSummary", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });
//
//   it("renders reading plan data when API succeeds", async () => {
//     vi.mocked(getReadingPlan).mockResolvedValue({
//       daysLeft: 30,
//       today: "2026-11-26",
//       totalPages: 1000,
//       pagesLeft: 500,
//       pagesRead: 500,
//       pagesReadToday: 10,
//       recommendedPagesPerDay: 20,
//       requiredPagesPerDay: 17,
//       yearEndDate: "2026-12-31",
//       isAchievable: false
//     });
//
//     // vi.mocked(getBooks).mockResolvedValue({
//     //   meta: {
//     //     page: 0,
//     //     limit: 0,
//     //     totalItems: 0,
//     //     totalPages: 0
//     //   }, items: [{
//     //     id: "1",
//     //     title: "Book A",
//     //     pagesLeft: 100,
//     //     author: "",
//     //     totalPages: 0,
//     //     pagesRead: 0,
//     //     progressPercent: 0,
//     //     createdAt: "",
//     //     updatedAt: ""
//     //   }, {
//     //     id: "2",
//     //     title: "Book B",
//     //     pagesLeft: 0,
//     //     author: "",
//     //     totalPages: 0,
//     //     pagesRead: 0,
//     //     progressPercent: 0,
//     //     createdAt: "",
//     //     updatedAt: ""
//     //   }]
//     // });
//
//     renderWithQueryClient(ReadingPlanSummary);
//
//     await waitFor(() => {
//       expect(screen.getByText("30")).toBeInTheDocument(); // daysLeft
//       expect(screen.getByText("1000")).toBeInTheDocument(); // totalPages
//       expect(screen.getByText("500")).toBeInTheDocument(); // pagesLeft
//     });
//
//     // Sprawdzenie countBooks — tylko 1 książka ma pagesLeft !== 0
//     //expect(screen.getByText("in 1 book(s)")).toBeInTheDocument();
//
//     // Sprawdzenie progressPercent — 500/1000 = 50%
//     //expect(screen.getByText("50%")).toBeInTheDocument();
//   });
//
//   // it("renders error message when API fails", async () => {
//   //   vi.mocked(getReadingPlan).mockRejectedValue(new Error("Network error"));
//   //
//   //   renderWithQueryClient(ReadingPlanSummary);
//   //
//   //   await waitFor(() => {
//   //     expect(screen.getByRole("alert")).toHaveTextContent("Network error");
//   //   });
//   // });
//   //
//   // it("renders loading state initially", () => {
//   //   vi.mocked(getReadingPlan).mockReturnValue(new Promise(() => {
//   //   })); // nigdy nie resolve
//   //   vi.mocked(getBooks).mockReturnValue(new Promise(() => {
//   //   }));
//   //
//   //   renderWithQueryClient(ReadingPlanSummary);
//   //
//   //   expect(screen.getByText("Loading reading plan...")).toBeInTheDocument();
//   //   expect(screen.getByText("Loading...")).toBeInTheDocument();
//   // });
// });