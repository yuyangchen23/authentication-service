import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password utilities", () => {
  it("verifies a correct password", async () => {
    const password = "ExamplePassword123";
    const hash = await hashPassword(password);

    const result = await verifyPassword(password, hash);

    expect(result).toBe(true);
  });
});
