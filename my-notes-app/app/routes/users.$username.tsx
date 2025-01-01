import type {
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { isRouteErrorResponse, Link, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { db } from "~/utils/db.server";

export const loader = ({ params }: LoaderFunctionArgs) => {
    // throw new Error("🐨 Loader error");
    const username = params.username;
    const user = db.user.findFirst({
        where: { username: { equals: username } },
    });
    if (!user) {
        throw new Response("User not found", { status: 404 });
    }
    const data = {
        user: { name: user.name, username: user.username },
    };
    return data;
};

export const meta: MetaFunction<typeof loader> = ({
    data,
    params,
}) => {
    const displayName = data?.user.name ?? params.username;
    return [
        { title: `${displayName} | Epic Notes` },
        {
            name: "description",
            content: `Profile of ${displayName} on Epic Notes`,
        },
    ];
};

export default function ProfileRoute() {
    // throw new Error('🐨 Component error')
    const data = useLoaderData<typeof loader>();
    return (
        <div className="container mb-48 mt-36 border-4 border-green-500">
            <h1 className="text-h1">
                {data?.user.name
                    ? data.user.name
                    : data?.user.username}
            </h1>
            <Link to="notes" className="underline" prefetch="intent">
                Notes
            </Link>
        </div>
    );
}

export function ErrorBoundary() {
    return (
        <GeneralErrorBoundary statusHandlers={{404: ({params}) => (
            <p>No user with the username "{params.username}" exists</p>
        )}} />
    )
}
