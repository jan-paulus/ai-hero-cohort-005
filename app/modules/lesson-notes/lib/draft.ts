export type NoteDraft = {
  length: number;
  remaining: number;
  tooLong: boolean;
  changed: boolean;
  canSave: boolean;
};

export function describeDraft(
  draft: string,
  savedBody: string,
  maxLength: number
): NoteDraft {
  const length = draft.length;
  const tooLong = length > maxLength;
  const trimmed = draft.trim();
  const empty = trimmed.length === 0;
  // The server trims a note before storing it, so surrounding whitespace is
  // not a change worth saving.
  const changed = trimmed !== savedBody.trim();

  return {
    length,
    remaining: maxLength - length,
    tooLong,
    changed,
    canSave: changed && !empty && !tooLong,
  };
}
