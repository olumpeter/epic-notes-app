import * as React from "react";
import os from "node:os";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import tailwindStylesheetUrl from "~/styles/tailwind.css?url";
import faviconAssetUrl from "~/assets/favicon.svg?url";
import fontStylesUrl from "~/styles/font.css?url";
import { GeneralErrorBoundary } from "./components/error-boundary";

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
    ];
};

export const meta: MetaFunction = () => {
    return [
        { title: "Epic Notes" },
        { name: "description", content: "Your own captain's log" },
    ];
};

export const loader = () => {
    // throw new Error("🐨 root loader error");
    const data = { username: os.userInfo().username };
    return data;
};

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="h-full overflow-x-hidden">
			<head>
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
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

export default function App() {
	// throw new Error('🐨 root component error')
	const data = useLoaderData<typeof loader>()
	return (
		<Document>
			<header className="container mx-auto py-6">
				<nav className="flex justify-between">
					<Link to="/">
						<div className="font-light">epic</div>
						<div className="font-bold">notes</div>
					</Link>
					<Link className="underline" to="users/kody">
						Kody
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

export function ErrorBoundary() {
	return (
		<Document>
			<div className="flex-1">
				<GeneralErrorBoundary />
			</div>
		</Document>
	)
}