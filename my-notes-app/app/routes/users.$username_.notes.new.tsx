import { requireUser } from "~/utils/auth.server"
import { action, NoteEditor } from "./__note-editor"
import { LoaderFunctionArgs } from "@remix-run/node"
import { invariantResponse } from "~/utils/misc"

export async function loader({
    request,
    params,
}: LoaderFunctionArgs) {
    const user = await requireUser(request)
    invariantResponse(
        user.username === params.username,
        "Not authorized",
        {
            status: 403,
        }
    )
    return {}
}

export { action }
export default NoteEditor
