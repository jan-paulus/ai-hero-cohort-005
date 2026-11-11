import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { describeDraft, type NoteDraft } from "./lib/draft";

export type { NoteDraft };

/**
 * What the note editor shows for the text in its box: the character count,
 * whether it is over the limit, and whether Save would do anything.
 * `savedBody` is the note as stored, or "" when there is none yet.
 */
export function describeNoteDraft(draft: string, savedBody: string): NoteDraft {
  return describeDraft(draft, savedBody, MAX_NOTE_LENGTH);
}
