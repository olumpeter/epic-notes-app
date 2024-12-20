import type { LoaderFunctionArgs } from "@remix-run/node";
import {
    Outlet,
    Link,
    NavLink,
    useLoaderData,
} from "@remix-run/react";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { db } from "~/utils/db.server";
import { cn } from "~/utils/misc";

export const loader = ({ params }: LoaderFunctionArgs) => {
    const username = params.username;

    const owner = db.user.findFirst({
        where: { username: { equals: username } },
    });

    if (!owner) {
        throw new Response("Owner not found", { status: 404 });
    }

    const notes = db.note
        .findMany({
            where: { owner: { username: { equals: username } } },
        })
        .map(({ id, title }) => ({ id, title }));

    const data = {
        owner: { username: owner.username, name: owner.name },
        notes: notes,
    };

    return data;
};

export default function NotesRoute() {
    const data = useLoaderData<typeof loader>();
    const ownerDisplayName = data.owner.name ?? data.owner.username;
    const navLinkDefaultClassName =
        "line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 text-base lg:text-xl";
    return (
        <main className="container flex h-full min-h-[400px] pb-12 px-0 md:px-8">
            <div className="grid w-full grid-cols-4 bg-muted pl-2 md:container md:mx-2 md:rounded-3xl md:pr-0">
                <div className="relative col-span-1">
                    <div className="absolute inset-0 flex flex-col">
                        <Link
                            to=".."
                            relative="path"
                            className="pb-4 pl-8 pr-4 pt-12"
                        >
                            <h1 className="text-base font-bold md:text-lg lg:text-left lg:text-2xl">
                                {ownerDisplayName}'s Notes
                            </h1>
                        </Link>
                        <ul className="overflow-y-auto overflow-x-hidden pb-12">
                            {data.notes.map((note) => (
                                <li
                                    key={note.id}
                                    className="p-1 pr-0"
                                >
                                    <NavLink
                                        to={note.id}
                                        preventScrollReset
                                        prefetch="intent"
                                        className={({ isActive }) =>
                                            cn(
                                                navLinkDefaultClassName,
                                                isActive &&
                                                    "bg-accent"
                                            )
                                        }
                                    >
                                        {note.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="relative col-span-3 bg-accent md:rounded-r-3xl">
                    <Outlet />
                </div>
            </div>
        </main>
    );
}

export function ErrorBoundary() {
    return (
        < GeneralErrorBoundary statusHandlers={{
            404: ({ params }) => (
                <p>No user with the username "{params.username}" exists</p>
            )
        }} />
    )
}