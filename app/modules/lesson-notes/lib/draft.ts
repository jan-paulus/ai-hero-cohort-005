import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraft = {
  length: number;
  tooLong: boolean;
  changed: boolean;
  canSave: boolean;
};

export function describeNoteDraft(draft: string, savedBody: string): NoteDraft {
  // The server trims a note before checking its length and storing it, so
  // surrounding whitespace neither counts nor is a change worth saving.
  const trimmed = draft.trim();
  const length = trimmed.length;
  const tooLong = length > MAX_NOTE_LENGTH;
  const changed = trimmed !== savedBody.trim();

  return {
    length,
    tooLong,
    changed,
    canSave: changed && length > 0 && !tooLong,
  };
}
