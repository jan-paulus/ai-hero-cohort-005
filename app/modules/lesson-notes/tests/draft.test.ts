import { describe, it, expect } from "vitest";
import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { describeNoteDraft } from "../index";

describe("describeNoteDraft", () => {
  it("counts the characters and what is left", () => {
    const draft = describeNoteDraft("hello", "");
    expect(draft.length).toBe(5);
    expect(draft.remaining).toBe(MAX_NOTE_LENGTH - 5);
  });

  it("lets a new note be saved", () => {
    expect(describeNoteDraft("generics are neat", "")).toMatchObject({
      changed: true,
      tooLong: false,
      canSave: true,
    });
  });

  it("does not offer Save when the box matches the saved note", () => {
    expect(describeNoteDraft("same", "same")).toMatchObject({
      changed: false,
      canSave: false,
    });
  });

  it("ignores whitespace around the note, which the server trims", () => {
    expect(describeNoteDraft("same  \n", "same").changed).toBe(false);
    expect(describeNoteDraft("same", " same\n").changed).toBe(false);
  });

  it("does not offer Save for an empty or blank box", () => {
    expect(describeNoteDraft("", "old").canSave).toBe(false);
    expect(describeNoteDraft("   \n", "old").canSave).toBe(false);
  });

  it("allows a note of exactly the maximum length", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH), "");
    expect(draft).toMatchObject({
      remaining: 0,
      tooLong: false,
      canSave: true,
    });
  });

  it("flags a note one character over the maximum and blocks Save", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH + 1), "");
    expect(draft).toMatchObject({
      remaining: -1,
      tooLong: true,
      canSave: false,
    });
  });
});
