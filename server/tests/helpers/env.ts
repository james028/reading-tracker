export function assertTestDatabase() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url.includes("reading_tracker_test")) {
    throw new Error(
      "DATABASE_URL must point to the test database. Refusing to run tests.",
    );
  }
}
