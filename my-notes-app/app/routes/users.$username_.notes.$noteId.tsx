import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";

import type { loader as notesLoader } from "./users.$username_.notes";
import { db } from "~/utils/db.server";
import { floatingToolbarClassName } from "~/components/floating-toolbar";
import { Button } from "~/components/ui/button";
import { invariantResponse } from "~/utils/misc";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { csrf, validateCSRF } from "~/utils/csrf.server";
import { CSRFError } from "remix-utils/csrf/server";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

export const meta: MetaFunction<
    typeof loader,
    { "/routes/users.$username_.notes": typeof notesLoader }
> = ({ data, params, matches }) => {
    const notesMatch = matches.find(
        (m) => m.id === "/routes/users.$username_.notes"
    );
    const displayName =
        notesMatch?.data.owner.name ?? params.username;
    const noteTitle = data?.note.title ?? "Note";
    const noteContentSummary =
        data && data?.note.content.length > 100
            ? data?.note.content.slice(0, 97) + "..."
            : data?.note.content;
    return [
        {
            title: `${noteTitle} | ${displayName}'s Notes | Epic Notes`,
        },
        {
            name: "description",
            content: noteContentSummary,
        },
    ];
};

export async function loader({ params }: LoaderFunctionArgs) {
    const noteId = params.noteId;

    const note = db.note.findFirst({
        where: { id: { equals: noteId } },
    });

    if (!note) {
        throw new Response("Note not found", { status: 404 });
    }

    const data = {
        note: {
            id: note.id,
            title: note.title,
            content: note.content,
            images: note.images.map((i) => ({
                id: i.id,
                altText: i.altText,
            })),
        },
    };
    return data;
}

export async function action({
    params,
    request,
}: ActionFunctionArgs) {
    invariantResponse(params.noteId, "noteId param is required")

    const formData = await request.formData();
    await validateCSRF(formData, request.headers)
    const intent = formData.get("intent");

    invariantResponse(intent === "delete", "Invalid intent", {
        status: 400,
    });

    db.note.delete({ where: { id: { equals: params.noteId } } });
    return redirect(`/users/${params.username}/notes`);
}

export default function SomeNoteId() {
    const data = useLoaderData<typeof loader>();
    return (
        <div className="absolute inset-0 flex flex-col px-10">
            <h2 className="mb-2 pt-12 text-h2 lg:mb-6">
                {data.note.title}
            </h2>
            <div className="overflow-y-auto pb-24">
                <ul className="flex flex-wrap gap-5 py-5">
                    {data.note.images.map((image) => (
                        <li key={image.id}>
                            <a href={`/resources/images/${image.id}`}>
                                <img
                                    src={`/resources/images/${image.id}`}
                                    alt={image.altText ?? ""}
                                    className="h-32 w-32 rounded-lg object-cover"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
                <p className="whitespace-break-spaces text-sm md:text-lg">
                    {data.note.content}
                </p>
            </div>
            <div className={floatingToolbarClassName}>
                <AuthenticityTokenInput />
                <Form method="post">

                    <Button
                        type="submit"
                        name="intent"
                        value="delete"
                        variant="destructive"
                    >
                        Delete
                    </Button>
                </Form>
                <Button asChild>
                    <Link to="edit">Edit</Link>
                </Button>
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    return (
        <GeneralErrorBoundary
            statusHandlers={{
                404: ({ params }) => (
                    <p>
                        No note with the id "{params.noteId}" exists
                    </p>
                ),
            }}
        />
    );
}