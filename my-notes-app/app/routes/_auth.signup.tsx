import {
    type ActionFunctionArgs,
    type MetaFunction,
    redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { HoneypotInputs } from "remix-utils/honeypot/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { validateCSRF } from "~/utils/csrf.server";
import { checkHoneypot } from "~/utils/honeypot.server";

export const meta: MetaFunction = () => {
    return [{ title: "Setup Epic Notes Account" }];
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    await validateCSRF(formData, request.headers)
    checkHoneypot(formData)
    // we'll implement signup later
    return redirect("/");
}

export default function SignupRoute() {
    return (
        <div className="container flex min-h-full flex-col justify-center pb-32 pt-20">
            <div className="mx-auto w-full max-w-lg">
                <div className="flex flex-col gap-3 text-center">
                    <h1 className="text-h1">Welcome aboard!</h1>
                    <p className="text-body-md text-muted-foreground">
                        Please enter your details.
                    </p>
                </div>
                <Form
                    method="POST"
                    className="mx-auto flex min-w-[368px] max-w-sm flex-col gap-4"
                >
                    <HoneypotInputs />
                    <div>
                        <Label htmlFor="email-input">Email</Label>
                        <Input
                            autoFocus
                            id="email-input"
                            name="email"
                            type="email"
                        />
                    </div>
                    <Button className="w-full" type="submit">
                        Create an account
                    </Button>
                </Form>
            </div>
        </div>
    );
}
