import { useState } from "react"
import {
    Form,
    redirect,
    useActionData,
    useLoaderData,
} from "@remix-run/react"
import { data } from "@remix-run/node"
import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
} from "@remix-run/node"
import { z } from "zod"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import {
    getFormProps,
    getInputProps,
    getTextareaProps,
    useForm,
} from "@conform-to/react"
import { unstable_createMemoryUploadHandler as createMemoryUploadHandler } from "@remix-run/node"
import { unstable_parseMultipartFormData as parseMultipartFormData } from "@remix-run/node"

import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { TextArea } from "~/components/ui/textarea"
import { db, updateNote } from "~/utils/db.server"
import { cn, invariantResponse, useIsSubmitting } from "~/utils/misc"
import { floatingToolbarClassName } from "~/components/floating-toolbar"
import { Button } from "~/components/ui/button"
import { StatusButton } from "~/components/ui/status-button"
import { GeneralErrorBoundary } from "~/components/error-boundary"
import { validateCSRF } from "~/utils/csrf.server"

export async function loader({ params }: LoaderFunctionArgs) {
    const note = db.note.findFirst({
        where: { id: { equals: params.noteId } },
    })

    invariantResponse(note, "Note not found", { status: 404 })

    return {
        note: {
            title: note.title,
            content: note.content,
            images: note.images.map((i) => ({
                id: i.id,
                altText: i.altText,
            })),
        },
    } as const
}

const titleMaxLength = 100
const contentMaxLength = 10000
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

const NoteEditorSchema = z.object({
    title: z.string().max(titleMaxLength),
    content: z.string().max(contentMaxLength),
    imageId: z.string().optional(),
    file: z
        .instanceof(File)
        .refine((file) => {
            return file.size <= MAX_UPLOAD_SIZE
        }, "File size must be less than 3MB")
        .optional(),
    altText: z.string().optional(),
})

export async function action({
    request,
    params,
}: ActionFunctionArgs) {
    invariantResponse(params.noteId, "noteId param is required")

    const formData = await parseMultipartFormData(
        request,
        createMemoryUploadHandler({
            maxPartSize: MAX_UPLOAD_SIZE, // 3 MB
        })
    )
    // await validateCSRF(formData, request.headers)

    const submission = parseWithZod(formData, {
        schema: NoteEditorSchema,
    })

    if (submission.status !== "success") {
        return data(
            { status: "error", errors: submission } as const,
            { status: 400 }
        )
    }

    const { title, content, imageId, file, altText } =
        submission.value

    await updateNote({
        id: params.noteId,
        title,
        content,
        images: [
            {
                id: imageId,
                file: file,
                altText: altText,
            },
        ],
    })

    return redirect(
        `/users/${params.username}/notes/${params.noteId}`
    )
}

function ErrorList({
    id,
    errors,
}: {
    id?: string
    errors?: Array<string> | null
}) {
    return errors?.length ? (
        <ul id={id} className="flex flex-col gap-1">
            {errors.map((error, i) => (
                <li
                    key={i}
                    className="text-[10px] text-foreground-destructive"
                >
                    {error}
                </li>
            ))}
        </ul>
    ) : null
}

export default function NoteEdit() {
    const data = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>()
    const isSubmitting = useIsSubmitting()

    const [form, fields] = useForm({
        id: "note-editor",
        constraint: getZodConstraint(NoteEditorSchema),
        lastResult: actionData,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: NoteEditorSchema,
            })
        },
        defaultValue: {
            title: data.note.title,
            content: data.note.content,
        },
    })

    return (
        <div className="absolute inset-0">
            <Form
                method="post"
                className="flex h-full flex-col gap-y-4 overflow-x-hidden px-10 pb-28 pt-12"
                {...getFormProps(form)}
                encType="multipart/form-data"
            >
                <div className="flex flex-col gap-1">
                    <div>
                        <Label htmlFor={fields.title.id}>Title</Label>
                        <Input
                            {...getInputProps(fields.title, {
                                type: "text",
                            })}
                            autoFocus
                        />
                        <div className="min-h-[32px] px-4 pb-3 pt-1">
                            <ErrorList
                                id={fields.title.errorId}
                                errors={fields.title.errors}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={fields.content.id}>
                            Content
                        </Label>
                        <TextArea
                            {...getTextareaProps(fields.content)}
                        />
                        <div className="min-h-[32px] px-4 pb-3 pt-1">
                            <ErrorList
                                id={fields.content.errorId}
                                errors={fields.content.errors}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Image</Label>
                        <ImageChooser image={data.note.images[0]} />
                    </div>
                </div>
                <ErrorList id={form.id} errors={form.errors} />
            </Form>
            <div className={floatingToolbarClassName}>
                <Button
                    form={form.id}
                    variant={"destructive"}
                    type="reset"
                >
                    Reset
                </Button>
                <StatusButton
                    form={form.id}
                    type="submit"
                    disabled={isSubmitting}
                    status={isSubmitting ? "pending" : "idle"}
                >
                    Submit
                </StatusButton>
            </div>
        </div>
    )
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
    )
}

function ImageChooser({
    image,
}: {
    image?: { id: string; altText?: string | null }
}) {
    const existingImage = Boolean(image)
    const [previewImage, setPreviewImage] = useState<string | null>(
        existingImage ? `/resources/image/${image?.id}` : null
    )
    const [altText, setAltText] = useState(image?.altText ?? "")
    return (
        <fieldset>
            <div className="flex gap-3">
                <div className="w-32">
                    <div className="relative h-32 w-32">
                        <label
                            htmlFor="image-input"
                            className={cn(
                                "group absolute h-32 w-32 rounded-lg",
                                {
                                    "bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100":
                                        !previewImage,
                                    "cursor-pointer focus-within:ring-4":
                                        !existingImage,
                                }
                            )}
                        >
                            {previewImage ? (
                                <div className="relative">
                                    <img
                                        src={previewImage}
                                        alt={altText ?? ""}
                                        className="h-32 w-32 rounded-lg object-cover"
                                    />
                                    {existingImage ? null : (
                                        <div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
                                            new
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
                                    ➕
                                </div>
                            )}
                            {existingImage ? (
                                <input
                                    name="imageId"
                                    type="hidden"
                                    value={image?.id}
                                />
                            ) : null}
                            <input
                                id="image-input"
                                aria-label="Image"
                                className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
                                onChange={(event) => {
                                    const file =
                                        event.target.files?.[0]

                                    if (file) {
                                        const reader =
                                            new FileReader()
                                        reader.onloadend = () => {
                                            setPreviewImage(
                                                reader.result as string
                                            )
                                        }
                                        reader.readAsDataURL(file)
                                    } else {
                                        setPreviewImage(null)
                                    }
                                }}
                                name="file"
                                type="file"
                                accept="image/*"
                            />
                        </label>
                    </div>
                </div>
                <div className="flex-1">
                    <Label htmlFor="alt-text">Alt Text</Label>
                    <TextArea
                        id="alt-text"
                        name="altText"
                        defaultValue={altText}
                        onChange={(e) =>
                            setAltText(e.currentTarget.value)
                        }
                    />
                </div>
            </div>
        </fieldset>
    )
}
