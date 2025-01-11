import * as React from "react"
import os from "node:os"
import { cssBundleHref } from "@remix-run/css-bundle"
import type {
    LinksFunction,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node"
import {
    data,
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useMatches,
} from "@remix-run/react"
import { AuthenticityTokenProvider } from "remix-utils/csrf/react"

import tailwindStylesheetUrl from "~/styles/tailwind.css?url"
import faviconAssetUrl from "~/assets/favicon.svg?url"
import fontStylesUrl from "~/styles/font.css?url"
import { GeneralErrorBoundary } from "./components/error-boundary"
import { honeypot } from "./utils/honeypot.server"
import { HoneypotProvider } from "remix-utils/honeypot/react"
import { csrf } from "./utils/csrf.server"
import { SearchBar } from "./components/search-bar"

// import "~/styles/global.css"

export const links: LinksFunction = () => {
    return [
        {
            rel: "icon",
            type: "image/svg+xml",
            href: faviconAssetUrl,
        },
        {
            rel: "stylesheet",
            href: fontStylesUrl,
        },
        {
            rel: "stylesheet",
            href: tailwindStylesheetUrl,
        },
        ...(cssBundleHref
            ? [{ rel: "stylesheet", href: cssBundleHref }]
            : []),
    ]
}

export const meta: MetaFunction = () => {
    return [
        { title: "Epic Notes" },
        { name: "description", content: "Your own captain's log" },
    ]
}

export async function loader({ request }: LoaderFunctionArgs) {
    const honeyProps = honeypot.getInputProps()
    const [csrfToken, csrfCookieHeader] = await csrf.commitToken(
        request
    )
    return data(
        { username: os.userInfo().username, honeyProps, csrfToken },
        {
            headers: csrfCookieHeader
                ? { "set-cookie": csrfCookieHeader }
                : {},
        }
    )
}

function Document({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full overflow-x-hidden">
            <head>
                <Meta />
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Links />
            </head>
            <body className="flex h-full flex-col justify-between bg-background text-foreground">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

function App() {
    // throw new Error('🐨 root component error')
    const data = useLoaderData<typeof loader>()
    const matches = useMatches()
    const isOnSearchPage = matches.find(
        (m) => m.id === "routes/users._index"
    )
    return (
        <Document>
            <header className="container mx-auto py-6">
                <nav className="flex justify-between gap-6">
                    <Link to="/">
                        <div className="font-light">epic</div>
                        <div className="font-bold">notes</div>
                    </Link>
                    {isOnSearchPage ? null : (
                        <div className="ml-auto max-w-sm flex-1">
                            <SearchBar status="idle" />
                        </div>
                    )}
                    <Link className="underline" to="users/kody/notes">
                        Kody's Notes
                    </Link>
                </nav>
            </header>

            <div className="flex-1">
                <Outlet />
            </div>

            <div className="container mx-auto flex justify-between">
                <Link to="/">
                    <div className="font-light">epic</div>
                    <div className="font-bold">notes</div>
                </Link>
                <p>Built with ♥️ by {data.username}</p>
            </div>
            <div className="h-5" />
        </Document>
    )
}

export default function AppWithProviders() {
    const data = useLoaderData<typeof loader>()
    return (
        <AuthenticityTokenProvider token={data.csrfToken}>
            <HoneypotProvider {...data.honeyProps}>
                <App />
            </HoneypotProvider>
        </AuthenticityTokenProvider>
    )
}

export function ErrorBoundary() {
    return (
        <Document>
            <div className="flex-1">
                <GeneralErrorBoundary />
            </div>
        </Document>
    )
}
