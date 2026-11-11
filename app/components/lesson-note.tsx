import { type ReactNode, useId, useState } from "react";
import { useFetcher } from "react-router";
import { NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { describeNoteDraft, type NoteDraft } from "~/modules/lesson-notes";

export type LessonNoteData = { body: string; updatedAt: string } | null;

// Laid out like the Questions & Discussion card further down the page, so the
// two read as parts of one lesson rather than two different designs.
export function LessonNote({ note }: { note: LessonNoteData }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const savedBody = note?.body ?? "";
  const [body, setBody] = useState(savedBody);
  // The body last sent to the server. A save error describes that text, so
  // it stops applying once the Student edits the box.
  const [submittedBody, setSubmittedBody] = useState<string | null>(null);
  const isSaving = fetcher.state !== "idle";
  const error =
    fetcher.state === "idle" && body === submittedBody
      ? fetcher.data?.error
      : undefined;
  const draft = describeNoteDraft(body, savedBody);
  const headingId = useId();
  const descriptionId = useId();

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <NoteHeader headingId={headingId} descriptionId={descriptionId} />

        <fetcher.Form
          method="post"
          className="space-y-2"
          onSubmit={() => setSubmittedBody(body)}
        >
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            rows={5}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="What stood out in this lesson?"
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            className="resize-y"
          />

          <NoteFooter
            draft={draft}
            isSaving={isSaving}
            status={
              <NoteStatus error={error} changed={draft.changed} note={note} />
            }
          />
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteFooter({
  draft,
  isSaving,
  status,
}: {
  draft: NoteDraft;
  isSaving: boolean;
  status: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" size="sm" disabled={isSaving || !draft.canSave}>
        {isSaving ? "Saving..." : "Save note"}
      </Button>

      <output aria-live="polite">{status}</output>

      <span
        className={cn(
          "ml-auto text-xs",
          draft.tooLong ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {draft.length} / {MAX_NOTE_LENGTH}
      </span>
    </div>
  );
}

function NoteHeader({
  headingId,
  descriptionId,
}: {
  headingId: string;
  descriptionId: string;
}) {
  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        <NotebookPen className="size-5 text-primary" />
        <h2 id={headingId} className="text-xl font-semibold">
          Your Notes
        </h2>
      </div>
      <p id={descriptionId} className="mb-4 text-sm text-muted-foreground">
        Private to you. Jot down anything you want to remember from this lesson.
      </p>
    </>
  );
}

function NoteStatus({
  error,
  changed,
  note,
}: {
  error: string | undefined;
  changed: boolean;
  note: LessonNoteData;
}) {
  if (error) return <span className="text-sm text-destructive">{error}</span>;
  if (changed) {
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }
  if (!note) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Saved · last edited {formatRelativeTime(note.updatedAt)}
    </span>
  );
}
