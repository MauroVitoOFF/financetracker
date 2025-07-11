import { describe, it, expect } from "vitest";
import { generateSignature, parseBackupDate } from "../dataSync";

describe("generateSignature", () => {
  it("should return a 64-char hex string", () => {
    const sig = generateSignature({ foo: "bar" });
    expect(sig).toMatch(/^[a-f0-9]{64}$/);
  });

  it("should generate same hash for same input", () => {
    const obj = { foo: "bar", count: 2 };
    expect(generateSignature(obj)).toBe(
      generateSignature({ count: 2, foo: "bar" })
    );
  });

  it("should generate different hashes for different objects", () => {
    const sig1 = generateSignature({ foo: "bar" });
    const sig2 = generateSignature({ foo: "baz" });
    expect(sig1).not.toBe(sig2);
  });
});

describe("parseBackupDate", () => {
  it("parses detailed backup filenames", () => {
    const date = parseBackupDate("backup-2024-07-10T11-30-00-000Z.json");
    expect(date?.toISOString()).toBe("2024-07-10T11:30:00.000Z");
  });

  it("parses simple backup filenames", () => {
    const date = parseBackupDate("financetracker-backup-2024-07-10.json");
    expect(date?.toDateString()).toBe("Wed Jul 10 2024");
  });

  it("returns null for invalid format", () => {
    expect(parseBackupDate("not-a-backup.json")).toBeNull();
  });
});
