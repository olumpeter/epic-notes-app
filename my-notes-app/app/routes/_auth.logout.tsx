import {
    ActionFunctionArgs,
    createCookieSessionStorage,
    redirect,
} from "@remix-run/node"

import { validateCSRF } from "~/utils/csrf.server"
import { sessionStorage } from "~/utils/session.server"

export async function loader() {
    return redirect("/")
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    await validateCSRF(formData, request.headers)
    const cookieSession = await sessionStorage.getSession(
        request.headers.get("cookie")
    )

    return redirect("/", {
        headers: {
            "set-cookie": await sessionStorage.destroySession(
                cookieSession
            ),
        },
    })
}
