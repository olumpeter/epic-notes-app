# Modern Full-Stack Web Development

# 1. 🔭 Full Stack Foundations

You'll learn important foundational skills of web app development including:

1. Styling a Web Application
2. Utilizing the URL for Routing and Navigation
3. Loading Data from the Server and rendering it in the UI
4. Making Data mutations in a database
5. Improving our Search Engine Optimization (SEO)
6. Gracefully handling errors and displaying them to the user

## 1.1 Styling

#### The Web

HTML, CSS, and JavaScript are foundational technologies upon which everything else in the web is based. Together, they create an excellent user experience in web applications.

The best way to get CSS loaded into your web application is to load a stylesheet file (in a `.css` file extension) via a special HTML tag called `<link>`.

```html
<link rel="stylesheet" href="styles.css" />
```

The `link` tag establishes a relationship between the HTML document and an external resource. In this case, the `rel` attribute is set to `stylesheet` and the `href` attribute is set to `styles.css` to tell the browser to load the CSS from the `styles.css` file.

The `link` tag can also be used to link other resources like favicons:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

This tells the browser to load the favicon for the site from the `favicon.svg` file.

Beyond that, `link` can be used for non-stylistic resources as well, like telling the browser to prefetch some data, preload a stylesheet, or preload a JS module:

```html
<link rel="prefetch" href="/some-resource" as="fetch" />
<link rel="preload" href="/some-file.css" as="style" />
<link rel="modulepreload" href="/some-file.js" />
```

The `<link>` element is an _extremely_ powerful configuration mechanism for your application. [📜Read more about it on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). 🦉You might also find [Link header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) useful.

#### In Remix

Remix embraces the web platform API for loading stylesheets by exposing a special convention for routes to define link elements that should be on the page when the route is active.

Additionally, Remix has a special way to colocate your CSS stylesheets within your application allowing you to import a `.css` file.

Here are some of the built-in supported features:

-   Specifying a `default` import (like `import stylesheetUrl from './styles.css`') will copy the CSS file to your public directory allowing you to link to the copied file.
-   When properly configured `import './styles.css`' will load the CSS file and add it to a special stylesheet you can link.
-   When properly configured `import './styles.module.css`' will load the CSS file as a [CSS Module](https://github.com/css-modules/css-modules) and give you an object of class names you can apply when you've loaded the special CSS file.
-   If a `postcss.config.js` file is present in your application, Remix will automatically run your CSS through [PostCSS](https://postcss.org/). If none is present, but a `tailwind.config.js` is found, Remix will run your CSS through [Tailwind](https://tailwindcss.com/).
-   When properly configured, you can even use [`vanilla-extract`](https://vanilla-extract.style/) to define your styles in a `.css.ts` file.

We're going to explore most of these approaches to style a web application. In our application, most of our styling is done through [Tailwind](https://tailwindcss.com/) with some regular stylesheets and CSS Modules sprinkled in.

> A note about CSS-in-JS: Remix does support typical CSS-in-JS libraries, but recommends tools that expose a CSS file for linking. It's just a better user experience. Tailwind especially is great because the CSS file never grows very big regardless of how large your application grows.

-   [📜Remix Docs: Styling Guide](https://remix.run/docs/en/main/guides/stylingn)

### 1.1.1 Links to Public Files

👨‍💼 First off, we've got an awesome favicon for our site in the `public` directory. Browsers will request the `/favicon.ico` by default, but we've got a ✨ responsive ✨ that will look good in light and dark mode (you will find a media query embedded in the SVG itself). Let's get that on the page.

To do this, we'll need to add a `<link>` to .

In Remix, you add links to the page by exporting a links function:

```tsx
// ...
import type { LinksFunction } from "@remix-run/node"

export const links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            // all files in the public directory are served at the root of the site
            href: "/my-stylesheet.css",
        },
    ]
}

//...
```

It's important for you to know that Remix puts all the responsibility of what appears in the document on you. The `app/root.tsx` component you export is responsible for everything that appears between `<html>` and `</html>` and that includes the `<head>` element which contains the links that routes define. So you need to render the `<Links />` element in that component:

```tsx
// ...
import { Links } from "@remix-run/react"

// ...

export default function App() {
    return (
        <html>
            <head>
                <Links />
            </head>
            {/* ... */}
        </html>
    )
}
```

> 🦉 🦉 Remember, check the Files section at the bottom of these instructions for links that will open your editor to the right file you need to alter. My other emoji friends will be waiting there for you to guide you through this task.

🦉 Tip: Check the network tab in the app on the home page. You'll know you got it right when you see the favicon.svg file loaded.

SVG favicons are not currently supported in Safari. See [caniuse](https://caniuse.com/link-icon-svg) for browser support.

-   📜 [links export](https://remix.run/docs/en/main/route/links)
-   📜 [<Links />](https://remix.run/docs/en/main/components/links)

#### Conclusion

👨‍💼 Awesome work.

You may be wondering why we're using the links export with the <Links /> component instead of just adding a <link> tag directly inside our <head>.

It would definitely work that way, however it's a good idea to get in the habit of using the links export because you'll get a little more help from TypeScript and when you're in other routes, you can't just add a <link> to the <head> because it's not there. We'll get into this more later.

### 1.1.2 Asset Imports

👨‍💼 Unfortunately, we never know when we're going to want to change our favicon, so our caching strategy has to reflect that. We can't just tell the browser to cache it forever, so every hour or so the browser has to download the favicon again even if it is unchanged.

So, instead of hard-coding the URL for the favicon, we can "import" the asset and Remix will take care of getting it into our public directory and give us the URL to it. As a part of this process it will add a piece to the filename that "fingerprints" the file. So, if we change the favicon, the URL will change and the browser will download the new one. And we don't have to think about it!

Let's do this. 🐨 So first you'll need to move the `favicon.svg` from to .

Then, in , we can import it like this:

```tsx
import faviconAssetUrl from "./assets/favicon.svg"
```

SVG favicons are not currently supported in Safari. See [caniuse](https://caniuse.com/link-icon-svg) for browser support.

-   📜 [Remix Config for assetsBuildDirectory](https://remix.run/docs/en/main/file-conventions/remix-config#assetsbuilddirectory) (this is how you configure where Remix puts fingerprinted assets)

#### Conclusion

👨‍💼 Super! Now if you check out the network tab, you'll notice the SVG that is loaded for our favicon has a special "hash" in the URL which serves as a fingerprint of the file's contents. If you change the contents of the SVG (like add a comment), then the fingerprint changes and the browser will download the new file.

All without us having to worry about it. So now our caching can be as aggressive as we want it to be, and we don't have to worry about users getting stale content.

### 1.1.3 Global Styles

👨‍💼 Every application has _some_ stylesheets that need to apply globally throughout the application. In our case, we want to have a special font applied to our app which your co-worker Kellie (🧝‍♀️ hello there 👋) placed in the public directory.

🧝‍♂️ Yep, I also added `./app/styles/font.css` which loads the font and gets things ready for use.

👨‍💼 Thanks Kellie! So, what we need you to do is import that stylesheet into the application so that it is applied globally. It'll be pretty similar to the favicon work you've already done, but you'll use rel="stylesheet". When you're done, the <link> should be something like: `<link rel="stylesheet" href="/build/_assets/font-SBXW2PKK.css"/>`.

-   📜 [Remix Styling Docs: Regular Stylesheets](https://remix.run/docs/en/main/styling/css#regular-css)

#### Conclusion

👨‍💼 Hopefully this was pretty straightforward. Anytime we need a stylesheet to be globally applied to our application, we simply add the stylesheet to the links export from the module.

### 1.1.4 Compiling CSS

👨‍💼 Even though most of our users are using modern browsers, there are some CSS features that not all of our users' browsers support. To make sure that our styles work for everyone, we need to compile our CSS using [a tool called PostCSS](https://postcss.org/).

Support for this tool is built-in to Remix. As soon as Remix finds configuration for PostCSS, it will automatically compile the CSS files you import for you as part of the build process.

🐨 First, Click here to create the `postcss.config.js` file.

And stick this config in there:

```tsx
export default {
    plugins: {
        "tailwindcss/nesting": {},
        tailwindcss: {},
        autoprefixer: {},
    },
}
```

🐨 Next, Click here to create the `tailwind.config.ts` file.

And stick this config in there:

```tsx
import { type Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme.js"

export default {
    content: ["./app/**/*.{ts,tsx,jsx,js}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Nunito Sans",
                    "Nunito Sans Fallback",
                    ...defaultTheme.fontFamily.sans,
                ],
            },
        },
    },
} satisfies Config
```

This is where we configure [Tailwind](https://tailwindcss.com/), a CSS framework that we'll be using to style our app. Our PostCSS configuration includes the Tailwind plugin so we can use the Tailwind directives in our css files to get the Tailwind stylesheet on the page. 📜 You can read more about configuring Tailwind with PostCSS in [the Tailwind docs](https://tailwindcss.com/docs/using-with-preprocessors).

Remix may not pick up on the new config files until you restart the dev server. Simply click "Stop App" and then "Start App" again to restart the dev server. That should work, but if it doesn't, stop the workshop app and restart it.
🐨 Now all that's left is for you to create a file and put in the Tailwind directives:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then, using the knowledge you've gained from the previous steps, import this file and include a link tag for it in the file.

Finally, to test that this worked, you can style the "Hello World" to have a Tailwind class name like `p-8 text-xl`. If you see the text get bigger and more spaced, you're all set!

#### Conclusion

👨‍💼 Now that we have this set up we can update the Tailwind config to resemble our design aesthetic. Thanks for getting that wired up for us.

### 1.1.5 Bundling CSS

👨‍💼 While we build out our application, we'll probably have some need to use a component library that requires some CSS be added to the application. One or two of these are not a big deal, but our `root.tsx` links export could get pretty big if we do this for a lot of components like this.

So, Remix allows you to import CSS files that are bundled automatically. It's pretty simple:

```tsx
import stylesheetUrl from "./styles1.css?url" // <-- you use the URL in the links export
import "./styles2.css" // <-- this will be bundled
```

So, if you just import the CSS file without an "import clause" (the `stylesheetUrl` variable in the example above), it will be bundled for you.

However, we are still responsible for everything on the page between the <html> and the </html> tags, so if we want the bundled CSS file on the page then we need to make sure we add it to the links. Remix gives us access to that URL through a special package called `@remix-run/css-bundle`:

```tsx
import "./styles2.css"
import "./styles3.css"
import { cssBundleHref } from "@remix-run/css-bundle"
```

The contents of `styles2.css` and `styles3.css` will appear within the file that is referenced by `cssBundleHref`. So, we can add that to our `links` export.

If you don't have any such imports, then `cssBundleHref` will (correctly) be `undefined` so the browser doesn't load an empty file, so you'll want to handle that case.

🧝‍♂️ I've added an import to a static CSS file just to test that things work in this exercise. Check my changes.

📜 [Remix Styling Docs for CSS Bundling](https://remix.run/docs/en/main/guides/styling#css-bundling)

#### Conclusion

🧝‍♂️ Did I getcha!? 😂🤣

👨‍💼 Great work, now we can easily add bundled CSS for our apps. This applies not only to CSS from component libraries that we import, but also to our own CSS components. Additionally, Remix has built-in support for [CSS Modules](https://github.com/css-modules/css-modules) and [Vanilla Extract](https://vanilla-extract.style/) the CSS of which will also appear in the bundle. So, included in the CSS bundle will be:

-   [CSS Modules](https://github.com/css-modules/css-modules)
-   [Vanilla Extract](https://vanilla-extract.style/)
-   [Side-effect CSS imports](https://remix.run/docs/en/main/guides/styling#css-side-effect-imports)

🧝‍♂️ I'm going to make a couple changes to make the homepage look nicer. Feel free to check the diff if you'd like!

📜 [Remix Styling Docs for CSS Bundling](https://remix.run/docs/en/main/guides/styling#css-bundling)

🦺 When you use `Array.filter(Boolean)` in your own code, you might notice a different behavior, from what you've just seen in the solution. Typescript is still yelling at you 😮. That's because Typescript doesn’t play well with Array.filter(Boolean). To tackle this problem we use [Matt Pocock's handy library ts-reset](https://www.totaltypescript.com/ts-reset).

🦉 If you're curious about why we don't just use the bundle solution for all our CSS files (like tailwind and the fonts), watch this tip from Kent:

## 1.2 Routing

#### The Web

One of the critical pieces of the web is the URL (which is short for Uniform Resource Locator 📜 [What is a URL](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL)). The URL is what allows us to navigate to different pages on the web. It allows users to bookmark and share those pages with one another. As a result, using the URL as the primary mechanism for storing state is not only common, but often necessary for an excellent user experience. Users of web apps often expect to be able to return to a specific page and see the same content they did before.

URLs can be broken into segments. On the "What is a URL" article, we find a helpful diagram:

![Segments making a URL](images\001-url-segments.png)

For more on these sections, check the [article](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL).

The domain name is something typically configured once for an entire site, so you don't typically end up working with that part of the URL much.

The anchor (the part following `#`) is used to link to specific elements on a page by their ID (so when the user opens their browser, it automatically scrolls to that element on the page). We don't often work with that part of the URL in day-to-day web development either.

What we spend most of our time working with is the pathname and parameters.

The pathname can be broken into what we call "segments" which are separated by `/`. For example, the pathname `/about` has one segment, and the pathname `/about/team` has two segments. The pathname segments can also be used to store state. For example, if we wanted to show a specific user's profile, we could use the pathname `/users/123` where `123` is the user's ID. The user's ID segment is often referred to as a "route parameter".

🦉As you can tell, there's a bit of an unfortunate term overload in web development. "Parameters" in the diagram above refers to the part of the URL after the `?`. But we also just talked about "route parameters." And then of course there are "function parameters." All of these serve a similar purpose. To avoid confusion, we typically call "route parameters" simply "params" and the bit after the `?` is often called "query params" or "search params."

##### Navigation

To navigate around the web, we use `<a>` tags ("a" is short for "anchor", please don't ask why it's not called "link" 🤷‍♂️). For example, if we wanted to link to the user's profile page, we could use the following:

```html
<a href="/users/123">User Profile</a>
```

You can also navigate to other pages on the web using a `<form>` tag. For example, if we wanted to search for users, we could use the following:

```html
<form action="/users/search" method="GET">
    <input type="text" name="q" />
    <button type="submit">Search</button>
</form>
```

This will take the value of the input and add it to the URL as a query param (`?q=...`). The method attribute tells the browser to use the `GET` HTTP method when submitting the form. We'll get into forms more in a later exercise.

You can also navigate using JavaScript, but generally you should use anchors and forms.

##### Routers

Most web applications use what is called a "router" to associate specific code with the URL segment. This allows us to both organize our code, and optimize it for loading performance (to ensure we only load the code that is necessary based on what our user needs on a specific route). Routers are also often used to help load the data that will be used on the page. The Router typically allows you to define certain URL segments as "params" which can be any value, and the Router will parse the URL (and those params), and execute the code that has been configured for that specific URL (passing along the params to the code). This is what allows GitHub to load a specific repository when you visit `https://github.com/epicweb-dev/full-stack-foundations` for example. Route params are often represented by a `:` in the URL, for example: `https://github.com/:username/:repo`. This tells the router that the `username` and `repo` segments are params, and that they can be any value.

#### In Remix

Remix has a built-in router that enables you to easily map URLs and route parameters to files in your application's `app/routes` directory. Thanks to the file system convention from Remix, we don't have to spend any time configuring the routes for our application. That said, it can be quite helpful to know what the generated routes are, so the Remix command line interface (CLI) has a routes command that will print out all of the routes in your application. To use it, open your terminal in a Remix project, and run:

```
npx remix routes
```

Here's an example of the output in a bigger application:

```tsx
<Routes>
    <Route file="root.tsx">
        <Route path="*" file="routes/$.tsx" />
        <Route
            path="auth/:provider"
            file="routes/_auth+/auth.$provider.ts"
        >
            <Route
                path="callback"
                file="routes/_auth+/auth.$provider.callback.ts"
            />
        </Route>
        <Route
            path="forgot-password"
            file="routes/_auth+/forgot-password.tsx"
        />
        <Route path="login" file="routes/_auth+/login.tsx" />
        <Route path="logout" file="routes/_auth+/logout.tsx" />
        <Route
            path="onboarding"
            file="routes/_auth+/onboarding.tsx"
        />
        <Route
            path="onboarding/:provider"
            file="routes/_auth+/onboarding_.$provider.tsx"
        />
        <Route
            path="reset-password"
            file="routes/_auth+/reset-password.tsx"
        />
        <Route path="signup" file="routes/_auth+/signup.tsx" />
        <Route path="verify" file="routes/_auth+/verify.tsx" />
        <Route path="about" file="routes/_marketing+/about.tsx" />
        <Route index file="routes/_marketing+/index.tsx" />
        <Route path="privacy" file="routes/_marketing+/privacy.tsx" />
        <Route path="support" file="routes/_marketing+/support.tsx" />
        <Route path="tos" file="routes/_marketing+/tos.tsx" />
        <Route path="admin/cache" file="routes/admin+/cache.tsx" />
        <Route
            path="admin/cache/lru/:cacheKey"
            file="routes/admin+/cache_.lru.$cacheKey.ts"
        />
        <Route
            path="admin/cache/sqlite"
            file="routes/admin+/cache_.sqlite.tsx"
        >
            <Route
                path=":cacheKey"
                file="routes/admin+/cache_.sqlite.$cacheKey.ts"
            />
        </Route>
        <Route path="me" file="routes/me.tsx" />
        <Route
            path="resources/download-user-data"
            file="routes/resources+/download-user-data.tsx"
        />
        <Route
            path="resources/healthcheck"
            file="routes/resources+/healthcheck.tsx"
        />
        <Route
            path="resources/note-images/:imageId"
            file="routes/resources+/note-images.$imageId.tsx"
        />
        <Route
            path="resources/user-images/:imageId"
            file="routes/resources+/user-images.$imageId.tsx"
        />
        <Route
            path="settings/profile"
            file="routes/settings+/profile.tsx"
        >
            <Route
                path="change-email"
                file="routes/settings+/profile.change-email.tsx"
            />
            <Route
                path="connections"
                file="routes/settings+/profile.connections.tsx"
            />
            <Route index file="routes/settings+/profile.index.tsx" />
            <Route
                path="password"
                file="routes/settings+/profile.password.tsx"
            />
            <Route
                path="password/create"
                file="routes/settings+/profile.password_.create.tsx"
            />
            <Route
                path="photo"
                file="routes/settings+/profile.photo.tsx"
            />
            <Route
                path="two-factor"
                file="routes/settings+/profile.two-factor.tsx"
            >
                <Route
                    path="disable"
                    file="routes/settings+/profile.two-factor.disable.tsx"
                />
                <Route
                    index
                    file="routes/settings+/profile.two-factor.index.tsx"
                />
                <Route
                    path="verify"
                    file="routes/settings+/profile.two-factor.verify.tsx"
                />
            </Route>
        </Route>
        <Route
            path="users/:username"
            file="routes/users+/$username.tsx"
        />
        <Route
            path="users/:username/notes"
            file="routes/users+/$username_+/notes.tsx"
        >
            <Route
                path=":noteId"
                file="routes/users+/$username_+/notes.$noteId.tsx"
            />
            <Route
                path=":noteId/edit"
                file="routes/users+/$username_+/notes.$noteId_.edit.tsx"
            />
            <Route
                index
                file="routes/users+/$username_+/notes.index.tsx"
            />
            <Route
                path="new"
                file="routes/users+/$username_+/notes.new.tsx"
            />
        </Route>
        <Route path="users/" index file="routes/users+/index.tsx" />
    </Route>
</Routes>
```

Because sometimes you need to reach outside the conventions (for example the file system can be a bit limited on the types of characters we can have in our URL segments), it is good to know that you can programmatically generate routes as well in your `remix.config.js`.

Remix's router supports what's called "nested routing." Often, the UI of an application is nested in a similar fashion to the URL. For example, let's take a URL like this: `https://example.com/sales/invoices/:invoiceId`. The "root" of the application (the part of the app that's on all pages) is considered the "parent route" of all the routes on the page. The `/sales` portion is a child of the root, the `/invoices` is a child of the `/sales` route, and the `/:invoiceId` is a child of the `/invoices` route. The UI could resemble something like this: A left navigation section (root), then a top navigation (sales), then a list (invoices), and finally a details portion of the page (invoice ID).

We'll be exploring how to create these relationships in the exercise.

##### Navigation

To facilitate navigation, Remix provides a `<Link>` component that you can use to create links (`<a>`) to other pages in your application without triggering a full-page refresh (which is what clicking a regular `<a>` will do). This is a nice performance optimization and it also has better accessibility characteristics and gives a better user experience.

Remix also has a built-in `<Form>` component which improves upon the browser's handling of forms. We'll dive deeper into that in a future exercise.

##### The Route Convention

It's important for you to know that we're not using the built-in Remix file routing convention. Remix originally shipped with a route convention, but Remix v2 will be shipping a new one that enables better colocation of related files (which helps with long-term maintenance).

We will actually be using a different convention for our app that is based on the v2 convention but allows for even better colocation of related files. The library we're using is called `remix-flat-routes`. This has already been configured in our `remix.config.js` (as it uses the programmatic interface for defining routes).

We'll guide you along in creating route files that match this convention, but it wouldn't hurt to have the [remix-flat-routes documentation](https://github.com/kiliman/remix-flat-routes) open in another tab to reference.

At any time, remember if you get lost, you can run `npx remix routes` in the project directory to check the generated routes configuration based on your file system.

### 1.2.1 Routes

Because routing involves creating files, you're going to need to follow the instructions in this document. There aren't any files for Kody to give you instructions in like usual.
👨‍💼 We got our first user! His name is "Kody" 🐨 so we're going to build Kody's user profile page and his notes pages (his username is "kody"). Users in this app have profile pages and can make notes. So, we want to have the following routes:

1. `/users/kody` - Kody's profile page
2. `/users/kody/notes` - Kody's list of notes
3. `/users/kody/notes/some-note-id` - A specific note

These pages will get more interesting in the future, but for now, let's just focus on the routing portion. Your job is to create four route files.

From a layout perspective, we want the profile page to take up the full screen. The notes page should also take up the full screen, but the specific note should be nested inside the notes page.

It could be useful to run the solution app and see what the final result looks like by clicking on the "Solution" tab and running that app.

It's not very important that you memorize the route convention. This is something you will become familiar with over time and you can always refer back to the [`remix-flat-routes`](https://github.com/kiliman/remix-flat-routes) documentation any time you need a refresher.

Let's start with the profile page. Following the route convention, we have a choice of where we can place the file. We can either put it in `routes/users.kody.tsx` or `routes/users+/kody.tsx`.

Let's talk about what these special characters mean for `remix-flat-routes`. The `.` in `users.kody` tells `remix-flat-routes` to separate the users and kody by a `/`. So `users.kody` becomes `users/kody`. The `+` in `users+/kody` does the same thing, except it allows you to use a folder instead of an extra-long filename. That's the only difference. In this exercise we're going to go with the `+/` here, but we'll use the `.` in another route.

In this case, because we know we're going to have several routes under the `/users` path, I think it makes the most sense to use the `users+/` directory approach.

🐨 Click here to create `app/routes/users+/kody.tsx`
🐨 In this file, create a component and export it as the default export. You can start that component out by returning a `<div>` with a title like this:

```tsx
export default function KodyProfileRoute() {
    return (
        <div className="container mb-48 mt-36 border-4 border-green-500">
            <h1 className="text-h1">Kody</h1>
        </div>
    )
}
```

🐨 I'm adding some borders to make it easier for you to notice the relationships between the routes.
🐨 Once you've got that, open .

"Kody" should be displayed on the page. One fun fact, you'll also notice the Epic Notes logo in the header and the footer are on the page as well, even though you didn't render those yourself. That's because you're actually **already using nested routing**! The route you just created is nested inside!

So let's create the file for the `/users/kody/notes` route.

🐨 Click here to create `app/routes/users+/kody\_+/notes.tsx`
Inside of this one, let's start with:

```tsx
export default function NotesRoute() {
    return (
        <div className="flex h-full justify-between pb-12 border-8 border-blue-500">
            <h1 className="text-h1">Notes</h1>
        </div>
    )
}
```

🐨 Now you can go to .

The `<h1>` of "Notes" should be displayed on the page, but the "Kody" from the previous route should not be displayed. That's because we're not using layout nesting here thanks to the `_` in the filename.

Great, now let's create the route for a specific note. This one will be nested inside the notes route. For this, I don't think it's very useful to have another folder of nesting, so instead of the `+/` syntax for a directory, we'll just add notes. to the filename.

🐨 Click here to create `app/routes/users+/kody\_+/notes.some-note-id.tsx`
Inside of this one, let's go with:

```tsx
export default function SomeNoteId() {
    return (
        <div className="container pt-12 border-8 border-red-500">
            <h2 className="text-h2">Some Note</h2>
        </div>
    )
}
```

Super, now let's go to .

Uh oh! We still just have "Notes" on the screen!? But the URL has our `/some-note-id` in it.

If you like, you can cd into playground and run `npx remix routes`. If you do that, it'll print this:

```tsx
<Routes>
    <Route file="root.tsx">
        <Route index file="routes/index.tsx" />
        <Route path="users/kody" file="routes/users+/kody.tsx" />
        <Route
            path="users/kody/notes"
            file="routes/users+/kody_+/notes.tsx"
        >
            <Route
                path="some-note-id"
                file="routes/users+/kody_+/notes.some-note-id.tsx"
            />
        </Route>
    </Route>
</Routes>
```

So the routes are definitely right there. What's going on? Well, remember that we're _nesting_ our routes. And we wouldn't want Remix to just stick the UI for each nested route one below the other. As the developer, we want to control where the nesting actually happens. The parent contains the child which contains the grandchild etc. So what we need is to have the parent (`/users/kody/notes`) to tell Remix where to put the child (`/users/kody/notes/some-note-id`). And we do this using the `<Outlet />` component.

Here's a quick example of how this works:

```tsx
export default function Parent() {
    return (
        <div>
            <h1>Parent</h1>
            <Outlet />
        </div>
    )
}
```

```tsx
export default function Child() {
    return <h2>Child</h2>
}
```

With that, when you navigate to `/parent/child`, you'll see "Parent" above "Child". If we swap the `<h1>` and `<Outlet />` in the parent, then the child will be above the parent. The parent gets to decide where its child goes.

🐨 So go ahead and open the file and get the `<Outlet />` component from `@remix-run/react`, then render it below the `<h1>` we put in there earlier.

Great! Now when we're on, it shows the "Notes" title and the "Some Note" text! 🎉

Another thing that will be really useful for us is to have some default content that shows up on the `/users/kody/notes` page when we're not on a specific note. Something like "please select a note" or something. We can do that by adding an index route to the notes route. We'll create that right next to our `some-note-id` route.

🐨 Click here to create `app/routes/users+/kody\_+/notes.index.tsx`
Stick this in there:

```tsx
export default function NotesIndexRoute() {
    return (
        <div className="container pt-12 border-8 border-purple-500">
            <p className="text-body-md">Select a note</p>
        </div>
    )
}
```

Now if we navigate to, we'll see the "Select a note" text.

Sweet! You've got nested routing working. 🎉

#### Conclusion

##### Routes

There's a lot more to learn about routing in Remix. Your best friend is the `npx remix routes` command which will help you figure out how your routes are structured based on your file structure.

The key concepts are:

1. Layout Nesting
2. URL Nesting

Once you nail those two concepts, then routing in Remix will be much more straightforward.

##### Route Module Exports

There are a number of things we can export from each of these routes. You will recall from the last exercise that we exported a links function from the file. We can export that from each of these routes as well. This has the benefit of allowing us to provide specific links to render when the route is active which will later be removed when the user navigates away.

This has great implications for CSS that you want applied only on specific pages. Both in the sense that we can reduce the amount of CSS loaded on individual pages, but also in the sense that CSS can be scoped to specific routes greatly reducing unexpected clashes and making everything much more predictable.

Remix also has the ability to preload everything in our links if we want to preload a page as the user uses the site, but we'll get to that later

### 1.2.2 Links

👨‍💼 Our users want to get around the application quickly. So, we're going to add a few links in a couple places.

We want the logo in the header and footer to link to `/`.

On the `/users/kody` page, we want to link to the user's notes route.

```diff
import { Link } from "@remix-run/react";

export default function KodyProfileRoute() {
    return (
        <div className="container mb-48 mt-36 border-4 border-green-500">
            <h1 className="text-h1">Kody</h1>
+            <Link to="notes" className="underline">
+                Notes
+            </Link>
        </div>
    );
}
```

On the `/users/kody/notes` route, we should link back to the `/users/kody` page. 💰 Tip, you can use a relative path (`..`), but you'll need to learn about [the `relative` prop](https://api.reactrouter.com/v7/interfaces/react_router.LinkProps.html#relative) on the `Link` component.

On the notes route, We should also link to the `/users/kody/notes/some-note-id route`.

**Digression**: [Leveraging the Power of Tailwind-merge Library for Seamless Tailwind CSS Integration](https://medium.com/@emmycodes/leveraging-the-power-of-tailwind-merge-library-for-seamless-tailwind-css-integration-f861959001af)

**Digression**: [An Extensive Tutorial on Using `clsx` in React Projects](https://medium.com/@fortune.nwuneke/an-extensive-tutorial-on-using-clsx-in-react-projects-5e41205df8e2)

The `Link` component in Remix is a wrapper around the `Link` component from react router, so you can learn all about it in [the react router Link docs](https://reactrouter.com/en/main/components/link).

As a bit of extra credit, do your best to leverage relative routes where you can rather than hard-coding the full path of the route. This will make it easier to move files around relative to each other in the future.

Also, look into the [`NavLink`](https://reactrouter.com/en/main/components/nav-link) component so you can highlight the link to the `some-note-id` route when that child route is active. You can use the `bg-accent` class name when the link is active.

Remix is built on top of React Router, so you'll often find it beneficial to read the React Router docs. Remix also provides a few extra features on top of React Router, so you'll want to read the Remix docs as well.

-   📜 [Remix Link docs](https://remix.run/docs/en/main/components/link)
-   📜 [Remix NavLink docs](https://remix.run/docs/en/main/components/nav-link)
-   📜 [React Router Link docs](https://reactrouter.com/en/main/components/link)
-   📜 [React Router NavLink docs](https://reactrouter.com/en/main/components/nav-link)

#### Conclusion

👨‍💼 Links have been around since the beginning of the web and allow users to discover more about the site they're using. Taking advantage of relative links and the NavLink component, makes it easier to move things around and provide the user a great experience.

### 1.2.3 Route Params

👨‍💼 It wouldn't make much sense if we needed to make a new route for every single user. Instead, we can use a route parameter to capture the username and use it in our route handler. We typically call these "params".

With the file-based route convention we're using, we define params by using a `$`-prefixed filename segment. For example:

| Route File Example                       | Params       | Example Path           |
| ---------------------------------------- | ------------ | ---------------------- |
| `app/routes/ships.$shipId.tsx`           | `$shipId`    | `/ships/1234`          |
| `app/routes/bookings+/$bookingId.tsx`    | `$bookingId` | `/bookings/1234`       |
| `app/routes/chats+/$chatId.messages.tsx` | `$chatId`    | `/chats/1234/messages` |

🐨 So in this exercise, let's rename our files and folders from using `kody` to use the `$username` and from `some-note-id` to `$noteId` params and instead of rendering "Kody" we can render the username from params as well as the noteId.

💰 You can get the param value from `useParams()` which you can import from `@remix-run/react`. For example:

```tsx
import { useParams } from "@remix-run/react"

export default function PetRoute() {
    const params = useParams()
    return <h1>Hello {params.petName}</h1>
}
```

Once you've finished with that, you should be able to go to any username and it will display that username. Here are some to try:

---

And then for the note:

---

#### Conclusion

👨‍💼 Great work 👏👏👏 We've got routes setup and we're using the route params to get the username of the user we want to show. You've done a great job so far. Next, we're going to want to actually load user data, but you should take a break first... Thanks for the good work 🎉

### 1.2.4 Resource Routes

🦉 So far, every HTTP request we make to our app's routes will result in UI:

`/` - Home page
`/users/kody` - Profile page
`/users/kody/notes` - Notes page
`/users/kody/notes/noteId` - Note page

But there are lots of use cases for URLs that don't return UI. For example:

`/api/users` - Get a list of users
`/healthcheck` - Get a report of the health of the application
`/images/some-image-id` - Get an image

For these, the HTTP request and response is a little different from our UI routes. Instead of the request expecting an HTML response, it expects JSON, or plaintext, or an image. In some cases these requests could be non-GET requests as well.

In Remix, these routes are known as ["Resource Routes"](https://remix.run/docs/en/main/guides/resource-routes) and they are pretty simple. Here's the rule that determines whether a route is a resource route or not:

A **Resource Route** is like a regular route, but it doesn't have a `default` export.
That's it. Just don't have a default export and you're working in a resource route.

The behavior of a resource route is what you might expect. For regular routes, the entire nested routing structure is called and rendered to get the final result. For resource routes, only the route that matches the request is called. So, with a resource route, the `loader` in the `app/root.tsx` will not be run

👨‍💼 We'd like you to create a resource route for a healthcheck for our application. We can put this route at any URL we like (`/healthcheck`, or `/hc`, etc.), but we're going to put it at `/resources/healthcheck`.

Our application is pretty simple, so for now, we'll keep the resource route simple as well. We'll just return a plaintext response with the text "OK".

So create `resources.healthcheck.tsx` file at `app/routes` directory, and create a loader that returns a plaintext response with the text "OK".

💰 The loader
If you need the extra help, here's what the loader code should look like:

```ts
export async function loader() {
    return new Response("OK")
}
```

You'll know you got it when you go to `resources/healthcheck` and all you see is "OK".

**Warning**: You may notice that doing a client-side navigation to a resource route breaks the app. This is because that route doesn't exist in a UI context. So you need to make sure if you link to a resource route, you either use a regular ``or add the`reloadDocument` prop to the Link.

-   📜 [Resource Routes](https://remix.run/docs/en/main/guides/resource-routes)

#### Conclusion

👨‍💼 Great! Now we have a good place to put additional "health check" code that will allow us to put in an automated check on the status of our database connection and other things in the future.

If you'd like to see where the Epic Stack takes this eventually, check [the healthcheck route there](https://github.com/epicweb-dev/epic-stack/blob/main/app/routes/resources%2B/healthcheck.tsx).

Additionally, if you'd like to learn more about healthcheck endpoints and how to configure them as part of a deployment pipeline, you can watch this video from the [Deploy Web Applications All Over the World tutorial](https://www.epicweb.dev/tutorials/deploy-web-applications):

🦉 Remember, Remix doesn't have any opinion on which routes in your folder structure are "resource routes" and which ones aren't. So, even though we put ours under `app/routes/resources+/`, that's not a requirement.

And you can send _any_ response you like. We're sending a plaintext response, but you can stream audio or video, generate a PDF, generate an `og:image` for SEO, or anything else that can be done over HTTP. You could use resource routes to create a REST or GraphQL API. Whatever you can do with HTTP, you can do with resource routes. (We'll get to how to handle non-GET requests soon).

Also, Remix doesn't care whether you export anything else in your resource route either. I've taken advantage of this by exporting functions and components that use the resource route directly in the same file. This level of colocation is brilliant. Feel free to read more about this on [EpicWeb.dev](https://epicweb.dev/) in ["Full Stack Components"](https://www.epicweb.dev/full-stack-components).

## 1.3 Loading

#### The Web

When a user goes to a URL, the browser makes a request to the server. The server then sends back a response, which is usually HTML. The browser then renders the HTML into a page. The HTML can contain references to other resources, such as images, CSS, and JavaScript. The browser will make requests for these resources and process them as well.

That initial request for HTML normally comes with all the information the user expects to see. However, users of modern web applications expect to be able to interact with the page without reloading it. So, to keep the data that's on the page up-to-date as the user makes changes and navigates around, the application also needs to make requests to the server for data. Around 2006, a new technology was developed for this purpose called AJAX. AJAX stands for Asynchronous JavaScript and XML. It's a way of making requests to the server without reloading the page.

These days, web applications typically use a newer web standard called [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Among other things, this API allows the browser to make requests to a server without triggering a full page refresh. There are various parts to this API, but two critical objects are called [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

We can use this API to make requests to our servers to get data. Normally, a request for data will return a JSON object which is a string that looks like a JavaScript object. We can use the `JSON.parse` function to convert this string into a JavaScript object, but this is so common, that the `fetch` `Response` object has a special method (called `.json()`) to parse the JSON response for us.

It's important to know that much of the `fetch` API is asynchronous and [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based, so it will be very useful to understand promises when using the `fetch` API.

On the server side, most modern JavaScript runtime environments support the `fetch` API out of the box.

Even though we're not requesting HTML from the server, we still make `fetch` requests to URLs. Typically a server will have a router that is responsible for routing these URL requests to the appropriate "handler" (or code that handles that "resource"). The handler will then do whatever work is necessary to get the data and return a response to the client.

When the server sends the response, it can include special "metadata" that goes along with the response that tells the browser how to handle the response. This is in the form of [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers). We won't dive very deep into headers in this workshop, but they are a very important part of the fetch API that you should be aware of.

#### In Remix

Remix is built around the `fetch` API. In a Remix application, you work directly with the `Request` and `Response` objects. Even if the server-side framework has bespoke APIs for handling requests and responses, your remix adapter will convert those to and from web standard `Request` and `Response` objects for you.

In our application, we're using the popular [`express`](https://npm.im/express) web framework for handling our traffic and the `@remix-run/express` adapter to convert the `express` requests and responses to and from `Request` and `Response` objects.

Remix has built-in support for loading data for both the initial page load (the "document" request) and for subsequent data requests (the "data" requests). One cool part about Remix is that you typically don't need to worry about whether the data is being loaded as a document request or a data request. Your code to load the data will be the same, as will the code to render the UI.

The data loading is a part of the route module in Remix. Each route module in the `app/routes` directory can export an async function called a [`loader`](https://remix.run/docs/en/1.14.3/route/loader). This function is run only on the server and therefore has access to your database, APIs, private environment variables, etc. It receives the `Request` object and `params` object and should return a `Response` object. For example:

```tsx
import type { LoaderFunctionArgs } from "@remix-run/node"

export async function loader({
    request,
    params,
}: LoaderFunctionArgs) {
    const dataString = JSON.stringify({ hello: "world" })
    return new Response(dataString, {
        headers: { "content-type": "application/json" },
    })
}
```

Because the most common use case for loaders is returning JSON data, Remix also exports a utility called `json` which allows you to more easily create a JSON object:

```tsx
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"

export async function loader({
    request,
    params,
}: LoaderFunctionArgs) {
    return json({ hello: "world" })
}
```

Then the UI code can use the [`useLoaderData`](https://remix.run/docs/en/1.14.3/hooks/use-loader-data) hook from `@remix-run/react` which will return the data from the `loader` function.

```tsx
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

export async function loader({
    request,
    params,
}: LoaderFunctionArgs) {
    return json({ hello: "world" })
}

export default function MyRoute() {
    const data = useLoaderData<typeof loader>()
    return (
        <div>
            <h1>{data.hello}</h1>
        </div>
    )
}
```

Finally, you can control the headers with remix's json utility by passing a second argument to json which allows you to set things like cache headers for example. And of course, if you want full control you can always create the response object yourself instead of using the utility. Remix exposes the full web platform to you.

### 1.3.1 Loaders

👨‍💼 Now that our routing is all taken care of, Kellie (your coworker 🧝‍♂️) has taken some time to make the app look a little bit nicer and now you need to add some data loading.

🧝‍♂️ I've also created a temporary fake database for us to use until we get around to actually putting together a real database in the future. You can find it in the app/utils/db.server.ts file if you want to, but don't worry about it because Marty (the moneybag 💰) will give you all the code you need to work with it as it's not really necessary for what you're learning today.

🧝‍♂️ I've also added a user with some notes in the database by default as well. The username is `kody` and I've added a link for Kody's notes on the home page in the top right corner to make it easier for you to get to his first note which can be found at `/users/kody/notes/d27a197e`.

The tool we're using is [@mswjs/data](https://github.com/mswjs/data) which you may find useful in other contexts. But again, don't worry too much about it. We'll get to the real database stuff in another workshop.

👨‍💼 Great, with that out of the way, it's time for us to actually start loading data. Based on what you learned in the background for this exercise, you should be familiar with the conventions necessary to load data into the UI and the emoji will be there to guide you along as you go. We're going to be loading data on the profile, list of notes, and note page.

🐨 All the instructions for this exercise will be in the files themselves. You can go through them in any order. They will be pretty similar to each other.

Don't forget you can use the "Files" menu below to open the files necessary for this workshop. And if you _really_ get stuck, you can always look at the diff tab to see what you're missing.

#### Conclusion

👨‍💼 Awesome work! Now we can display real user data in our database (🧝‍♂️ our fake database 😅). But, what happens if the user goes to a page for a user or note that does not exist? 😬 Let's handle that.

### 1.3.2 Handle Missing Data

👨‍💼 One of our Quality Assurance folks discovered an issue. If you go to a user that does not exist, the app crashes. For example, try this one: 😬

We had to ignore some TypeScript errors with `// @ts-expect-error` which should have tipped us off about this problem... 🦺 Lily the life jacket is not amused.

We need to handle this case. That should be a 404 error. So after trying to get the user from the database, you're going to need to check whether the returned user exists. If they don't, then you should throw a 404 error. Here's an example how you do that:

```tsx
export async function loader({ params }) {
    const sandwich = await db.sandwich.findFirst({
        where: { id: params.id },
    })

    if (!sandwich) {
        throw new Response("Sandwich not found", { status: 404 })
    }

    return json({ sandwich })
}
```

Hmmm... `throw` a response!? How weird is that? Well, in Remix it's exactly how you solve this problem. It allows you to easily exit code flow and send a response right away. You can even put it into a utility function:

{/_ TODO: add types and make this an assertion function that infers and maintains the typing of sandwich. Possibly even make it generic. _/}

```tsx
function assertDefined<Value>(
    value: Value | null | undefined
): asserts value is Value {
    if (value === undefined || value === null) {
        throw new Response("Not found", { status: 404 })
    }
}
```

```tsx
export async function loader({ params }) {
    const sandwich = await db.sandwich.findFirst({
        where: { id: params.id },
    })

    assertDefined(sandwich)

    return json({ sandwich })
}
```

Remix will handle catching the response for us and send the response we threw along. But it does so in a special way which we'll get to in a future exercise. For now, just handling the error with a proper status code is enough.

So please handle possible missing data in the loaders of the profile, note list, and note routes.

#### Conclusion

👨‍💼 Terrific! Well done. Now we're handling data that's missing (and 🦺 Lily the Life Jacket is happy our types are happy too). Like I said, we'll handle the error UI in another exercise, but this is a good start.

🧝‍♂️ I'm going to make a few changes for you. I'll add a (non-functional) delete button and a (functional) edit link to the existing note page. The edit link takes users to a new note edit route which I made as well. All it has in there is a JSON string of the note data. I'm also going to be adding a few components to make things look nice.

If you've got some extra time, feel free to do this yourself. Or you can simply check my changes.

## 1.4 Mutations

#### The web

Ever since the invention of HTML, we've had the ability to create interactive web applications thanks to the `<form>` element:

```html
<form>
    <label>
        Type:
        <input name="sandwichType" />
    </label>
    <button type="submit">Create Sandwich</button>
</form>
```

When a form is submitted on the web (like if we were to type "ham" in the `sandwichType` input and click "Create Sandwich"), the browser will take all associated form elements (the `sandwichType` input in our example above) and "serialize" them into what's called a "query string" (e.g. `sandwichType=ham`) and make a request to the server at the current URL. So, if this form appears on the route `/sandwiches`, submitting the form will trigger a full-page refresh to the route `/sandwiches?sandwichType=ham`.

This is great for search pages for example, but it would be really bad for a login form (you wouldn't want someone looking over your shoulder to see your password in the URL would you?), which is why the `<form>` element also allows you to specify a method attribute to switch from the default GET request to a POST request: `<form method="POST">`.

Even though `GET` and `POST` are not the only methods available in HTTP, they are the only two methods available on HTML forms. If you try anything other than `POST`, the browser will just do a `GET` instead. If you'd like to learn more about this, watch the tip below:
When the method is POST the form body is submitted as a "payload" instead of a query string. The browser will encode it as `application/x-www-form-urlencoded`. On the server side, you can use [the Request's formData method](https://developer.mozilla.org/en-US/docs/Web/API/Request/formData) to get the form data as a `FormData` object:

```tsx
const formData = await request.formData()
const sandwichType = formData.get("sandwichType")
```

You can also change the encoding type of the form by setting the `enctype` attribute. The only typical value for this attribute is `multipart/form-data`, which is used for file uploads.

Sometimes the server code you want to have handle the form submission is not at the same URL where the form appears. In this case, you can use the action attribute to specify a different URL:

```tsx
<form action="/make-a-sandwich">
    <label>
        Type:
        <input name="sandwichType" />
    </label>
    <button type="submit">Create Sandwich</button>
</form>
```

This would make a request to `/make-a-sandwich` instead of `/sandwiches`.

#### The back button

The browser submits forms with full-page refreshes, and expects to get a response from the server that tells the browser what to do next. If the response is HTML, then the browser will simply render that HTML. However you should _not_ do this for a successful form submission.

Have you ever seen those really annoying popups when hitting the back button that say "Confirm Form Resubmission"? That's because the browser is trying to resubmit the form data to the server that you submitted when you were brought to that page the first time. This can be a major problem if the request that was submitted was a bank transfer or an airline ticket purchase.

This is a really common problem with an extremely simple solution: **don't respond with HTML for successful form submissions**. Instead, respond with a redirect (using the `Location` header and a 302 or 303 status code). This is commonly referred to as "Post/Redirect/Get" (PRG) pattern.

#### Revalidation

Because this is a full-page refresh, the HTML the server sends back to the user will always have the latest data. This is awesome because it means you don't really need to worry about state management. The database can be the source of truth. So with the foundational web primitives we have, web apps will always have fresh data as the user navigates with links and submits forms.

Unfortunately, that's not the default situation if you try to update data with JavaScript (which you can do with the `fetch` API). You would do this if you don't want a full-page refresh when the user submits a form, which is the user experience that our users expect from modern web applications. This drastically complicates things because now we have to worry about state management in the client to keep the UI up-to-date. But it's worth the work. Can you imagine every time you like a tweet you get a full-page refresh? What a disaster _that_ would be!

This can be a real challenge... Unless you're using a [Progressively Enhanced Single Page App](https://kcd.im/pespa) framework like Remix 😉

#### In Remix

Remix has mutation capabilities built-in the framework and it's entirely based on the browser behavior for `<form>`s. Remix is a "browser emulator" which simply means it prevents the full-page refresh, but still makes it so you don't have to worry about revalidation because Remix will revalidate all your data when the form submission is successful.

The API for mutations in your UI code is just like a regular `<form>`, except you use [Remix's `<Form>` component](https://remix.run/docs/en/main/components/form).

Because Remix is a full-stack application framework, it also has a server-side API for handling the form's submission. It looks very similar to the `loader` API. In your route module, you export an [async `action` function](https://remix.run/docs/en/main/route/action) and receive the `request` and `params`, and you're expected to return a `Response` (remember, if the form submission is successful, you should return a redirect):

```tsx
import { Form } from "@remix-run/react"
import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
} from "@remix-run/node"

export async function action({
    request,
    params,
}: ActionFunctionArgs) {
    const formData = await request.formData()
    const sandwichType = formData.get("sandwichType")

    // do something with the sandwichType

    return redirect("/sandwiches")
}

export default function SandwichChooser() {
    return (
        <Form method="POST">
            <label>
                Type: <input name="sandwichType" />
            </label>
            <button type="submit">Create Sandwich</button>
        </Form>
    )
}
```

`action`s are called for non-GET requests, and `loaders` are called for GET request, so if your form does not specify a method or specifies `method="GET"`, then your `loader` will be called instead of the `action`.
Again, once your form has been submitted, Remix will revalidate all your data so you don't have to worry about state management in the client.

It's important to know that on the web and in Remix, there can only be one "navigational" form submission at a time. You definitely can submit multiple forms back-to-back, but the last one will always "win" in the event of a redirect.
In Remix there's also a mechanism for programmatically submitting data without user interaction (using a hook called [`useFetcher`](https://remix.run/docs/en/main/hooks/use-fetcher)). This is a bit more advanced than we'll get in this workshop though so we'll save it for later.

### 1.4.1 Forms

👨‍💼 We need to add support for editing notes. You'll be required to make a form for the notes edit page. In this first step we're only expecting you to make the form itself, don't worry about making it work yet (Remix won't let you anyway).

The emoji will be your guide through this exercise!

-   📜 [<Form>](https://remix.run/docs/en/main/components/form)

#### Conclusion

👨‍💼 Great! With the form in place (and preloaded with the existing note's data) you can submit the form and you'll get a Remix error telling you that you've need an action before you can submit.

I'll mention also that if you use a `<form>` instead of a `<Form>`, the form will submit, but [you get a 405 (Method Not Allowed) status code](https://mdn.io/405). That response is given to us from Remix because our route doesn't support handling anything but GET requests. That's where actions come into play!

### 1.4.2 Actions

👨‍💼 Just like our `loader` responds to `GET` requests for data, the `action` responds to non-`GET` requests for data. The `action` accepts the same parameters as the `loader` and is expected to return a `Response`. It's also typically expected to return a `redirect` or a `json` response and can use the same utilities.

So now, we want you to get the `formData` from the `request` and use it to update the note, and then redirect back to the note's page.

Don't worry about doing any validation or error handling. We'll cover that later. Additionally, we'll handle the TypeScript errors in the next step.

-   📜 [action](https://remix.run/docs/en/main/route/action)

#### Conclusion

👨‍💼 Great! Now the basic functionality is there.

You know what's _really_ cool? You didn't have to do anything to get the data updated in the app. As soon as the note is updated in your action, the data in the app is automatically updated as well! This is because Remix is emulating the browser for us, and the browser would have completely refreshed the page which effectively gives us the latest data. This is a really powerful feature of Remix and we'll discuss it more later.

Another important thing to note is that this form works without any client-side JavaScript. That's actually how we get away with not needing to manage state! This is a huge boost to developer productivity and user experience. Take a look at YouTube.com sometime on a throttled network and notice that the input field is not rendered until after a huge amount of JavaScript shows up, and even when it is rendered, it doesn't work until even more JavaScript shows up. This is a really bad UX that could be avoided if they simply leveraged the platform for the search input.

For now, let's tidy it up a bit.

### 1.4.3 FormData Types

🦉 An important thing to know about `request.formData` is the values stored in it can have three different types:

-   `null` - the value doesn't exist in the form data at all
-   `string` - This applies to inputs (including checkboxes and radio buttons), textareas, and select elements.
-   `File` - This applies to file inputs.

It's impossible for us to prevent users from submitting invalid data (users can change the types in our form using the browser devtools or even submit the form using a tool like Postman). But we know that if the data is invalid, we don't want to proceed with the form submission, and frankly we can't really offer any recourse for the user, so we can simply throw an error which we can handle as gracefully as possible.

You can test this out by changing the form to have a typo. Like changing `name` of the `title` to `title2` for example. Then submit the request and make sure the response is what you expect.

#### Conclusion

👨‍💼 Great, now our TypeScript is happy (🦺 YAY!) and users submitting forms incorrectly will get a more helpful error message. We'll demonstrate how to more gracefully handle these errors later.

### 1.4.4 Button Forms

🦉 Folks who are used to building client-side focused applications may be familiar with a button triggering a fetch request:

```tsx
function DeployTheSocks() {
    return (
        <button
            onClick={() => {
                fetch("/api/deploy-the-socks", { method: "POST" })
            }}
        >
            Deploy the socks!
        </button>
    )
}
```

This works, but of course there are a lot of considerations you need to take into account. For example:

-   What if the user clicks the button twice?
-   What if the user clicks the button while the request is still in flight?
-   What if the user clicks the button while the request is still in flight, and then navigates away from the page?
-   What if the request fails?
-   What if the user clicks the button twice, but the second response returns first?

The edge cases are... numerous. Once you've factored all that in, you're left with code that's tricky to manage.

There's a better way. Make the button a form, and let the browser (or your browser emulator, Remix (we'll talk about this more soon)) handle the edge cases for you. It's a nice and declarative API.

👨‍💼 We want to make the Delete button functional. So you're going to need to wrap the button in a form and add an action.
We don't have a way to create new notes yet, so if you delete all the notes, you can stop and start the server again and all the notes will be back.

#### Conclusion

👨‍💼 Great! Isn't that nice and declarative? Edge cases are handled in a nice and declarative way. We still have much to dive into with giving the user a better experience, which is the subject of the next exercise, but for now our form is functioning well!

🦉 It's important to note that we're using the HTTP method `POST` instead of `DELETE` for this submission. It does technically work with `DELETE`, but in a limited capacity. We'll talk more about this in the next exercise as well, but I'll just leave you with this gem: there are only two valid HTTP methods allowed in HTML forms: `GET` and `POST`. 📜 [Learn more about form method here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

We're still not quite done here, let's improve this a bit more.

### 1.4.5 Intent

👨‍💼 Our `action` for the delete button is pretty simple. In the future we'll probably add a "favorite" button where users can mark a note as a favorite, but our `action` only handles deleting a note.

To help us to distinguish the user's preferred action, we'll use a common pattern of adding a `name` and `value` to the delete button:

```tsx
<button type="submit" name="intent" value="delete">
    Delete
</button>
```

🤯 yes, it's true. Submit buttons are form controls, just like inputs, and can therefore have names and values. From there you can get the intent from the request form data and handle it accordingly.

Doing things this way will also ensure the request is performed properly.

#### Conclusion

👨‍💼 Great! Now we've got fully functional mutations for both editing and deleting notes. In the future, we can handle creating new notes, but that will require logging in as a user and associating the note with that user. We'll get to that in the future!

🦉 You may have noticed that Remix is automatically canceling requests if you hit the delete button multiple times. This is an awesome feature of Remix. Feel free to learn more by watching this Epic Web tip:

## 1.5 Scripting

#### The web

The browser is pretty capable of doing many things necessary to build web applications, but there are two significant limitations most web applications face:

-   Navigation (including form submissions) trigger full-page reloads.
-   Pending UI is limited and not customizable.

Full-page refreshes are just not acceptable in the modern age. Can you imagine if "liking" a tweet triggered a full page reload? I know I would like fewer tweets, that's for sure.

Pending UI in the browser really only amounts to the favicon turning into a spinner, and in some cases, a mobile browser will have a progress bar. Completely non-customizable and of limited use.

On top of that, the collection of built-in HTML elements is not sufficient for most applications. Furthermore, many of those elements are limited in their customizability (particularly with styling).

To give our users the experience they expect, we can't simply rely on HTML and CSS to do the job. Even if you're building a simple web application, you'll be forced to include some client-side JavaScript to ensure it is accessible (look forward to the Accessibility exercise for more on that).

Additionally, we can use JavaScript to help build faster applications by anticipating the user's next action and preloading the necessary code and data. By using JavaScript to avoid a full page reload we can also reduce the amount of content needed to be sent over the network (particularly when considering an application the user uses for an extended period of time).

The first version of JavaScript was standardized at the end of 1995, three months after HTML was standardized and before HTTP and CSS were standardized. The original standardized version of JavaScript was quite limited compared to what we can do now, but it did allow for some basic interactivity. It was also limited by the 📜 [DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) which has come a long way since then as well.

Modern-day JavaScript and DOM APIs are powerful enough to make up for shortcomings in what's available via HTML and CSS alone (though there are exciting advancements in those areas as well). In general, if you can do it in HTML and CSS, you should. If you can't, JavaScript is a great way to fill in the gaps.

To get JavaScript running in your application, you use a `script` tag. With this, you have a few options:

```html
<!-- Basic scripts -->
<script src="path/to/script.js"></script>
<script>
    // JavaScript code goes here
</script>

<!-- Modern Modules -->
<script type="module">
    // JavaScript code goes here
    import { foo } from "path/to/module.js"
</script>
<script type="module" src="path/to/module.js"></script>
```

There are important differences between the different types of scripts which we won't dive into too much today. The `type="module"` scripts are a relatively new addition to the web platform and are the most powerful. They allow you to use the 📜 [ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) syntax to import and export code. This is the syntax that is used in modern frameworks and is the recommended way to write JavaScript for the web.

There are various other attributes you can add to the `<script>` tag to customize how it is loaded and executed. For example, you can add a `defer` attribute to tell the browser to load the script in the background and execute it after the page has loaded (this is actually the default for `type="module"`). You can also add a `async` attribute to effectively tell the browser to load the script in the background and execute it as soon as it's ready. You can also add a `crossorigin` attribute to specify how the browser should handle cross-origin requests. For more on these and other attributes, check out the 📜 [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script).

One last thing that's important to call out is that in order to solve the "full page reload" problem, we have to take a lot of the browser's responsibilities upon ourselves. We end up using `event.preventDefault()` on `<a>` clicks and `<form>` submissions. Unfortunately, the browser does a _lot_ of work for us that we have to re-implement ourselves when we do this. It's almost like it would be useful to have a framework to handle this stuff for us...

#### In Remix

When you generate a new Remix project, it comes set up with scripts already. The `entry.client.tsx` file is the entry point for the client-side code. Typically, this will be the file responsible for [hydrating the application](https://react.dev/reference/react-dom/client/hydrateRoot). For example:

```tsx
import { RemixBrowser } from "@remix-run/react"
import { startTransition } from "react"
import { hydrateRoot } from "react-dom/client"

startTransition(() => {
    hydrateRoot(document, <RemixBrowser />)
})
```

The `startTransition` bit ensures that the hydration is done in a way that doesn't block the main thread. This is important because hydration can take a while on lower end devices, and we don't want to block the user from interacting with the page while it's happening. For example, if the HTML loads and the user starts scrolling the page, the scroll can be interrupted by hydration, leading to a "janky" experience. By hydrating our root in a transition, we can ensure that the user can interact with the page while hydration is happening without being interrupted.

Another thing to call out is the fact that we're hydrating the entire `document` rather than just an element in the `body` as is common in other frameworks. By doing this, we have much more control over everything between `<html>` and `</html>` which can be very useful.

But this is not all that's required to get the client-side code of a Remix app running. Remember that you're responsible for everything between `<html>` and `</html>` in your `app/root.tsx` component. So if you're not rendering any `<script>` elements, then no JavaScript will be loaded. The trick is that because Remix is building (and fingerprinting) our JavaScript, we don't actually know what the `src` attribute of our `<script>` should be. This is why Remix provides a `Scripts` component that you can use to render the necessary `<script>` elements. For example:

```tsx
import { Links, Meta, Scripts } from "@remix-run/react"

// ...
export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                {/* ... */}
                <Scripts />
            </body>
        </html>
    )
}
// ...
```

Of course, you can always place a JavaScript file in the `public` directory and reference it directly in the `src` attribute of a `<script>` in your `root.tsx` (or any other) component. Just keep in mind that those would not be processed by Remix, so you'll want to make sure they execute in every browser version you support.

Additionally, you can always render an inline `<script>` element if you like. The same rules apply (they're not processed), but in React, you also have to use the `dangerouslySetInnerHTML` prop to render the contents of the script. For example:

```tsx
<script
    type="module"
    dangerouslySetInnerHTML={{
        __html: `
			// JavaScript code goes here
		`,
    }}
/>
```

In general, inline scripts can be tricky to maintain (due to a lack of tooling), but very useful in some situations.

While it's not recommended to use inline scripts for a lot of code, if you need to do it, check out the [es6-string-javascript](https://marketplace.visualstudio.com/items?itemName=zjcompt.es6-string-javascript) extension for vscode to get syntax highlighting in that string.

### 1.5.1 scripts

🧝‍♂️ I removed JavaScript script tags from because they are unnecessary. Everything we've done so far works whether JavaScript is running in the browser or not. Go ahead and try it out. Open up the app (in a new tab) and check the network tab. You'll notice there's no JavaScript loaded by the application. Click around and submit forms and you'll find that everything works as expected. The browser has been able to do this navigation and form submission stuff since the very beginning and it's pretty good at it.

But now, we've actually got some things we want to do with client-side JavaScript, so we want to add it back.

👨‍💼 That's right, we want to start adding some client-side pending UI, prefetching, and eventually even optimistic UI. It's going to be great. But we'll need JavaScript on the client to do it.

So, let's add the `<Scripts />` component back. We'll also want to add a couple other components, but don't worry... 🐨 Kody will be there to tell you what to do.

-   📜 `<Scripts />`
-   📜 `<LiveReload />`

#### Conclusion

🧝‍♂️ Thanks for adding that back. Those development components will be really nice to have.

👨‍💼 Great work! You should be able to tell now that the page transitions are a bit smoother and don't trigger full-page reloads. Unfortunately, that also means the user won't get feedback of their navigations and form submissions if they take some time. We'll definitely want to come along later and add some pending UI. But we've got other problems to deal with first.

### 1.5.2 Scroll Restoration

👨‍💼 Now that we've got JavaScript running on the page, our customers are noticing that their scroll position is not where they expect it to be. For example, if you're on the notes list page and you're scrolled down a bit, then clicking the "Edit" link leaves you where you are when it should scroll the user to the top of the page so they can edit the note. This is because the browser is no longer responsible for navigations, so the role of scroll restoration lies in our hands!

Luckily, Remix has a 📜 [ScrollRestoration](https://remix.run/docs/en/main/components/scroll-restoration) component we can use to fix this. Please use that component!

Tip: To test this out, make your browser window short so that your page is scrolling, then scroll to the bottom and click the Edit button.
Once you've done that, come back here, I've got another task for you.

You got it done? Ok, great! Now I actually need you to "undo" the scroll restoration for a particular navigation. If you're scrolled down a bit on the list of notes, then change notes, it's jarring to have the page scroll to the top. So for those links, we don't actually want to scroll the user to the top. Oh what to do?

Luckily, Remix allows you to control this scroll restoration behavior on a per-link basis using the 📜 [preventScrollReset](https://reactrouter.com/en/main/components/link#preventscrollreset) prop (through React Router):

```tsx
<Link preventScrollReset to="candy">
    Candy
</Link>
```

Tip: To test this out, make your browser window short so that your page is scrolling, then scroll to the bottom and click different notes.
Go ahead and add the preventScrollReset prop to those links.

-   📜 [`<ScrollRestoration />`](https://remix.run/docs/en/main/components/scroll-restoration) on Remix
-   📜 [`<ScrollRestoration />` on React Router](https://reactrouter.com/en/main/components/scroll-restoration) (the remix implementation is built on top of this)

#### Conclusion

👨‍💼 Wow! Isn't that awesome!? Even if you arbitrarily slow down your network, you can make it feel like the page is loading instantly! Nice work!

### 1.5.3 Custom Scripts

Please note that the learning objective for this part of the exercise is the use of custom inline scripts. The specific script used is to expose environment variables following a pattern I still need to write an article about. If you struggle to follow the pattern, don't worry about that. Focus on what it takes to get a custom inline script running.
🦉 For this step, you need a little more background info about Remix. In Remix, you have two "bundles" of JavaScript: the server bundle and the client bundle. Each of these has its own "entry" file which is the first file that gets executed when the bundle is loaded. Remix has a default entry file for the server and the client, but you can override these with your own entry files by creating a file named `entry.server.tsx` or `entry.client.tsx` in your `app` directory. We'll be customizing both of these in this exercise, so they've been added.

👨‍💼 We want to have some custom dev tools for our app (learn about this concept in [Make your own DevTools](https://kentcdodds.com/blog/make-your-own-dev-tools)). We want to make sure we only load these in development mode. So we need a way to dynamically load this into the client during development. We determine whether we're in development based on the environment variable `NODE_ENV`.

🧝‍♂️ I added a file which is responsible for ensuring we have the right environment variables in our server and makes it easy to get the environment variables that are public and should be accessible to our UI code.

Remember that UI code runs both on the server and the client. So what we want is something that allows us to have a common global variable that has all the environment variables that are public and should be accessible to our UI code. For example:

```tsx
function ConnectDiscord() {
    return <a href={getDiscordAuthorizeURL()}>Connect to Discord</a>
}

function getDiscordAuthorizeURL(domainUrl: string) {
    const url = new URL("https://discord.com/api/oauth2/authorize")
    url.searchParams.set("client_id", ENV.DISCORD_CLIENT_ID)
    url.searchParams.set(
        "redirect_uri",
        `https://example.com/discord/callback`
    )
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "identify guilds.join email guilds")
    return url.toString()
}
```

🧝‍♂️ To do this, I've also created custom and files which override the default entry files for the server and client in Remix.

With the `entry.server.tsx`, we can take care of the server-side of setting this global variable which I have done on line 6 with:

```tsx
import { getEnv } from "./utils/env.server.ts"

global.ENV = getEnv()
```

The `env.server.ts` file we have sets up TypeScript to auto-complete the `ENV` global variable.

👨‍💼 In this part of the exercise, we need to set the global `ENV` variable on the client. So when our code hydrates we have access to runtime environment variables using the same global variable in either environment (server or client).

Right now, all we need in our app is a `MODE` environment variable which is `development` or `production`.

Effectively, what we need is a script that does this:

```tsx
window.ENV = { MODE: "development" }
```

We can do this in and then we'll use that `ENV.MODE` variable in to dynamically load some devtools (found in ) when we're in development mode (`ENV.MODE === 'development'`).

#### Conclusion

👨‍💼 Super! Now we can dynamically load our dev tools during development and our end users don't need to load that chunk of code.

But really all we did this for was to show you how you can load JavaScript in a `<script>` tag and also dynamically load client-side JavaScript.

Now, let's get to some _really_ cool stuff with our client-side JS.

🦉 If you'd like a deeper dive on the evaluation order of modules in your web project, give this tip from Kent a watch:

### 1.5.4 Prefetching

👨‍💼 Now that we have client-side JavaScript, we can start doing cool things to improve the user experience. Thanks to the way Remix has us structure our code, Remix knows exactly the code and data needed for every route just by looking at the URL. So when we render a link like this:

```tsx
<a href="/users/kody/notes">Kody's Notes</a>
```

Remix knows the code and data needed to render that page just by looking at the URL. So when it appears that the user is going to click on that link, Remix can start loading the code and data for that page in the background. This is called **prefetching**. When the user clicks on the link, the page will be rendered instantly because the code and data is already loaded!

Checkout 📜 [the Link prefetch docs](https://remix.run/docs/en/main/components/link#prefetch) for more info on how to take advantage of this. We don't want to add this as a default to all links because that would probably be overkill, but we definitely want it on the links on the user profile page. Could you do that please?

Let's also add it to each of the note links in the list of notes.

To test it out, open up the network tab and/or the elements, and see what happens when you hover over the link you add these props to.

#### Conclusion

👨‍💼 Wow! Isn't that awesome!? Even if you arbitrarily slow down your network, you can make it feel like the page is loading instantly! Nice work!

### 1.5.5 Pending UI

👨‍💼 Some of our users have complained that the UI doesn't feel responsive because after they submit their profile form, it can take a while before there are any updates and they're not sure whether they did something wrong.

This is one of the things the browser did for us before we brought JavaScript along for the party. Once we brought JavaScript along, we started doing `event.preventDefault()` which removed the full-page refresh, but also removed the pending UI feedback the browser shows for us. We need to add that back.

Could you give them some feedback while they're waiting for the server to respond? We want to do this specifically for when the user submits the note edit form and hits the delete button.

Remix allows you to give the user an even better experience by showing "pending UI" using [the `useNavigation` hook](https://remix.run/docs/en/main/hooks/use-navigation). Only one transition can be happening at a time in the web (you can't go to two places at once) so that's true here as well. This means you'll need to use the information from the navigation to determine if the form is submitting or not.

Here's an example of `useNavigation` that should help you get a sense of the information you can get from the `navigation` object (📜 [also check out the `useFormAction` hook](https://remix.run/docs/en/main/hooks/use-form-action)).

🧝‍♂️ I've created a <StatusButton /> component that has a `status="pending"` prop you can use for this if you like. We'll also want to disable the button when the form is submitting.

#### Conclusion

👨‍💼 Thank you very much! This experience looks much better than before and user's now don't accidentally submit the form multiple times. Pending UI will give users more confidence in our application's ability to serve them well.

🧝‍♂️ By the way, I'm going to swap out your work for a handy hook we've got called `useIsSubmitting` in `app/utils/misc.tsx`. Thanks!

## 1.6 SEO

When it comes to finding things on the web, almost everyone does so using a search engine. There's a growing diversity of search engines, but still Google is the king 👑. Helping search engines like Google to properly categorize your content is called Search Engine Optimization (SEO). It's a very broad topic, and we're not going to cover the specifics of everything here. Our primary goal is to help you understand how to properly use metadata tags (like `meta` and `title`) to help search engines categorize your content.

Lots of what applies to search engines also applies to other tools and social media platforms as well. So it's a good idea to spend some time thinking about your website's sources of traffic and learning how to optimize your website's presentation on those platforms.

### The web

The `<title>` tag appears in the `<head>` and is typically what is displayed in the browser tab. It's also what is displayed in search engine results.

```html
<html>
    <head>
        <title>My Page</title>
    </head>
    <body>
        <!-- ... -->
    </body>
</html>
```

The `<meta>` tag is used to provide metadata about the page. It's typically used to provide information about the page to search engines. The `name` attribute is used to specify the type of metadata, and the `content` attribute is used to provide the actual metadata.

The `description` metadata is used to provide a short description of the page and is often used in search engine results as well as social media preview cards.

```html
<html>
    <head>
        <title>My Page</title>
        <meta name="description" content="This is my page" />
    </head>
    <body>
        <!-- ... -->
    </body>
</html>
```

Meta tags aren't only for search engines. They can also be used to provide configuration information to other tools. For example, the `viewport` metadata is used to configure the viewport of a mobile browser.

```html
<html>
    <head>
        <title>My Page</title>
        <meta name="description" content="This is my page" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
        />
    </head>
    <body>
        <!-- ... -->
    </body>
</html>
```

What this does is tell the browser to set the width of the viewport to the width of the device, and to set the initial zoom level to 1. This is a common configuration for mobile browsers.

A final example is the `charset` metadata. This is used to specify the character encoding of the page.

```html
<html>
    <head>
        <title>My Page</title>
        <meta name="description" content="This is my page" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
        />
        <meta charset="utf-8" />
    </head>
    <body>
        <!-- ... -->
    </body>
</html>
```

This is pretty much always how you'd want to configure charset, unless you're doing something funky with character encodings.

There are many other types of metadata that can be provided, but we'll leave that as an exercise for the reader (you can [learn more about meta tags on seosherpa.com](https://seosherpa.com/meta-tags/)).

### In Remix

Because you're responsible for everything between the `<html>` and `</html>` in your document, adding metadata tags is as simple as adding them to your JSX.

```tsx
export default function App() {
    return (
        <html>
            <head>
                <title>My Page</title>
                <meta name="description" content="This is my page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta charSet="utf-8" />
            </head>
            <body>{/* ... */}</body>
        </html>
    )
}
```

However, things can get tricky when we start thinking about nested routes and having that title and description be dynamic based on the current route. That's why Remix has a built-in API for routes defining the meta tags that should be used when the route is active through the route meta export. It's similar in some ways to the `links` export, but instead, when a route defines a `meta` export, the `meta` tags from ancestor routes are ignored and must be manually merged. This avoids conflicts between routes that might have the same `meta` tags. However, you do have access to the parent metas in the `meta` function so you can merge them yourself if you so desire.

```tsx
import { type MetaFunction } from "@remix-run/react"

export const meta: MetaFunction = () => {
    return [
        { title: "Sandwich Shop" },
        {
            name: "description",
            content: "Fill your tummy with something yummy",
        },
    ]
}
```

Again, in Remix you're responsible for everything on the page between `<html>` and `</html>` and that's no different here. You need to apply the `<Meta />` component in the `<head>` of your document in your `app/root.tsx` to ensure these meta tags are rendered. Much like the `<Links />` component.

With that example above, the `<head>` of your document would have this:

```html
<title>Sandwich Shop</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta
    name="description"
    content="Fill your tummy with something yummy"
/>
```

You can also access dynamic data (data from your loader) in the meta export so you can dynamically set the title, description, `og:image`, etc for your page.

```tsx
import { json } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { getSandwich } from "../sandwiches.server"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data.sandwich.name },
        { name: "description", content: data.sandwich.description },
    ]
}

export function loader({ params }) {
    return json({ sandwich: getSandwich(params.sandwichId) })
}
```

### 1.6.1 Static meta export

👨‍💼 Have you gotten a look at the browser tab for our app? It looks like nonsense! Let's at least add a nice title. Also, we should probably set a couple other configuration bits of metadata as well.

💰 Note, we're not going to use the Remix `<Meta />` component yet. We're just rendering things directly in the `<head>` for now.

Here's a syntax reminder if you need

```html
<title>My Page</title>
<meta name="description" content="This is my page" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta charset="utf-8" />
```

#### Conclusion

👨‍💼 Phew! That's much better! But there are some pages where we'd like to customize the title and description a bit. Let's look at that next.

### 1.6.2 Meta Overrides

👨‍💼 We want to be able to override the `title` and `description` for certain pages. Specifically, we want to have the following meta:

-   **Title**: Profile | Epic Notes
-   **Description**: Checkout this Profile on Epic Notes

To do this, we'll need to use Remix's conventional `meta` export for nested routes in combination with its `<Meta />` component.

As a reminder, here's what the API looks like:

```tsx
import type { MetaFunction } from "@remix-run/react"

export const meta: MetaFunction = () => {
    return [
        { title: "Sandwich Shop" },
        {
            name: "description",
            content: "Fill your tummy with something yummy",
        },
    ]
}
```

-   📜 `<Meta />`
-   📜 `meta` export

#### Conclusion

👨‍💼 Great! Now we can customize the meta tags on our routes! Let's do a bit more for our profile pages.

🦉 You'll notice that if you navigate to the `/users/kody` route, you'll see the `Profile | Epic Notes` in the title, which is expected. But if you navigate to a child path, like `/users/kody/notes`, you'll see only `Epic Notes` again. It may look like this is an unexpected behavior as we might be expecting the children paths to inherit the parent's meta overrides.

##### Use case: `/users/kody` and `/users/kody/notes`

Let's focus on `/users/kody` and `/users/kody/notes` URL paths case for a while: regardless they have a parent-child relationship in terms of their paths, they _do not_ have the same relationship in the REMIX's layout hierarchy. This is how our pages are organized in terms of files inside of the _routes_ directory:

```tsx
/users/kody 			<=> routes/users+/$username.tsx
/users/kody/notes       <=> routes/users+/$username_+/notes.tsx
```

That little underscore in the name of the folder `$username_+` means that the pages inside of it don't use the layout defined in the `routes/users+/$username`.tsx file (and consequently, they won't use the meta override defined over there). In other words: they aren't "layout-nested", even when they are "url-nested". In summary:

-   In terms of URL path: `/users/kody/notes` is a child of `/users/kody`
-   In terms of layout: `/users/kody/notes` is not a child of `/users/kody`

The page in `/users/kody/notes` will, in fact, use the meta override from the first route module hierarchically above `routes/users+/$username.tsx`, which is the override we defined in the `root.tsx`. You can always have a better view of the layout-nesting by running `npx remix routes` in a terminal at the root of a remix project. Doing that you should get something like this:

```tsx
<Routes>
    <Route file="root.tsx">
        <Route index file="routes/index.tsx" />
        <Route
            path="resources/healthcheck"
            file="routes/resources+/healthcheck.tsx"
        />
        <Route
            path="users/:username"
            file="routes/users+/$username.tsx"
        />
        <Route
            path="users/:username/notes"
            file="routes/users+/$username_+/notes.tsx"
        >
            <Route
                path=":noteId"
                file="routes/users+/$username_+/notes.$noteId.tsx"
            />
            <Route
                path=":noteId/edit"
                file="routes/users+/$username_+/notes.$noteId_.edit.tsx"
            />
            <Route
                index
                file="routes/users+/$username_+/notes.index.tsx"
            />
        </Route>
    </Route>
</Routes>
```

### 1.6.3 Dynamic meta export

👨‍💼 For our user profile page, we want our users to be excited to share their profile on social media and have their profiles show up nicely in search results. So their name should appear in the title and description, like so:

-   **Title**: Kody | Epic Notes
-   **Description**: Profile of Kody on Epic Notes

We also want their notes page to show how many notes they have. And the individual notes pages should show the note title in the title and the first part of the note in the description. You know. Stuff like that. Let's make these pages awesome. For now, let's just worry about the profile page getting dynamic data like the user's display name.

Here's an example of how you access data from a route in the meta export:

```tsx
// borrowed and modified from the remix docs
export async function loader({ params }: LoaderFunctionArgs) {
    return json({
        task: await getTask(params.projectId, params.taskId),
    })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data.task.name }]
}
```

-   📜 [`meta` export](https://remix.run/docs/en/main/route/meta-v2)

#### Conclusion

👨‍💼 Terrific! Now our users can show off how many notes they've got just by sharing their link on social media.

### 1.6.4 Parent Data

👨‍💼 Let's go deeper. When the user shares their notes page (like `/kody/notes`), it should show something like this:

-   **Title**: Kody's Notes | Epic Notes
-   **Description**: Checkout Kody's 11 notes on Epic Notes

For this, we'll need to add a meta export to the route.

And then let's say we've got a note like this:

```tsx
{
	"title": "Not bears",
	"content": "Although you may have heard people call them koala 'bears', these awesome animals aren’t bears at all – they are in fact marsupials. A group of mammals, most marsupials have pouches where their newborns develop."
}
```

When we're on that note's page, it should have:

-   **Title**: Not bears | Kody's Notes | Epic Notes
-   **Description**: Although you may have heard people call them koala "bears", these awesome animals aren’t bears at...

For this, we'll need to add a meta export to the route.

The challenge here is those routes don't load enough data for that. The index route doesn't load any data at all and the note route only loads the note, not the owner information.

We could definitely add more data in the loader, but even better would be to access the data that's already there. Here's how you do that:

```tsx
// borrowed and modified from the remix docs
import type { loader as projectDetailsLoader } from "./$pid"

export async function loader({ params }: LoaderFunctionArgs) {
    return json({ task: await getTask(params.tid) })
}

export const meta: MetaFunction<
    typeof loader,
    { "routes/project/$pid": typeof projectDetailsLoader }
> = ({ data, matches }) => {
    const project = matches.find(
        (match) => match.id === "routes/project/$pid"
    ).project
    const task = data.task
    return [{ title: `${project.name}: ${task.name}` }]
}
```

It may be helpful to you to add a `console.log(matches)` in the `meta` before changing much else so you get an idea of what that object looks like. It's especially helpful to find the ID of the route you're looking for.
Let's add some great meta exports for these routes and access our parent's data to do it.

-   📜 meta export
-   📜 useMatches hook - How you get that matches in components. We don't need it in this exercise but it may be interesting to you for further exploration.

#### Conclusion

👨‍💼 Great job. Now our pages have awesome metadata and we're able to reuse the data we're using on the page to create these meta tags.

## 1.7 Error Handling

#### The web

On the web, errors can happen in many ways. You can have errors from your JavaScript code running in the browser and errors that happen on the server when a request is made. The server errors are communicated through [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). From that article, we find the categories of HTTP status codes:

1. Informational responses (`100` – `199`)
2. Successful responses (`200` – `299`)
3. Redirection messages (`300` – `399`)
4. Client error responses (`400` – `499`)
5. Server error responses (`500` – `599`)

So, errors are communicated through HTTP status codes ranging from 400-599. These status codes are important because the browser and search engines behave differently based on the status code. So you do want to make sure you're following the specification for each one.

"Client error responses" could also be termed as "expected" errors where we (the server) know that the client did something wrong that we anticipated. For example, maybe they requested something that does not exist (404), they don't have access to (403), or they must first login to access (401).

"Server error responses" are errors that we did not anticipate. These are errors that we did not handle in our code. For example, maybe we tried to access a database that was not available (503), or it could be as simple as a runtime error where we tried to access a property on an object that does not exist.

It should be noted that you can intentionally throw errors that result in 500 range errors, but the point is that for those types of errors, there's nothing the user can do to avoid the error. Those errors are the server's responsibility.

You will sometimes run into error pages in your browser, but there's not a standard way to display errors in the browser. Applications need to handle these errors themselves.

When making an HTTP request with `fetch`, if the response comes back with an error status code (400-599), the promise is (correctly) not rejected. Even though there was an "error," the request was still successful. The response object will have an `ok` property you can use to check if the response was successful or not.

#### In Remix

Remix has a nice way to handle these kinds of errors and customize the UI for them. It's called "Error Boundaries" which is a borrowed concept from React, but has more capabilities (for example, it handles errors that occur during the server render).

Each route module can export a component called `ErrorBoundary` and that component can access the error it's handling via [the useRouteError() hook](https://remix.run/docs/en/main/hooks/use-route-error).

```tsx
import { useRouteError } from "@remix-run/react"

export function ErrorBoundary() {
    const error = useRouteError()
    console.error(error)

    return (
        <div>
            <h1>Oh no!</h1>
            <p>Something bad happened! Sorry!</p>
        </div>
    )
}
```

Thanks to the nested layout routing of Remix, this error boundary mechanism allows fairly fine-grained control over where errors appear in the UI and how they are displayed. It allows much of the application to still be functional if only a part of the nested layout is affected.

Additionally, if a route module does not export an `ErrorBoundary`, then Remix will find its nearest ancestor that does and render that one in place of that ancestor. We call this "error bubbling".

Remix also has a special ability for you to throw `Response` objects in your `loader`s and `action`s which allows you to specify a status code for the error that ends up being sent to the browser. We'll get to that later in the exercise.

### 1.7.1 Handle Route Errors

👨‍💼 If you open and uncomment one of the errors Kody 🐨 added for you, then try loading , you'll notice the error looks pretty bad. We definitely want to customize that!

Could you please add an `ErrorBoundary` component to so we can handle errors that happen there in our app?

Please make sure to log the error in the console with `console.error` so we can see what's going on in our debugging.

As a reminder, here's an example of what an error boundary looks like:

```tsx
import { useRouteError } from "@remix-run/react"

export function ErrorBoundary() {
    const error = useRouteError()
    console.error(error)

    return (
        <div>
            <h1>Oh no!</h1>
            <p>Something bad happened! Sorry!</p>
        </div>
    )
}
```

-   📜 [ErrorBoundary export](https://remix.run/docs/en/main/route/error-boundary-v2)
-   📜 [useRouteError() hook](https://remix.run/docs/en/main/hooks/use-route-error)

#### Conclusion

👨‍💼 Great job! Now we have a much better experience when errors occur.

And what's more, the Response we've been throwing is also handled by the ErrorBoundary as well! Try visiting a user that doesn't exist like `/users/not_kody`

But we can do a bit better for the UX of these kinds of errors...

### 1.7.2 Handle Thrown Responses

🦉 As mentioned earlier, Remix allows you to throw new Response from your loaders and actions so you can control the status code and other information sent in the response. For example:

```tsx
import {
    json,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    type MetaFunction,
} from "@remix-run/node"
import {
    invariantResponse,
    useIsSubmitting,
} from "#app/utils/misc.tsx"
import { getUser } from "#app/utils/auth.server"
import { getSandwich } from "#app/utils/sandwiches.server"

export async function loader({
    request,
    params,
}: LoaderFunctionArgs) {
    const user = await getUser(request)
    if (!user) {
        // this response will be handled by our error boundary
        throw new Response("Unauthorized", { status: 401 })
    }
    // this invariant with throw an error which our error boundary will handle as well
    invariantResponse(params.sandwichId, "sandwichId is required")

    const sandwich = await getSandwich(params.sandwichId)
    if (!sandwich) {
        // this response will be handled by our error boundary
        throw new Response("Not Found", { status: 404 })
    }
    return json({ sandwich })
}
```

We've got a handy `invariantResponse` which we use to throw responses for us more easily which works just the same way, but for the sake of clarity, most of these examples throw raw responses.
When you throw a `Response` from a loader or action, Remix will catch it and render your `ErrorBoundary` component instead of the regular route component. In that case, the error you get from `useRouteError` will be the response object that was thrown.

Because it's impossible to know what error was thrown, it can be difficult to display the correct error message to the user. Which is why Remix also exports a `isRouteErrorResponse` utility which checks whether the error is a Response. If it is, then you can access the `.status` property to know the status code and render the right message based on that. Your response can also have a body if you want the error message to be determined by the server.

Here's an example of handling a response error:

```tsx
export function ErrorBoundary() {
    const error = useRouteError()
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <p>Not Found</p>
        }
        if (error.status === 401) {
            return <p>Unauthorized</p>
        }
    }
    return <p>Something went wrong</p>
}
```

This mechanism of throwing responses is quite powerful because it allows us to build really nice abstractions. It's exactly what we're doing with the `invariantResponse` utility. As another example, if we didn't like having to do that `user` check everywhere, we could create an abstraction that does it for us:

```tsx
export async function requireUser(request: Request) {
    const user = await getUser(request)
    if (!user) {
        throw new Response("Unauthorized", { status: 401 })
    }
    return user
}
```

And now we know that if we get the user from `requireUser` they are in fact logged in! On top of that, you can throw more than just 400s, you could even throw a redirect!

```tsx
export async function requireUser(request: Request) {
    const user = await getUser(request)
    if (!user) {
        throw new Response(null, {
            status: 302,
            headers: { Location: "/login" },
        })
    }
    return user
}
```

Remix has a handy utility for redirects as well:

```tsx
import { redirect } from "@remix-run/node"

export async function requireUser(request: Request) {
    const user = await getUser(request)
    if (!user) {
        throw redirect("/login")
    }
    return user
}
```

This is a great way to make nice utilities that make the regular application code much easier to write and read:

```tsx
import {
    json,
    type ActionFunctionArgs,
    type LoaderFunctionArgs,
    type MetaFunction,
} from "@remix-run/node"
import {
    invariantResponse,
    useIsSubmitting,
} from "#app/utils/misc.tsx"
import { requireUser } from "#app/utils/auth.server"
import { requireSandwich } from "#app/utils/sandwiches.server"
import { getUser } from "#app/utils/auth.server"
import { getSandwich } from "#app/utils/sandwiches.server"

export async function loader({
    request,
    params,
}: LoaderFunctionArgs) {
    const user = await requireUser(request)
    const user = await getUser(request)
    if (!user) {
        // this response will be handled by our error boundary
        throw new Response("Unauthorized", { status: 401 })
    }
    // this invariant with throw an error which our error boundary will handle as well
    invariantResponse(params.sandwichId, "sandwichId is required")

    const sandwich = await requireSandwich(params.sandwichId)
    const sandwich = await getSandwich(params.sandwichId)
    if (!sandwich) {
        // this response will be handled by our error boundary
        throw new Response("Not Found", { status: 404 })
    }
    return json({ sandwich })
}
```

👨‍💼 Great, with all that knowledge, now I'd like you to upgrade our error boundary in to handle a 404. Once you're done, you should be able to go to and see a nice error message there.

#### Conclusion

👨‍💼 Thanks a lot! This is looking much better than before and our users are already much happier with this.

🧝‍♂️ I've been working on a handy abstraction for this, which you'll be able to use next!

💯 If you've got extra time, you can try and build a useful abstraction yourself before moving on to the next step. You can check your progress or simply check Kellie's solution.

### 1.7.3 Error Bubbling

👨‍💼 To keep things consistent, Kellie (🧝‍♂️) has made a handy abstraction for error boundaries. You can find it in `app/components/error-boundary.ts`. Here's how you use it:

```tsx
export function ErrorBoundary() {
    return (
        <GeneralErrorBoundary
            statusHandlers={{
                403: ({ params }) => (
                    <p>
                        You're not authorized to look at{" "}
                        {params.sandwichId}
                    </p>
                ),
            }}
        />
    )
}
```

#### Conclusion

👨‍💼 Great! Now we've got really nice consistency with our errors!

Also, thanks to nested routing, our errors for the notes are contextual!
Go ahead and add this to the loader in `app/routes/users+/$username_+/notes.$noteId.tsx`:

```tsx
if (Math.random() > 0.5) {
    throw new Error("Oh no!")
}
```

You'll notice that even though the note loader itself threw an error, the rest
of the app is completely functional. Very good UX!

But we just realized one major issue we need to deal with next..

### 1.7.4 Root ErrorBoundary

👨‍💼 We don't currently have an `ErrorBoundary` component for our root route. This is a problem for two reasons:

1. If we add more routes and they don't have an `ErrorBoundary`, those errors have nowhere to bubble up to.
2. If there's an error in our root route, we don't have a way to catch it.

So we need you to export an `ErrorBoundary` from the root route. But it's not quite that simple like the other routes... You'll see in a bit.

First, add a simple `ErrorBoundary` to the root route. Then uncomment one of Kody's errors in the component or the loader. You'll notice that when you refresh the page, none of the styles appear. If you look at the source of the HTML, you'll see something like this:

```html
<!DOCTYPE html>
<div
    class="container mx-auto flex h-full w-full items-center justify-center bg-destructive p-20 text-h2 text-destructive-foreground"
>
    <p>🐨 root loader error</p>
</div>
```

What happened to our... well... everything? Why is it just the contents of our error boundary?

Well, remember that our root component is responsible for rendering everything
between the `<html>` and `</html>`. So if there's an error rendering that, then
we won't have any of that stuff in our HTML. All we get is what's rendered in
the `ErrorBoundary`.

So we're going to need to make sure our error boundary renders the basic
"Document" stuff we need for our HTML document.

We'll do this by turning lots of what's in our `App` component into a `Document`
component that can be used by both the `App` and the `ErrorBoundary`.

So when you're all done, it should look something like this:

```tsx
export default function App() {
    return <Document>{/* app stuff */}</Document>
}

export function ErrorBoundary() {
    return <Document>{/* error stuff */}</Document>
}
```

#### Conclusion

👨‍💼 Great, now we have an error boundary that can serve as a backup if we forget to add an error boundary elsewhere in our app and we can also handle errors in the root of our app as well. This is a much better user experience!

💯 If you've got extra time, go ahead and add another route and throw an error
in it to make sure the error bubbling is working.

### 1.7.5 Not Found

👨‍💼 Right now if you go to a route that doesn't exist (like `/does/not/exist`),
our root route's error boundary will handle that. Unfortunately, this error
boundary is pretty limited because we can't rely on the root route's loader for
any data. This makes our 404 page pretty useless.

To be clear, we do have a 404 page for notes and users that aren't found. So
going to `/users/does-not-exist` works well. And also
`/users/kody/notes/does-not-exist` works well too. We just want to do the same
for routes that don't exist at all. Like `/does-not-exist` or
`/users/kody/does-not-exist`.

So we're going to use a router feature called a "splat route" to handle this.
A splat route effectively says "match any route that starts with this path". So
we can create a splat route at the end of our router that matches any route that
starts with `/` and because splat routes receive a lower priority than others,
we'll know if the splat route gets rendered it's because no other route matched
so we can show our 404 error.

It's important to note that splat routes aren't only useful for 404s, but they
can be really handy for use with a CMS where the URL segments are dynamic.

As we're following the `remix-flat-routes` convention, to create a route that
matches `/*`, 🐨 we'll create a file at `app/routes/$.tsx" />`.

With that file created, you need to 🐨 create a loader that throws a `404`
response:

```tsx
export async function loader() {
    throw new Response("Not found", { status: 404 })
}
```

Next, let's 🐨 export the `ErrorBoundary`:

```tsx
import { Link, useLocation } from "@remix-run/react"
import { GeneralErrorBoundary } from "~/components/error-boundary.tsx"

// ...

export function ErrorBoundary() {
    const location = useLocation()
    return (
        <GeneralErrorBoundary
            statusHandlers={{
                404: () => (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <h1>We can't find this page:</h1>
                            <pre className="text-body-lg whitespace-pre-wrap break-all">
                                {location.pathname}
                            </pre>
                        </div>
                        <Link
                            to="/"
                            className="text-body-md underline"
                        >
                            Back to home
                        </Link>
                    </div>
                ),
            }}
        />
    )
}
```

Finally, we'll want to 🐨 export a default export just in case the loader is
changed or fails in some way, we'll still be able to display some error to the
user:

```tsx
// ...

export default function NotFound() {
    // due to the loader, this component will never be rendered, but we'll return
    // the error boundary just in case.
    return <ErrorBoundary />
}

// ...
```

And with that, you should now be able to go to any route that doesn't exist and
you should still see the header and footer. This will make it a much better user
experience when folks hit a page that doesn't exist.

-   [📜 Remix Splat Routes](https://remix.run/docs/en/main/file-conventions/routes#splat-routes)
-   [📜 React Router splats](https://reactrouter.com/en/main/route/route#splats)
-   [📜 remix-flat-routes](https://github.com/kiliman/remix-flat-routes)

#### Conclusion

👨‍💼 Stellar work. We've handled errors like a champ!

# 2. 📝 Professional Web Forms

👨‍💼 Hello, my name is Peter the Product Manager. I'm here to help you get
oriented and to give you your assignments for the day. We're going to get a new
project for note taking off the ground. We want people to write Epic Notes 💪

Today, you're going to be working on the Epic Notes app adding key features
and fixing significant bugs in a brand new application. Just as if you had been
hired to work with us today. Throughout the workshop, you'll learn important
foundational skills of web app development including:

1. Validating user input and displaying error messages
2. Fixing Accessibility bugs
3. Using a schema to validate data
4. Uploading files to a server
5. Managing form submissions of complex data structure

It's a big job and there's lots to do, so, let's get started!

## 2.1 Form Validation

#### The web

HTML has built-in support for validation of form elements. Among others, here are some of the attributes you can give form elements to have the browser validate them for you:

-   `required` - the element must be filled in
-   `minlength` - the element must be at least this many characters
-   `maxlength` - the element must be at most this many characters
-   `min` - the element must be at least this value
-   `max` - the element must be at most this value
-   `pattern` - the element must match this regular expression

For example, here's a form with a required text field and a required email field:

```tsx
<form>
    <label for="name">Name</label>
    <input type="text" id="name" required />
    <label for="email">Email</label>
    <input type="email" id="email" required />
    <button type="submit">Submit</button>
</form>
```

The unfortunate truth here though is that you cannot rely on the browser to validate your forms for you. Users can easily bypass such validation by manually adding novalidate to the form tag or making the HTTP request directly using another tool. This is why it's important to validate your forms on the server. Client-side validation should be seen as a nice progressive enhancement for a better user experience, not a replacement for server-side validation.

As far as the server is concerned, there is no standard way to handle validation other than to respond with a `400` status code if there are validation errors. You typically want to respond with the error messages as well and then the client should display those error messages next to the form elements that failed validation.

There are important accessibility considerations when it comes to form validation, which we will address in the next exercise.

#### In Remix

Remix does not have any built-in support for form validation. However, it does have a nice way to get the error messages the server responds with using [the `useActionData()` hook](https://remix.run/docs/en/main/hooks/use-action-data).

### 2.1.1 Form Validation

👨‍💼 One cool thing about our users is we can trust them so we don't need to do validation...

😂 Just kidding. In fact, even if you do trust your users we should be doing validation. It's about a better user experience!

Here are the requirements:

-   `title` is required, maximum length of 100
-   `content` is required, maximum length of 10000

You can use native HTML form validation attributes on the `input` and `textarea` to accomplish this. `required`, and `maxlength` are the attributes you'll need.

📜 [Form Validation on MDN](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

#### Conclusion

👨‍💼 Super! Isn't it cool that the web platform has built-in validation for us? Did you try submitting something invalid? The browser won't let you! You can even hook into this validation via CSS to style things according to their "[validity state](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)" and JavaScript to completely customize the behavior as well. You can even create custom validators with [`setCustomValidity`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity).

### 2.1.2 Server Validation

👨‍💼 Sadly, browser only validation is not enough. Users can easily change the DOM using the browser devtools or even POST to our server directly. You _always_ must validate on the server side. And you'll also want to render the errors from the server.

The `action` can do some validation, whatever validation it likes (even `async` validation), and if there are errors it can send them back in a JSON response. You get what the `action` returns using a hook called `useActionData` which is very similar to `useLoaderData` with the exception that it will return `undefined` until the `action` has been called. Here's an example of that:

```tsx
import type { ActionFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useActionData } from "@remix-run/react"

type ActionErrors = {
    formErrors: Array<string>
    fieldErrors: {
        email: Array<string>
    }
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const email = formData.get("email")

    const errors: ActionErrors = {
        formErrors: [],
        fieldErrors: {
            email: [],
        },
    }
    if (email.length < 3 && !email.includes("@")) {
        errors.fieldErrors.email.push("Invalid email")
    }
    const hasErrors =
        errors.formErrors.length ||
        Object.values(errors.fieldErrors).some(
            (fieldErrors) => fieldErrors.length
        )
    if (hasErrors) {
        return json(
            {
                status: "error",
                errors,
                // 🦺 the as const is here to help with our TypeScript inference
            } as const,
            { status: 400 }
        )
    }

    // subscribe the user to the newsletter

    return redirect("/success")
}

export default function Subscribe() {
    const actionData = useActionData<typeof action>()

    const fieldErrors =
        actionData?.status === "error"
            ? actionData.errors.fieldErrors
            : null
    const formErrors =
        actionData?.status === "error"
            ? actionData.errors.formErrors
            : null

    return (
        <Form method="post">
            <label>
                Email <input required type="email" />
            </label>
            {fieldErrors?.email?.length ? (
                <ul>
                    {fieldErrors.email.map((e) => (
                        <li key={e}>{e}</li>
                    ))}
                </ul>
            ) : null}
            <button type="submit">Subscribe</button>
        </Form>
    )
}
```

The structure of the `action` response is up to you, but I recommend you use the structure I have laid out above as it handles multiple errors per field and form-wide errors with the `formErrors`.

Keep in mind that because `useActionData` returns the `action` data, it could be undefined until the form has been submitted.

To help you out a bit, you can even use this component if you'd like:

```tsx
function ErrorList({ errors }: { errors?: Array<string> | null }) {
    return errors?.length ? (
        <ul className="flex flex-col gap-1">
            {errors.map((error, i) => (
                <li
                    key={i}
                    className="text-foreground-destructive text-[10px]"
                >
                    {error}
                </li>
            ))}
        </ul>
    ) : null
}
```

This will make it easy to just render a list of errors, and you can give it a little space too like this:

<div className="min-h-[32px] px-4 pb-3 pt-1">
	<ErrorList errors={fieldErrors?.email} />
</div>

Doing things this way will reduce the amount of jumpiness in the UI when the errors load which is a nicer UX.

You could definitely put that `div` in the `ErrorList` component, but I prefer to limit the amount of spacing styles that are external to the component itself. Otherwise you'll find yourself needing to customize this in other places.
🐨 Please add some server-side validation to the `action` function and display any errors returned from that in the form.

To test out the server validation, you'll need to temporarily disable the form validation. Adding a `noValidate` attribute on the form allows you to submit it even if there are errors (such as an empty input field). Note that the other attributes will still be enforced by the browser, such as the `maxLength`. We'll improve this next.
Your emoji friends will guide you! Thanks!

-   📜 [`useActionData`](https://remix.run/docs/en/main/hooks/use-action-data)

#### Conclusion

👨‍💼 Wow! Awesome, thanks a lot for that. I feel much better knowing we've got some nice validation in place.

### 2.1.3 Disable Default Validation

👨‍💼 Now that we have nice looking error messages we manage ourselves, we want to disable the built-in browser errors because they go counter to our design aesthetic.

But we don't want to disable them completely, just once our JavaScript has loaded to enhance the user experience. Until that time, the browser's built-in client-side validation is ok. So, we'll use a little trick to disable them only after our React app has hydrated:

```tsx
function useHydrated() {
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => setHydrated(true), [])
    return hydrated
}
```

We effectively only need to assign the return value of that hook to the `noValidate` prop of our form and we're good to go.

#### Summary

👨‍💼 Super! Now we can rest assured that the built-in client validation will still apply until our JavaScript shows up to make things even better!

But... our JavaScript isn't making things much better on the client just yet... So let's handle that next!

## 2.2 Accessibility

I'm not going to beat around the bush. It's a lot of work to make a web application fully accessible to all users. However failure to do so can lead to an extremely poor user experience for a segment of your users that are already at a disadvantage. Additionally, you could find yourself in the middle of a lawsuit if you don't make your web application accessible. So this is an extremely important subject that deserves more of your attention than a single exercise in a web app fundamentals workshop.

#### The web

The web platform has been meticulously designed to maximize accessibility for a diverse range of users. This includes addressing the needs of those with visual, auditory, motor, and cognitive impairments. A multitude of features have been implemented, such as keyboard navigation, [screen reader](https://en.wikipedia.org/wiki/Screen_reader) compatibility, and voice command support.

Moreover, the platform offers extensive customization options, enabling users to tailor the appearance, text size, contrast, color, font, layout, and animation of a web page to their preferences.

Your job is to make it so the browser can employ these technologies to provide a great experience for all users. So while many accessibility concerns involve design and word choice, in your role as a web developer, a lot of your time will be spent ensuring your forms, links, and other interactive elements are properly labeled and structured.

One example of this is properly labeling your form elements so the browser knows which labels are associated to which form elements. This is important because screen readers will read out the label when the user focuses on the form element. If the label is not properly associated, you don't have any guarantees. There are a few ways to associate a label and a form element. A common way to do this is through the `for` and `id` attributes.

```html
<form>
    <label for="name">Name</label>
    <input id="name" type="text" />
</form>
```

In React, the `for` attribute is not allowed as a prop, so you use `htmlFor` instead.
The web platform has many good built-in features for accessible elements, however, in some cases, you will need to use props prefixed as `aria-`. ARIA is an acronym for "Accessible Rich Internet Applications". It is a set of attributes that define ways to make web content and web applications more accessible to people with disabilities. You can find [the ARIA specification on the w3.org website](https://www.w3.org/WAI/standards-guidelines/aria/).

It's often said that the first rule of ARIA is "don't use ARIA". This is because ARIA is a tool of last resort. It is meant to be used when the browser and HTML alone are not enough to make your web application accessible.

One common example of this is error messages. The web doesn't have a built-in mechanism for associating error messages to the fields they're reporting on, so you need to use ARIA to do this.

```html
<form>
    <label for="name">Name</label>
    <input
        id="name"
        type="text"
        aria-invalid="true"
        aria-describedby="name-error"
    />
    <div id="name-error">Name is required</div>
</form>
```

There is a disappointing gap in the support various screen readers have for ARIA and other accessibility features. This is why it's important to test your web application with a screen reader on various platforms. You can use the [NVDA screen reader](https://www.nvaccess.org/) on Windows, or the [VoiceOver screen reader](https://www.apple.com/voiceover/info/guide/) on Mac.

Another important aspect you'll have to work with a lot as a web dev is managing keyboard focus. For example, when the user navigates to a page, your application should automatically focus them to the first relevant focusable element on the page. Or, if the user submits a form and there are errors, your application should auto-focus to the first field with an error message.

One thing that can help a lot is using libraries that abstract away the complexities of accessibility for common components you need. In the Epic Stack for example, we're using a set of React components from [Radix UI](https://www.radix-ui.com/).

#### In Remix

Remix has some features that support you in making your application accessible. For example, Remix will automatically manage scrolling for you as the user navigates around your application, and if there's a situation where you don't want to restore scrolling, you have a lot of power to control this on a per-link or per-page basis. Learn more from this [Remix Single YouTube video about Scroll Restoration](https://www.youtube.com/watch?v=4_H8j3rkpjI).

Also, Remix's support for React enables you to use libraries (like Radix UI) which do a great job of making common components accessible.

Additionally, nested routes can help with maintaining keyboard focus in many instances. It is possible that in the future, Remix will add even better support for this.

Because we're dealing with both "reusable components" and "non-reusable" IDs, sometimes it can be handy to generate IDs. In React to do this in a way that is "safe" for a server render, you'll likely need to use [the `useId` hook](https://react.dev/reference/react/useId).

### 2.2.1 Field Labels

👨‍💼 We need to update the accessibility of our note edit form. The current implementation is not accessible because the `<label>` and the `<input />` are not associated with each other. So it should be something like this:

```html
<div>
    <label htmlFor="color">Favorite Color</label>
    <input id="color" type="text" />
</div>
```

You can test out whether your changes fixed the problem by clicking on the label text above the input. If the input is focused, then you've done it! If not, then there's still more work to do.

Another issue we've got is the "Reset" button doesn't work. This is because, due to styling requirements, our Reset button is outside of the `<form>` element. So we need to communicate to the browser that the Reset button is associated with the form. Similar to how you associate labels and inputs, we use IDs. We can do this by adding a form attribute to the button:

```html
<button form="form-id" type="reset">Reset</button>
```

We already do this with our submit button (otherwise it wouldn't work), so you can use that as a reference.

Please find Kody in and make sure the label and input have an association via the `id` and `htmlFor` props and the reset and submit buttons are properly associated to the form via the `id` and `form` props.

-   [📜 `for` attribute on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for)
-   [📜 `htmlFor` attribute in React](https://react.dev/reference/react-dom/components/common#common-props)
-   [📜 button `form` attributes on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attributes)

#### Conclusion

👨‍💼 Great! Now our labels and our inputs are associated. Screen readers everywhere rejoice!

We're still far from finished though! Let's handle error messages next.

### 2.2.2 Validation ARIA attributes

👨‍💼 Have you heard the first rule of ARIA? Don't use ARIA. If you can use native HTML, do it. If you can't, then use ARIA.

That's the case for our error messages. So, we need to add `aria-invalid="true"` and `aria-describedby="error-id"` to the input if there is an error. Otherwise, those attributes should not appear (so you'll set them to `undefined` in that case). So when the `title` looks good, it should render HTML like this:

```html
<div>
    <label class="..." for="note-title">Title</label>
    <input
        class="..."
        id="note-title"
        name="title"
        required=""
        maxlength="100"
        value="Basic Koala Facts"
    />
    <div class="..."></div>
</div>
```

And when the title has an error, it should render HTML like this:

```html
<div>
    <label class="..." for="note-title">Title</label>
    <input
        class="..."
        id="note-title"
        name="title"
        required=""
        maxlength="100"
        value="Basic Koala Facts"
        aria-invalid="true"
        aria-describedby="title-error"
    />
    <div class="...">
        <ul id="title-error" class="...">
            <li class="...">Title must be at least 1 character</li>
        </ul>
    </div>
</div>
```

Note that `aria-invalid` and `aria-describedby` are not present unless there is an error. To accomplish this, you can pass `undefined` as their values if there is no error, for example:

```html
<input aria-invalid={hasErrors || undefined}
aria-describedby={hasErrors ? 'id' : undefined} />
```

The emoji will give you some tips on creating variables to make this easier.

🦉 Another thing you may notice is in both cases we're rendering the `div` responsible for rendering the error messages. This is to ensure the UI doesn't bounce around when an error shows up.

And we do this for more than just the input, we'll want this for the <form> as well. Let's jump in!
Note that there is also `aria-errormessage`, however screen reader support is unfortunately very poor for that attribute. We just need to do the best we can. We don't currently have any form-level errors, but we're going to put this in place anyway for learning purposes. Eventually we'll have some errors like that.

#### Conclusion

👨‍💼 Super, now screen readers will be able to read out the error messages for specific fields and it knows which fields are invalid thanks to aria-invalid="true". But we still need to help the screen reader user (and non-screen reader users) navigate more efficiently to the field that has an error, so let's do that next.

Note: Including `aria-invalid="false"` is actually recommended over not including it at all. When `aria-invalid="false"` is explicitly provided, it ensures that the screen reader conveys to the user that the input is valid, which can help in reducing confusion and providing clear feedback. Some screen readers might interpret the absence of `aria-invalid` as an indication that the validity is unknown and may not provide any specific feedback regarding validation errors or validity status. Others might infer the validity based on other cues in the document, such as HTML5 validation attributes (required, pattern, etc.) or contextual clues, but this behavior isn't guaranteed across all screen readers. Screen readers are definitely at the level of consistency with one other that browsers were in the early 2000s 😱 so it's a challenge to keep up with all the nuances.

### 2.2.3 Focus Management

👨‍💼 A lot of what we do for accessibility in the web is manage the user's keyboard focus. It can be really annoying if I click a "submit" button, and then I have to find the field that caused the error I'm seeing. Wouldn't it be nice if the focus moved to the field that has an error?

And what if there are two fields with an error? I think it would be best to focus on the first one.

And what if the entire form has an error? Well, we should probably focus on the form itself and the screen reader will announce the user the issue with the form.

So that's what I'd like you to do next. This is the perfect use case for `useEffect`, but don't worry, the dependency list here is going to be quite simple.

The emoji will guide you through this one.

While we're at it, let's add `autoFocus` to the `title` field, so folks can start typing right away.

You can read the following:

-   📜 [Element: matches() method](https://mdn.io/element.matches)
-   📜 [Manipulating the DOM with a ref ](https://react.dev/reference/react/useRef#manipulating-the-dom-with-a-ref)
-   📜 [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)

#### Conclusion

👨‍💼 Great work! This is a much more pleasant form to work with. That code you wrote looks pretty nice and reusable.

💯 Hmmm... If you have some extra time, try to move the useEffect hook into a reusable useFocusInvalid hook. I should be able to use it like this:

```tsx
useFocusInvalid(formRef.current, hasErrors)
```

## 2.3 Schema Validation

It doesn't take long before you are really tired of writing code that looks like this:

```tsx
if (title === "") {
    errors.fieldErrors.title.push("Title is required")
}
if (title.length > titleMaxLength) {
    errors.fieldErrors.title.push(
        "Title must be at most 100 characters"
    )
}
if (content === "") {
    errors.fieldErrors.content.push("Content is required")
}
if (content.length > contentMaxLength) {
    errors.fieldErrors.content.push(
        "Content must be at most 10000 characters"
    )
}
```

I'm afraid to say it gets worse.

If you haven't felt the draw to write a utility to improve this yet, you will. For example, we could do something like this:

```tsx
function validate(value: string, max: number) {
    const errors = []
    if (value === "") {
        errors.push("Required")
    }
    if (value.length > max) {
        errors.push(`Must be at most ${max} characters`)
    }
    return errors
}

errors.fieldErrors.title.push(...validate(title, titleMaxLength))
errors.fieldErrors.content.push(
    ...validate(content, contentMaxLength)
)
```

Luckily, there are already libraries that do this for us so we don't have to trouble ourselves with writing our own validation. On top of this, they allow you to be much more declarative with your validation. The library we'll use looks like this:

```tsx
z.object({
    title: z.string().max(titleMaxLength),
    content: z.string().max(contentMaxLength),
})
```

This is how you create your schema. And then you use that to perform the validation (parsing):

```tsx
const result = schema.safeParse({ title, content })

if (result.success) {
    // we're good, check result.data
} else {
    // we're not good, check result.error
}
```

Schema validation is a great way to validate data due to its declarative nature.

#### Zod

The library we're going to use is [Zod](https://zod.dev/). Zod is a "TypeScript-first schema validation with static type inference" that allows you to define schemas for your data. A lot of the web ecosystem already uses it and it has great integrations with other libraries we'll want to use.

And because it has fantastic TypeScript support, it allows us to have a lot more confidence in our code as the types flow through our application. It's a great way to manage I/O boundaries to your application like reading from the filesystem, making HTTP requests, and interacting with databases.

Zod also allows for a great deal of customization and [refinement](https://zod.dev/?id=refine) in your validation and error messages. Here are some examples from [the Zod docs](https://zod.dev/):

```tsx
z.string().max(5, { message: "Must be 5 or fewer characters long" })

// even type inference based on the schema:
const A = z.string()
type A = z.infer<typeof A> // string

const name = z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
})

const user = z.object({
    username: z.string().optional(),
})

const nonEmptyStrings = z.array(z.string()).nonempty({
    message: "Can't be empty!",
})
```

Zod is extremely powerful. I recommend you have the documentation open during these exercises for reference.

#### Conform

One of the benefits to using a declarative interface for validation is that you can use that same schema to assist in the generation of that data–including for the forms users will fill out!

While you most definitely _can_ generate the entire form based on the schema if you want to (I've done this [before]()), we're going to keep our UI flexibility and just use the schema to give us type safe data to create the props for our forms.

You may not have thought about it, but often we duplicate our validation logic between our client and our server. We do it on the server because we have to and on the client because we want to give the user feedback as they're filling out the form (for a better UX).

With Zod, we can use the same schema to validate the data on the client and the server. But then, that's just the JavaScript portion. What about the HTML attributes?

If you have a schema like this:

```tsx
const FormSchema = z.object({
    email: z.string().email(),
})
```

Then you want the form to look like this:

```html
<form method="post">
    <label for="email-input">Email</label>
    <input id="email-input" type="email" required />
</form>
```

And when there's an error, we also want to have the right aria attributes:

```html
<form method="post">
    <label for="email-input">Email</label>
    <input
        id="email-input"
        type="email"
        aria-invalid="true"
        aria-describedby="email-errors"
        required
    />
    <ul id="email-errors">
        <li>Must be a valid email address</li>
    </ul>
</form>
```

Those attributes are very important (and very intentional). Without those attributes, the user doesn't get any client-side validation until the JavaScript finishes loading. Additionally, screen readers will reference these attributes in their assistance to the user. So these attributes are very important.

Luckily, we can use the schema to generate these attributes for us. We'll use a library called [conform](https://conform.guide/) to do this. Conform is "a progressive enhancement first form validation library for Remix and React Router."

Progressive Enhancement is the idea that your application starts with a baseline functionality, and then you layer on additional functionality as the user's device and browser support it. Practically speaking, this means that our form will work before the JavaScript finishes loading (or even if it never does), and then we use the JavaScript to enhance the experience with better pending UI and faster transitions.

Conform has an adapter for Zod schemas with utilities that are perfect for what we're looking for. Here's an example:

```tsx
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { Form } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { z } from "zod"

const LoginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Email is invalid"),
    password: z.string({ required_error: "Password is required" }),
})

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const submission = parse(formData, {
        schema: LoginSchema,
    })

    if (submission.intent !== "submit") {
        // the user hasn't submitted the form yet
        // this will happen if Conform is validating the form before submission
        // (like if we configure Conform to validate onBlur)
        return json({ status: "idle", submission } as const)
    }

    if (!submission.value) {
        // there's no value because there is an error in the form
        return json({ status: "error", submission } as const, {
            status: 400,
        })
    }

    const { email, password } = submission.value

    const isAuthenticated = await authenticate({ email, password })
    if (!isAuthenticated) {
        // set the form error:
        submission.error[""] = ["Invalid email or password"]
        return json(
            {
                status: "error",
                submission,
            } as const,
            {
                status: 401,
            }
        )
    }

    return redirect("/dashboard")
}

export default function LoginForm() {
    const actionData = useActionData<typeof action>()
    const [form, fields] = useForm({
        id: "login-form",
        constraint: getFieldsetConstraint(LoginSchema),
        lastSubmission: actionData?.submission,
        onValidate({ formData }) {
            return parse(formData, { schema: LoginSchema })
        },
    })

    return (
        <Form method="post" {...form.props}>
            <div>
                <label htmlFor={fields.email.id}>Email</label>
                <input {...conform.input(fields.email)} />
                <ErrorList
                    id={fields.email.errorId}
                    errors={fields.email.errors}
                />
            </div>
            <div>
                <label htmlFor={fields.password.id}>Password</label>
                <input
                    {...conform.input(fields.password, {
                        type: "password",
                    })}
                />
                <ErrorList
                    id={fields.password.errorId}
                    errors={fields.password.errors}
                />
            </div>
            <ErrorList id={form.errorId} errors={form.errors} />
            <button type="submit">Login</button>
        </Form>
    )
}

function ErrorList({
    id,
    errors,
}: {
    id?: string
    errors?: Array<string> | null
}) {
    if (!errors) return null
    errors = Array.isArray(errors) ? errors : [errors]

    return errors.length ? (
        <ul id={id} className="flex flex-col gap-1">
            {errors.map((error, i) => (
                <li
                    key={i}
                    className="text-foreground-destructive text-[10px]"
                >
                    {error}
                </li>
            ))}
        </ul>
    ) : null
}
```

There's quite a bit in there, but we'll look through all of it piece by piece in the exercise.
Conform v1 was released after these workshops were created and while they will eventually receive an update, the breaking changes are minimal and the concepts are the same. Until these workshops are updated, feel free to watch the video below to see the changes (maybe bookmark it as something to watch after you finish the exercises).

### 2.3.1 Zod schema validation

🧝‍♂️ BTW, I swapped your useEffect for a custom useFocusInvalid hook, just so you know.

👨‍💼 Let's make our validation better and more declarative. Prepare to delete a lot of code!

One important thing you'll want to know is how Zod manages errors. When you use `zodSchema.parse`, it will throw an error if the data is invalid. If you use `zodSchema.safeParse`, it will return an object with a `success` property that tells you whether the data is valid or not. If it's not valid, it will also have an `error` property that contains the error object. If it is valid, it will have a `data` property that contains the parsed data.

The [Error Handling](https://zod.dev/ERROR_HANDLING) docs can be quite helpful. You'll definitely want to use `.flatten` for this one:

```tsx
if (!result.success) {
    console.log(result.error.flatten())
}
/*
  {
    formErrors: [],
    fieldErrors: {
      name: ['Expected string, received null'],
      contactInfo: ['Invalid email']
    },
  }
*/
```

That shape may look a little familiar 😅

That should be enough to get you going.

-   [📜 Zod docs](https://zod.dev)
-   [📜 Zod Error Handling](https://zod.dev/ERROR_HANDLING)
-   [📜 Zod Flattening Errors](https://zod.dev/ERROR_HANDLING?id=flattening-errors)

#### Solution

👨‍💼 Zod is an incredibly powerful solution. Thanks to its error message customization, we'll be able to translate the error messages in the future as well.

It's definitely something you need to get used to over time, but the investment is worthwhile.

Unfortunately, it's not _quite_ optimized to handle parsing `formData` like we're doing. So let's improve that a bit with another utility for helping us with our forms.

### 2.3.2 Conform action utils

👨‍💼 Having to create an object out of `formData` is troublesome. We can actually call `Object.fromEntries(formData)` and that'll work for our simple case, but it's pretty limited and doesn't work for nested objects (which we'll get to later). So let's use Conform's utilities to update our `action` to parse our `formData` and parse it with Zod for us:

Here's the relevant part of the example from the background info we saw earlier:

```tsx
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { Form } from "@remix-run/react"
import { json, redirect } from "@remix-run/node"
import { z } from "zod"

const LoginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Email is invalid"),
    password: z.string({ required_error: "Password is required" }),
})

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const submission = parse(formData, {
        schema: LoginSchema,
    })

    if (submission.intent !== "submit") {
        // the user hasn't submitted the form yet
        // this will happen if Conform is validating the form before submission
        // (like if we configure Conform to validate onBlur)
        // We'll not add this yet, we'll get to it later.
        return json({ status: "idle", submission } as const)
    }

    if (!submission.value) {
        // there's no value because there is an error in the form
        return json({ status: "error", submission } as const, {
            status: 400,
        })
    }

    const { email, password } = submission.value

    const isAuthenticated = await authenticate({ email, password })
    if (!isAuthenticated) {
        // set the form error:
        submission.error[""] = ["Invalid email or password"]
        return json(
            {
                status: "error",
                submission,
            } as const,
            { status: 401 }
        )
    }

    return redirect("/dashboard")
}
```

Could you update our form to use this in the `action`? This will require a few changes in the UI as well because the errors are _slightly_ different and we'll be passing back a _submission_ object instead of just the _errors_.

🦉 I'd like you to check out what the `submission` object looks like in the network tab or log it to the console. Why do you suppose all that information is necessary?

-   [📜 `@conform-to/zod`](https://conform.guide)
-   [📜 Conform Validation](https://conform.guide/validation)

#### Conclusion

👨‍💼 Great! I'm already feeling safer.

🦉 Did you look at the submission object? Here's an example:

```tsx
{
	"status": "error",
	"submission": {
		"intent": "submit",
		"payload": {
			"title": "Basic Koala Facts",
			"content": ""
		},
		"error": {
			"content": "Required"
		}
	}
}
```

Why do you suppose it needs to include the `intent` and `payload`? Don't we already have that information? Yes, we do. But if we're thinking about progressive enhancement, then we need to consider the fact that when the user submits their form, they're sending some data to our server. Because there's no JS on the page to handle the submission, this will be a full-page reload. If there's an error, we want to render the same page again and we want to `render the error with the data they submitted`. The only way we can do this is if we include the data in our response.

It is possible we could optimize this a bit (`here's an idea`), but it's really cool that we don't have to worry about this. Before bringing in Conform, this didn't work at all. Now it works out of the box... Or at least it will once we implement the UI side of conform.

👨‍💼 Yeah! Let's get to that.

### 2.3.3 Conform form utils

👨‍💼 The backend is only one piece of this. Now we want to use Conform to help us build out the form in the UI. We'll use the `@conform-to/react` package for some utilities and also a utility from `@conform-to/zod` to convert our Zod schema into HTML validation attributes so we can delete those! Once we've done that, we no longer need to duplicate that validation logic in the UI! It's truly consistent between the UI and the server!

Here's the relevant bits from the example we had in our background info for this exercise:

```tsx
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { Form } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'

const LoginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email('Email is invalid'),
	password: z.string({ required_error: 'Password is required' }),
})

// ...

export default function LoginForm() {
	const actionData = useActionData<typeof action>()
	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getFieldsetConstraint(LoginSchema),
		lastSubmission: actionData?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: LoginSchema })
		},
	})

	return (
		<Form method="post" {...form.props}>
			<div>
				<label htmlFor={fields.email.id}>Email</label>
				<input {...conform.input(fields.email)} />
				<ErrorList id={fields.email.errorId} errors={fields.email.errors} />
			</div>
			<div>
				<label htmlFor={fields.password.id}>Password</label>
				<input {...conform.input(fields.password, { type: 'password' })}>
				<ErrorList
					id={fields.password.errorId}
					errors={fields.password.errors}
				/>
			</div>
			<ErrorList id={form.errorId} errors={form.errors} />
			<button type="submit">Login</button>
		</Form>
	)
}
```

Notice the lack of HTML validation, `name`, `id`, and `aria-` attributes! Oh, and the lack of `noValidate` on the form as well. All that stuff is handled for us by Conform and derived from our Zod schema. And it's all typesafe as well. If we change the schema, we'll get type errors in both our UI and our server code. And again, it's all progressively enhanced too.

The derived attributes are coming from the `getFieldsetConstraint` utility which reads our Zod schema and configures the `fields` to have the correct attributes. Then the `conform.input`, `conform.textarea`, etc. utilities read that config and apply the correct attributes.

The `lastSubmission` option is used to set the errors as well as the values of the fields.

And the `onValidate` bit will run our validation on the client. This is awesome because now the user doesn't need to bother submitting the form before they get feedback on their input! This has interesting implications for validation that requires database access. We'll get to that in a bit.

Conform truly is great 🏅

But we've still gotta implement it first! So let's get to it. Get ready to remove a lot of code!

Oh, one thing that's not in our example that we'll be using is the `defaultValue` option. Since we're editing a note, we want the initial values to be set to the current value in the note. For example:

```tsx
const [form, fields] = useForm({
    id: "login-form",
    constraint: getFieldsetConstraint(LoginSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
        return parse(formData, { schema: LoginSchema })
    },
    defaultValue: {
        email: user.email,
        password: "lol",
    },
})
```

-   [📜 Conform Remix Integration](https://conform.guide/integration/remix)
-   [📜 Conform Accessibility](https://conform.guide/accessibility)

👨‍💼 Stellar! We've not only drastically reduced the amount of code (and therefore potential for bugs caused by human error as well as maintenance burden), but we've also improved the user experience by making the form more progressively enhanced.

Give this a shot:

-   Disable JavaScript (using DevTools or go to and comment out the <Scripts /> element there).
-   Reload the form page.
-   Remove the contents of the "Title" field.
-   Now try to submit an invalid form.
-   Notice that the error shows up, and the title is still empty!

This should illustrate to you that we've successfully implemented progressive enhancement for this form. The user won't lose any work in the event the JavaScript fails to load. This is a very important aspect of accessibility. Huzzah!

Note, the "losing work" argument isn't very strong for this field because its validation is so simple, but if we had a more complex field with more complex rules then this would be a welcome feature of our app!

## 2.4 File Upload

A lot of the data users submit to us is fine in text form. But there are some things that aren't represented by text very well. For example, images, videos, documents, and audio files. For these, we need to use a different type of input. To that end, the [`file` input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) was introduced in HTML in version 4.01 in December 1999.

The `<input type="file" />` element is an essential part of the HTML specification that enables interaction with the file system on a user's device. This element creates a user interface that allows users to select one or multiple files from their system. These files can then be uploaded to a server or manipulated client-side using JavaScript. The files selected are represented in a `FileList` object, which is a simple list of `File` objects.

Here's a simple example of its usage:

```html
<form action="/upload" method="post" enctype="multipart/form-data">
    <label for="file-upload-input">Upload File</label>
    <input type="file" id="file-upload-input" name="file-upload" />
    <button type="submit">Upload File</button>
</form>
```

In this case, when a file is chosen, it will be included in the form data upon submission and then can be processed server-side. The `enctype` attribute is set to "multipart/form-data" to ensure the file data is sent correctly to the server (when it's unset, the encoding type is "application/x-www-form-urlencoded"). This means, if you already have some server code that's processing a form submission, you may have to update it to account for the new encoding type if you wish to start accepting files. This is because files are uploaded as binary data and not as plaintext.

For multiple file selection, you simply add the multiple attribute:

```html
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" id="file-upload" name="file-upload" multiple />
    <input type="submit" value="Upload File" />
</form>
```

Once a file or files have been selected, they can be accessed via JavaScript using the `files` property on the file input element, which returns a `FileList` object.

Each File object within the FileList contains properties such as `name`, `size`, `type`, which represents the MIME type, and `lastModified`. These files can then be read and manipulated using the `FileReader` API.

Keep in mind that due to privacy concerns, JavaScript in the browser doesn't have full access to read and write to the file system. The `<input type="file" />` element, along with the `File`, `FileList`, and `FileReader` APIs, provides a secure way of accessing the file system for the purposes of reading file data, uploading files, or manipulating files client-side.

You can also use the `accept` attribute to specify the types of files that can be uploaded. This is a comma-separated list of MIME types or file extensions. For example, to only allow images to be uploaded, you can use the following:

```html
<input
    type="file"
    id="file-upload"
    name="file-upload"
    accept="image/*"
/>
```

#### On the server

Let's say you're uploading a file that's 1GB in size. That's a lot of data to send over the wire. So, the browser will split the file into chunks and send them over the wire one at a time. This is called a [stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/ReadableStream). The server will then receive these chunks one at a time and then reassemble them into the original file.

Another challenge is the fact that while we can easily store `formData` in memory, storing a 1GB file in memory is not a good idea. Instead, we want to hot-potato that file out of memory to somewhere else. This is where you need to make a decision. Do you have a persistent file system you can write to (if you're using serverless, the answer is kinda, but not really). Would you prefer to send it off to a file host like S3? Or do you want to store it in a database?

Each of these has its own implications, but for all of them, you'll simply proxy the stream chunks from the client to the destination so you never have the entire file in memory at once.

But maybe your files aren't that big. If they're just a couple MBs, you can get away with storing those in memory for a short period of time. This is a fair bit simpler, but you do still need to deal with the stream of data to construct the file on the server.

#### In Remix

Remix provides a convenient way to handle file uploads. Remix strives to focus on the web platform, which is why so far we've just used the platform standard request.formData() API for parsing the form. Unfortunately, parsing file submissions is a little more involved. Luckily, it's just a little bit more involved thanks to the utilities provided by Remix.

These packages all have the `unstable_` prefix which means while the use case is important to Remix, the specifics of the API could change. These should be made official in the very near future and I don't personally expect any API changes at this point.

[`unstable_parseMultipartFormData`](https://remix.run/docs/en/main/utils/parse-multipart-form-data): This is the utility that allows you to turn the stream of data and turn it into a `FormData` object. This is the same object you get from `request.formData()`, but the bit that represents the file will depend on the "uploadHandler" you use.

[`unstable_createFileUploadHandler`](https://remix.run/docs/en/main/utils/unstable-create-file-upload-handler): This is a "uploadHandler" that you can use with `unstable_parseMultipartFormData` which will stream the file to disk and give you back a path to that file with some other meta data.

Here's how you could use the memory upload handler (copied from the Remix docs):

```jsx
import {
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node"
export const action = async ({ request }: ActionArgs) => {
    const uploadHandler = createMemoryUploadHandler({
        maxPartSize: 1024 * 1024 * 5, // 5 MB
    })
    const formData = await parseMultipartFormData(
        request,
        uploadHandler
    )

    const file = formData.get("avatar")

    // file is a "File" (https://mdn.io/File) polyfilled for node
    // ... etc
}
```

Custom upload handlers can be created as well. And you can combine these using the `unstable_composeUploadHandlers` utility which allows you to treat each file as its own upload and use a different upload handler for each file. Creating custom handlers is outside the scope of this workshop, but you can find examples in [the Remix examples](https://github.com/remix-run/examples) repo of [uploading to S3](https://github.com/remix-run/examples/blob/main/file-and-s3-upload/app/routes/s3-upload.tsx) and [cloudinary](https://github.com/remix-run/examples/blob/main/file-and-cloudinary-upload/app/routes/cloudinary-upload.tsx).

#### Conform

Conform has full support for validating file uploads, there are some caveats, but it's pretty straightforward. See the [Conform File Upload guide](https://conform.guide/file-upload) for details.

### 2.4.1 Multi-part form data

🧝‍♂️ I've made some adjustments you may want to know about. We now have a new resource route that's responsible for serving images: `app/routes/resources.images.$imageId.tsx`

So now any image can be displayed by its ID via: `/resources/images/:imageId`. So I updated to use this new route to display the images for notes. So that's all ready for us to start storing images for notes.

Another thing I did to help prepare for your work is I put together a fancy `ImageChooser` component you can use for the user to have a nicer UX for selecting an image than the default file input. It's a bit more involved than you have time for, but feel free to explore how that's implemented if you've got time. You will be making some changes to it during the workshop.

You'll find it at the bottom of `app/routes/users+/$username_+/notes.$noteId_.edit.tsx`. I also updated the loader to load the note's images if it already has images:

```jsx
export async function loader({ params }: LoaderFunctionArgs) {
    const note = db.note.findFirst({
        where: {
            id: {
                equals: params.noteId,
            },
        },
    })
    if (!note) {
        throw new Response("Note not found", { status: 404 })
    }
    return json({
        note: {
            title: note.title,
            content: note.content,
            images: note.images.map((i) => ({
                id: i.id,
                altText: i.altText,
            })),
        },
    })
}
```

So you can use that to preload the images for the note if it already has images when the user goes to edit the note.

As a reminder, you can check the Diff tab and select the previous solution step vs this problem step to see all the changes I made.

Alright, with that background, I think you're ready to make your adjustments! Good luck!

👨‍💼 Thanks Kellie! Alright, we need you to make adjustments so we can start uploading images to the notes page. We'll be making the minimal changes for this and we'll progressively improve it in the next steps. That means we'll be ignoring some of the TypeScript stuff (sorry Lily! 🦺😢).

At a high-level, here's what you'll be adjusting:

-   Update the `encType` of the form so we can accept file uploads
-   Update the type on our file upload input so it's a file input
-   Properly parse the request in our action so it can handle the file upload using Remix's memory upload handler
-   Render a hidden input for the existing image ID if it does exist so it's preserved if the user's just wanting to update the alt text.

Here's that example again of how to process the file in your action:

```jsx
import {
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node"
export const action = async ({ request }: ActionArgs) => {
    const uploadHandler = createMemoryUploadHandler({
        maxPartSize: 1024 * 1024 * 5, // 5 MB
    })
    const formData = await parseMultipartFormData(
        request,
        uploadHandler
    )

    const file = formData.get("avatar")

    // file is a "File" (https://mdn.io/File) polyfilled for node
    // ... etc
}
```

The emoji team (🐨💰🦺💣) will be in there to help guide you through this one. Enjoy!

-   [📜 `input[type=file]`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)
-   [📜 `File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
-   [📜 **`unstable_parseMultipartFormData`**](https://remix.run/docs/en/main/utils/parse-multipart-form-data)
-   [📜 **`unstable_createMemoryUploadHandler`**](https://remix.run/docs/en/main/utils/unstable-create-memory-upload-handler)

#### Conclusion

👨‍💼 Great work! To be honest, we're being a little hand-wavy on the bit around persisting the data. That's just out of scope for this workshop. It does highly depend on your application and where you choose to host your images. If you'd like to see how we're managing it in the app currently (not recommended for production), check `updateNote`.

We'll get to improving this in the future.

We're missing some nice validation and our types aren't great, let's fix that next.

### 2.4.2 File Validation

🦺 I'm not too pleased with the fact that we're just ignoring TypeScript. Remember:

TypeScript isn't making your life **worse**. It's just showing you how **bad your life already is.**
– [me](https://twitter.com/kentcdodds/status/1540025247134429185)

Currently, users could upload whatever they want to our server and we don't validate anything at all, so it could lead to pretty broken experiences.

We've already got Zod setup in this form, we just need to add support for the `imageId`, `file`, and `altText` fields.

To help you with the Zod schema, you may checkout [the Conform docs on File Uploads](https://conform.guide/file-upload). Here's a snippet from that example:

```tsx
const schema = z.object({
    profile: z.instanceof(File, { message: "Profile is required" }),
})
```

In our case, the file is optional since the user may just be updating an existing file. But we _do_ want to warn the user if they're going to try and upload a file that's too large, so for our `refine` call, we can just check that the `file.size` isn't too big.

Note: The `File` class is a browser API and not typically available in Node.js. However Remix polyfills this for us (check out{' '} where we use `installGlobals` from Remix).
We'll get to actually _displaying_ errors later on.

If you're trying to submit the form and nothing is happening, it could be an error that's preventing the form from submitting. But you'll not see the errors until we add those. Until then, you can comment out the `onValidate` function to prevent client-side validation and check out errors in the network tab.
With that, you should be good to go on this one!

-   [📜 Conform File Uploads](https://conform.guide/file-upload)
-   [📜 Zod `instanceof`](https://zod.dev/?id=instanceof)
-   [📜 Zod `refine`](https://zod.dev/?id=refine)

#### Conclusion

🦺 I'm just so relieved to have everything typed and validated.

👨‍💼 Great work!

As mentioned, we're not yet displaying errors because we've not wired up Conform form utilities to our form. We'll be changing the structure a bit in the next exercise so that's why we're not doing that as part of the exercise.

💯 If you've got some extra time, you can go ahead and wire the form fields up to conform so you can display the errors.

## 2.5 Complex Structures

How would you represent an array in an HTML form? Maybe you'd do something like this:

```html
<form>
    <input type="text" name="todo[]" value="Buy milk" />
    <input type="text" name="todo[]" value="Buy eggs" />
    <input type="text" name="todo[]" value="Wash dishes" />
</form>
```

While that's technically valid HTML, it's not very useful. If you inspected the formData, you'd get this:

```tsx
const formData = new FormData(form)
formData.get("todo") // null
formData.get("todo[]") // "Buy milk"
```

Not quite what you want. The `FormData` API is similar in some ways to the `Headers` API and the `URLSearchParams` API. They have entries that can have multiple values with the same name. So, if you wanted to represent those todos in a form, you could do something like this:

```html
<form>
    <input type="text" name="todo" value="Buy milk" />
    <input type="text" name="todo" value="Buy eggs" />
    <input type="text" name="todo" value="Wash dishes" />
</form>
```

```tsx
const formData = new FormData(form)
formData.getAll("todo") // ["Buy milk", "Buy eggs", "Wash dishes"]
```

```tsx
// this is just a visualization, form data is not an array of arrays.
const formData = [
    ["todo", "Buy milk"],
    ["todo", "Buy eggs"],
    ["todo", "Wash dishes"],
]
```

And the reason for this is because there's no way in HTML to represent an object or an array. Only key/value pairs.

Another problem we have with the `FormData` API is that forms cannot be nested.

So this is not allowed:

```html
<form>
    <form>
        <input type="text" name="todo" value="Buy milk" />
        <input type="checkbox" name="completed" checked />
    </form>
</form>
```

This is not allowed. This has unfortunate implications for how you might represent more complex data structures like an object, or array of objects. Let's say you want to add a "completed" property to each todo. You could do something like this:

```html
<form>
    <input type="text" name="todo" value="Buy milk" />
    <input type="checkbox" name="completed" checked />
    <input type="text" name="todo" value="Buy eggs" />
    <input type="checkbox" name="completed" />
    <input type="text" name="todo" value="Wash dishes" />
    <input type="checkbox" name="completed" checked />
</form>
```

If we visualize this as an array of key/value pairs, it would look like this:

```tsx
// this is just a visualization, form data is not an array of arrays.
const formData = [
    ["todo", "Buy milk"],
    ["completed", "on"],
    ["todo", "Buy eggs"],
    ["todo", "Wash dishes"],
    ["completed", "on"],
]
```

Whoops, didn't I tell you, in the FormData API, a checked checkbox is represented by the string "on" and an unchecked checkbox is represented by just not appearing in the form data at all 😱

So we can't really rely on the order of elements in the form data to convert this into anything useful. We need to use more specific names for each input:

```html
<form>
    <input type="text" name="todo[0].content" value="Buy milk" />
    <input type="checkbox" name="todo[0].complete" checked />
    <input type="text" name="todo[1].content" value="Buy eggs" />
    <input type="checkbox" name="todo[1].complete" />
    <input type="text" name="todo[2].content" value="Wash dishes" />
    <input type="checkbox" name="todo[2].complete" checked />
</form>
```

Then we can visualize this as an array of key/value pairs:

```tsx
// this is just a visualization, form data is not an array of arrays.
const formData = [
    ["todo[0].content", "Buy milk"],
    ["todo[0].complete", "on"],
    ["todo[1].content", "Buy eggs"],
    ["todo[2].content", "Wash dishes"],
    ["todo[2].complete", "on"],
]
```

Then, we can use some fancy JS to convert this into a more useful object:

```tsx
const data = {
    todos: [
        { content: "Buy milk", complete: true },
        { content: "Buy eggs", complete: false },
        { content: "Wash dishes", complete: true },
    ],
}
```

And that is something we can work with! 😩 Phew, what a pain.

#### Conform

Luckily for us, this is something Conform has already thought about and has great support for! With [nested objects and arrays](https://conform.guide/complex-structures).

##### Objects

To handle nested objects, you use what Conform refers to as a `fieldset` which actually maps nicely to the HTML `<fieldset>` semantic element.

Here's a quick example of this:

```tsx
// example inspired from the Conform docs
import { useForm, useFieldset, conform } from "@conform-to/react"

function Example() {
    const [form, fields] = useForm<Schema>({
        // ... config stuff including the schema
    })
    const addressFields = useFieldset(form.ref, fields.address)

    return (
        <form {...form.props}>
            <fieldset>
                <input {...conform.input(addressFields.street)} />
                <input {...conform.input(addressFields.zipcode)} />
                <input {...conform.input(addressFields.city)} />
                <input {...conform.input(addressFields.country)} />
            </fieldset>
        </form>
    )
}
```

For the `name` attribute, Conform would use `address.street`, etc. But this is all an implementation detail for you. Ultimately after parsing and everything, you'll wind up with an object:

```tsx
const data = {
    address: {
        street: "123 Main St",
        zipcode: "12345",
        city: "New York",
        country: "USA",
    },
}
```

#### Arrays

For arrays, you'll use Conform's `useFieldList` hook:

```tsx
// example inspired from the Conform docs
import { useForm, useFieldList, conform } from "@conform-to/react"

function Example() {
    const [form, fields] = useForm({
        // ... config stuff including the schema
    })
    const list = useFieldList(form.ref, fields.tasks)

    return (
        <form {...form.props}>
            <ul>
                {list.map((task) => (
                    <li key={task.key}>
                        {/* Set the name to `task[0]`, `tasks[1]` etc */}
                        <input {...conform.input(task)} />
                    </li>
                ))}
            </ul>
        </form>
    )
}
```

When that gets parsed, you'll wind up with an array:

```jsx
const data = {
    tasks: ["Buy milk", "Buy eggs", "Wash dishes"],
}
```

With arrays, it can be tricky because you often want to allow the user to add and remove elements of the array, so you need some extra logic to handle that. Luckily, Conform has utilities for exactly this with its [`intent` button](https://conform.guide/intent-button) utils:

```tsx
// example inspired from the Conform docs
import {
    useForm,
    useFieldList,
    conform,
    list,
} from "@conform-to/react"

export default function Todos() {
    const [form, fields] = useForm({
        // ... config stuff including the schema
    })
    const taskList = useFieldList(form.ref, fields.tasks)

    return (
        <form {...form.props}>
            <ul>
                {taskList.map((task, index) => (
                    <li key={task.key}>
                        <input {...conform.input(task)} />
                        <button
                            {...list.remove(tasks.name, { index })}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <div>
                <button {...list.insert(tasks.name)}>Add task</button>
            </div>
            <button>Save</button>
        </form>
    )
}
```

What's amazingly awesomely cool about this is that it actually works `without JavaScript`. That's just something to nerd out a bit on, but really what's nice about this is that it allows you to build forms that are used to generate complex data structures. Combine that with Zod schema validation and you've got yourself a really powerful form solution.

As a reminder from exercise 3, conform v1 was released after and this lesson is also impacted by breaking change updates. This workshop material still uses pre-1.0 conform. You can watch the video in exercise 3 for more details on what changed.

-   [📜 FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
-   [📜 Conform Nested Objects and Arrays](https://conform.guide/complex-structures)
-   [📜 Conform Intent Button](https://conform.guide/intent-button)

### 2.5.1 Nested Object

So far we've just put the image information as properties on our `NoteEditorSchema`, but the `id`, `file`, and `altText` fields are really all just part of a single object: An image. So it would be better to represent this as a nested set of field properties under the `NoteEditorSchema` under `image`.

However, because forms don't support nested objects, we'll need to use a utility from Conform to help us out. Here's an example that resembles what you'll be doing:

```tsx
// example inspired from the Conform docs
import {
    useForm,
    useFieldset,
    conform,
    type FieldConfig,
} from "@conform-to/react"

function Example() {
    const [form, fields] = useForm<Schema>({
        // ... config stuff including the schema
    })

    return (
        <form {...form.props}>
            <AddressFields config={fields.address} />
        </form>
    )
}

function AddressFields({ config }: { config: FieldConfig<Address> }) {
    const ref = useRef<HTMLFieldSetElement>(null)
    const fields = useFieldset(ref, config)
    return (
        <fieldset ref={ref}>
            <input {...conform.input(fields.street)} />
            <input {...conform.input(fields.zipcode)} />
            <input {...conform.input(fields.city)} />
            <input {...conform.input(fields.country)} />
        </fieldset>
    )
}
```

We'll also get our type by using Zod's inference utility:

```tsx
const RocketSchema = z.object({
    // ...
})
type RocketType = z.infer<typeof RocketSchema>

function RocketFields({
    config,
}: {
    config: FieldConfig<RocketType>
}) {
    // ...
}
```

So, fundamentally, we want to make this change:

```tsx
{
    title: string
    content: string
    imageId: string
    file: File
    altText: string
    image: {
        id: string
        file: File
        altText: string
    }
}
```

And we want that hooked up to our form. That should be enough to get you going!

-   [📜 `useFieldset`](https://conform.guide/api/react#usefieldset)
-   [📜 Conform Complex Structures](https://conform.guide/complex-structures)
-   [📜 Zod Type Inference](https://zod.dev/?id=type-inference)
-   [📜 React ref](https://react.dev/reference/react/useRef)

### Summary

👨‍💼 Great! Even though forms don't technically support nested objects (again, nested forms aren't allowed), Conform allows us to simulate that. This makes it much easier for us to maintain a sensible data structure for our forms.

But did you notice that our database allows notes to have more than a single image? Sure would be nice if we could add more than one image to a note, right? Let's do that next!

💯 Now that our form is wired up with conform, we can render the errors for these fields. Feel free to try that if you've got extra time (🧝‍♂️ Kellie will do it for you if you don't).

### 2.5.2 Field Lists

### 2.5.3 Add / Remove Items

## 2.6 Honeypot

Modern web applications are often bombarded with automated spam bots that try to submit forms with irrelevant or harmful content. There are a number of reasons they do this:

-   To post their links to your site, hoping to increase their search engine ranking
-   To test your site for vulnerabilities
-   To help distribute malware

This not only degrades the user experience but can also strain server resources and contaminate databases with unwanted data.

On my own site I found that spam bots were submitting my login and contact forms which resulted in sending emails to myself and random people which was really annoying and affected my deliverability. The nice thing is that it's pretty cost prohibitive for people to make sophisticated spam bots, so a few simple tricks can help you avoid most of the spam. To defend against these bots, you can use a common strategy known as a honeypot field.

A honeypot field is a form input that's designed to be invisible to genuine human users but enticing to bots. The concept behind it is simple: since bots will often fill out every available field in a form, we can trick them by adding a field that human users can't see (and therefore won't fill out). If any submissions contain data in that hidden field, it's a strong indicator that the submission is from a bot, allowing us to discard or flag the submission accordingly.

Another useful thing you can do along with the honeypot field is to add a field that will allow you to determine when the form was generated. So if the form is submitted too quickly, you can be pretty confident that it's a bot. This is more tricky than it sounds because bots could easily change the value of that field, so you do need to encrypt the value. But if you manage that, it's a great way to catch bots.

To implement a honeypot field, you'd typically add an input field to your form and then hide it using CSS. It's crucial that this field is hidden in a way that humans can't use, but a bot will. It's also a good idea to give the honeypot field a name that sounds enticing to bots, like "url" or "email", which can make it even more likely they'll fill it in. The trick is making sure the field doesn't conflict with any other fields in your form. So you can sometimes append \_\_confirm or something similar to the field to keep it unique and the bot will still fill it in.

For example:

```tsx
<form>
    <label>
        Name:
        <input type="text" name="name" />
    </label>
    <label>
        Email:
        <input type="email" name="email" />
    </label>
    <label>
        Website:
        <input type="text" name="url" />
    </label>
    <label>
        Message:
        <textarea name="message"></textarea>
    </label>
    <div style="display: none;">
        <label>
            Do not fill out this field
            <input type="text" name="name__confirm" />
        </label>
    </div>
    <button type="submit">Send</button>
</form>
```

When the form is submitted, you can then check the honeypot field on the server-side. If it has a value, it's a strong sign that the submission is automated and can be safely ignored or flagged.

Honeypot fields offer a non-intrusive and user-friendly approach to combating spam. Unlike CAPTCHAs, which can sometimes frustrate genuine users, honeypots operate silently in the background. However, it's worth noting that no solution is foolproof. As bots become more sophisticated, they might learn to avoid honeypots. Additionally, if you're targeted by a specific group then they'll be able to code their bot specific to your protections.

So the idea of a honeypot field is just to keep yourself out of the "low hanging fruit" category.

As an example, on my website, I have honeypot fields implemented on my public fields and I log out when honeypot fields are filled in. Here's some logs I saw just today (as I write this):

```tsx
FAILED HONEYPOT {
	formId: 'newsletter',
	firstName: '**********',
	email: '***********@gmail.com',
	convertKitTagId: '',
	convertKitFormId: '827139',
	url: 'Too MUCH'
}
POST kentcdodds.com/action/convert-kit 200 - 41.616 ms
FAILED HONEYPOT ON LOGIN {
	email: '***********@gmail.com',
	password: '***********'
}
POST kentcdodds.com/login 200 - 34.213 ms
```

I'm using `url` for the honeypot field of the first form and `password` as the honeypot field for the second form (my site's login is passwordless). I've saved myself actual money (and improved my email deliverability) because of this feature so it's definitely one you'll want to implement for all your publicly facing forms.

Remember, it's always a cat and mouse game between spammers and developers. As one side innovates, so does the other. Stay updated, and be ready to iterate on your solutions as the digital landscape evolves.

#### Remix Utils

This is why using a library that can be continuously updated is a great approach. [`remix-utils`](https://npm.im/remix-utils) has a great solution to this problem which we'll be using in this exercise.

```tsx
// create the honeypot instance:
const honeypot = new Honeypot()

// get the props for our fields:
const honeyProps = honeypot.getInputProps()

// pass those to the React provider
<HoneypotProvider {...honeyProps}>
	<App />
</HoneypotProvider>

// render the fields within our form
<HoneypotInputs />

// check the honeypot field on the server
honeypot.check(formData)
```

-   📜 [remix-utils Honeypot](https://github.com/sergiodxa/remix-utils#form-honeypot)

### 2.6.1 Basic Honeypot

👨‍💼 When users sign up for an account on our app, we send a confirmation email. If spam bots submit random people's email addresses in there, we'll get marked as spam and our deliverability will be poor (emails we send won't get to where they're supposed to go).

Kellie 🧝‍♂️ put together a new route which accepts the user's email address. We need you to add a honeypot field to the form so we can detect bots and not send emails if that field is filled out.

You just need to make sure that regular users don't accidentally fill the field out. It can be pretty basic, because many bots aren't very sophisticated. But we'll improve it later to deal with more sophisticated bots in the future.

The form only actually redirects to `/` for right now. If the honeypot field is filled in then the action should return a 400 error response (you can use `invariantResponse` for this if you like).

#### Conclusion

👨‍💼 Great job! Your honeypot is awesome, but Kellie 🧝‍♂️ just found a library that will do this for us, so we're going to use that library instead. Sorry about that 😅

### 2.6.2 Remix Utils

👨‍💼 We're going to use [`remix-utils`](https://npm.im/remix-utils) to put together the honeypot in the UI and check it in our `action`. This is going to require a bit of setup because it can do more than just handle the single field for us.

First you're going to need to create `app/utils/honeypot.server.ts` to create a honeypot instance. For example:

```tsx
import { Honeypot } from "remix-utils/honeypot/server"

export const honeypot = new Honeypot({
    validFromFieldName: "validFrom",
    encryptionSeed: process.env.HONEY_POT_ENCRYPTION_SEED,
    nameFieldName: "name",
    randomizeNameFieldName: true,
})
```

We don't need all those options just yet though. In fact, for this first bit, we just want to set `validFromFieldName` to `null` for now. We'll get to the rest of the options later.

Once you have that set up, you can use it in the `action` of `app/routes/_auth+/signup.tsx`. For example:

```tsx
try {
    honeypot.check(formData)
} catch (error) {
    if (error instanceof SpamError) {
        throw new Response("Form not submitted properly", {
            status: 400,
        })
    }
    throw error
}
```

The `SpamError` comes from `remix-utils/honeypot/server`.

And then for the UI, you can replace our custom `input` stuff with `<HoneypotInputs />` from `remix-utils/honeypot/react`.

Good luck!

#### Conclusion

👨‍💼 Great! That's better. It's nice to use a library for stuff like this because it means that as spam bots get more sophisticated, the library can be steadily improved and we can just update our code to use the new version.

🧝‍♂️ I'm going to update a bit to make the next thing you're going to do a bit easier. It's easier to just show you the diff than explain it. So you can check it out here.

### 2.6.3 Honeypot Provider

👨‍💼 If a user is able to submit the form within a second of the form being generated, they're probably not a human (or maybe they're just [Barry Allen](https://en.wikipedia.org/wiki/List_of_The_Flash_characters#Barry_Allen_/_Flash) ⚡). So as a part of our honeypot, we can have another hidden field that keeps track of when the form was generated. Then when the form is submitted, we just make sure it was submitted at least a second after it was generated.

There are a few problems with this we'll need to consider. For example, if we're running automated tests, then our user actually is a bot and that's okay 😅 So when we're running tests, we don't want to include the valid from field.

We'll know whether we're in a testing environment if `process.env.TESTING` is set. (That's set in ). If that's set, then just set the `validFromFieldName` to `null` and that will prevent remix-utils from including and checking for that field. Otherwise, you can set it to a string, or just use `undefined` to have the default value be used. If you'd like to test out your work, you can comment out the `process.env.TESTING = 'true'` line in the file and restart the server.

Another challenge will be is synchronizing our UI with our server config for the honeypot fields. So we need to update to handle this.

There are other issues, but let's just start with this.

#### Conclusion

👨‍💼 Great! Now we're probably going to catch even more bots! But we've got another problem we'll want to deal with next.

🧝‍♂️ Before you get to that though, I'm going to make a small change. We're going to apply this honeypot stuff to all our public forms, so to reduce repetition, I'm going to move some of the boilerplate from the action in to a utility called checkHoneypot in `app/utils/honeypot.server.ts`.

Feel free to check the diff or even do it yourself if you like.

### 2.6.4 Encryption Seed

👨‍💼 So, you may not have noticed this, but `remix-utils` doesn't actually put the real date the form was generated in the `validFrom` input of the form. It's just some random string of characters. Well, it's not really random, it's actually encrypted. The reason for this is because we don't want bots to be able to just change the date on the form and then submit it quickly. So `remix-utils` will encrypt the actual valid date and that's what the form is set to.

To be able to decrypt the value, we need an encryption key. `remix-utils` will generate one for us if we don't set one ourselves. Unfortunately, there's a problem with doing things this way. The key is generated at startup time, so if you restart your server, or you're running multiple instances of your app, a form could be generated with one key and validated with another.

So instead, we can set it to something consistent across all instances of our app. We can do this by setting the `encryptionSeed` option in our config. The tricky bit is we need this to be secret, so we're not going to just commit this to the repository. We need this to be kept secret. So we'll use environment variables.

So we're going to place it in our` .gitignore`d `.env` file which we're loading at startup time during development, and then you'll want to make sure to set this environment variable in your production environment as well ([for example](https://fly.io/docs/reference/secrets/)).

🐨 So first, you'll set the variable in `.env`, then go `app/utils/env.server.ts` to to validate at startup time that the variable is set (and get type safety on it as well).

🐨 Once you've got that, you can set the `encryptionSeed` in the honeypot config.

#### Conclusion

👨‍💼 Awesome! Now we're able to handle the massive network of bots randomly submitting forms all over the internet. Again, this won't really help with a targeted attack (we'll do more with that later). This definitely helps a lot with general abuse though, so great work!

## 2.7 Cross-Site Request Forgery

CSRF, which stands for Cross-Site Request Forgery, is a type of web security vulnerability where an attacker tricks a victim into performing actions they did not intend to on a web application where they're authenticated. Imagine being logged into your bank's website and another tab manipulates that authenticated session to transfer funds without your knowledge or consent. It could be as simple as:

```html
<form
    method="POST"
    action="https://example.com/my-great-bank/transfer-funds"
>
    <input type="hidden" name="amount" value="1000000" />
    <input type="hidden" name="to" value="123456789" />
    <button>Click here to win a free iPad!</button>
</form>
```

Here's what a rendered version may look like:

Click here to win a free iPad!
Whatever you do... **DO NOT CLICK THAT BUTTON** 👆

It looks just like a regular button right? But if you click it, you'll be transferring all your money to the attacker (or worse, Rick Astley).

That's a CSRF attack in action. The attack exploits the trust a site has in the user's browser and can have damaging effects.

To fundamentally side-step CSRF vulnerabilities, there are a few foundational principles:

1.  **Use Anti-CSRF Tokens**: These are unique tokens generated by the server and sent to the client during session establishment. Every subsequent request that modifies any data should carry this token. If a request doesn't have the token, it will be denied. Since the attacker's site won't know this unique and randomly generated token, they won't be able to make it through.
2.  **SameSite Cookies**: Modern browsers support the SameSite attribute for cookies. Setting it to `Strict` or `Lax` will ensure that the cookie isn't sent with cross-site requests, offering protection against CSRF.
3.  **Check the Origin Header**: Servers can check the Origin and Referer headers of incoming requests. If the request's origin isn't what the server expects, it can reject the request.
4.  **Always Logout**: Encourage users to log out of sessions when they're done, especially on public or shared computers. This reduces the window of opportunity for an attacker.

We'll get to the Cookies solution in a future workshop. But even with cookies in place, there are some requests that don't require cookies so it's a good general practice to apply CSRF protection to all requests that modify data.

Thanks to our honeypot implementation which requires a "valid from" field, we actually get a similar protection. However, honeypot fields are not intended to protect against CSRF and therefore the implementation could change in a way that no longer provides this protection. So it's best to implement both anti-CSRF tokens and honeypot fields.

#### Remix Utils

It actually takes a fair bit of work to generate the CSRF token and send it to the client. Luckily, we have a library that can handle this for us called [`remix-utils`](https://npm.im/remix-utils)! Remix utils includes a number of utilities to facilitate this process.

-   📜 [remix-utils CSRF](https://github.com/sergiodxa/remix-utils#csrf)

### 2.7.1 CSRF Setup

👨‍💼 We've got to get some things set up with the `remix-utils` CSRF utilities before we can actually start protecting our forms. We'll dive deeper into cookies in the [Web Auth](https://auth.epicweb.dev/) workshop later, but you do need to set a signed cookie in the user's browser so you can use [Remix's `createCookie`](https://remix.run/docs/en/main/utils/cookies#createcookie) to help with that.

```tsx
import { createCookie } from "@remix-run/node"

const cookie = createCookie("csrf", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    secrets: process.env.SESSION_SECRET.split(","),
})
```

🐨 Go ahead and stick that in `app/utils/csrf.server.ts`.

You'll notice we're using another environment variable. 🐨 You'll need to set
that up like we did with the `HONEYPOT_SECRET` earlier.

Feel free to [read the Remix docs](https://remix.run/docs/en/main/utils/cookies)
all about cookies if you want to learn more about these options, but we'll get
to this stuff in more depth in the Web Auth workshop.

🐨 Once you have the cookie object created, you can use that to create a CSRF
utility;

```tsx
import { CSRF } from "remix-utils/csrf/server"

// ...

export const csrf = new CSRF({ cookie })
```

Now, we need to get the user's unique token in our UI for our forms and in the
user's cookie so we can validate it on the server. We'll do that
in <InlineFile file="app/root.tsx" />. 🐨 See you there!

-   [📜 Remix `createCookie`](https://remix.run/docs/en/main/utils/cookies#createcookie)

#### Conclusion

👨‍💼 Great! You should now be able to get that cookie value set in the browser's "cookie jar." You can verify this by opening the browser's developer tools and looking at the cookies for the page under the "Application" tab. The cookie will be called "csrf" and have a value that looks like a bunch of nonsense like:

```
IjdDa3p6WkV1d3NNel&nev3r&60nna&gIv3&yoU&uP&UW0zYmxDMDNyRjQi.NM71601wmCvZ%2FZaGIG6wV%2FuX%2FvGafzDEAmamK1hNu88
```

And while you can't visually verify it, that (unsigned) token value is in the browser as well. You can check by executing this in the console (note that this will only work when viewing the app in a separate tab, else it will look for the token at the wrong port):

```tsx
__remixContext.state.loaderData.root.csrfToken
```

```
7Ck&Nev3r&60nna&1et&yoU&d0wn&UOfQm3blC03rF4
```

So the next step is to get that into our form and verify it to prove that the form was submitted using our app and not some other site. Let's go!

### 2.7.2 CSRF Verification

👨‍💼 First we're going to need to update our root component to include the CSRF token in context using the `remix-utils` `AuthenticityTokenProvider` component.

```tsx
import { AuthenticityTokenProvider } from "remix-utils/csrf/react"

// ...

return (
    <AuthenticityTokenProvider token={data.csrfToken}>
        <App />
    </AuthenticityTokenProvider>
)
```

From there, all our forms just need a `<AuthenticityTokenInput />` component from `remix-utils/csrf/react` in the UI, and then we can validate the csrf in our actions and we'll be in business:

```tsx
import { CSRFError } from "remix-utils/csrf/server" // <-- for the extra credit...
import { csrf } from "#app/utils/csrf.server.ts"

// ...

await csrf.validate(formData, request.headers)
```

#### Conclusion

👨‍💼 Awesome work! You can test this out by clearing your cookies before you submit the form. You should get a 403 error in that case. If you really want, you can try to run a CSRF attack on the playground and see if you can get it to work. Good luck!

In any case, I feel so much more secure now. Thank you!

🧝‍♂️ I'm going to make a `validateCSRF` utility out of that work you just did because we're going to want to do this all over the place for all our forms. Feel free to do this yourself if you want the practice. I'm also going to apply this to all the forms in the app too. As usual, you can do that yourself if you'd like the extra practice. But I don't mind doing it for you. Either way, you can check the diff. Cheers!

## 2.8 Rate Limiting

Imagine this: you've just released an amazing new feature on your web application, and you're excited for users to try it out. But then, suddenly, your server crashes due to a flood of requests. This could be a result of malicious intent, or just too many eager users. Either way, you're in trouble. This is where rate limiting comes in.

Rate limiting helps to control the flow of incoming requests, ensuring that our server isn't overwhelmed. It does this by limiting the number of requests a user can make in a specific window of time. In the context of a web application, especially one that uses forms, rate limiting can be crucial.

Of course we want all genuine users to be able to use our application which is why you should be cognizant of your scaling needs, but no real user in the world needs to submit your signup form more than 10 times in a minute.

Now, why might we have different rate limits for `GET` vs `POST` requests?

`GET` requests are typically **read** operations. These requests might be someone viewing a user's profile or reading a blog post. While it's important to rate limit these, they often are less resource-intensive than `POST` requests. And genuine users typically make many more of these types of requests than `POST` requests.

`POST` requests are write operations. They might involve signing up for an account, posting a comment, or submitting some form data. These requests often require more from our server - data validation, database writes, sending emails, etc. Additionally, a user trying to guess a password might make many `POST` requests in a short period of time.

Let's look at a scenario: the `/signup` endpoint. Signing up typically involves various operations like hashing passwords, database writes, and possibly sending a welcome email. It's unlikely a user will need to do this many times a minute. So, we'd use an even stricter rate limit on `POST` requests to `/signup`.

We're using express for our server and there's a great tool called `express-rate-limit` that makes it easy to add support for rate limiting to our application:

```tsx
import rateLimit from "express-rate-limit"

// When we're testing, we don't want rate limiting to get in our way. So, we'll
// increase our rate limit thresholds.
const limitMultiple = process.env.TESTING ? 10_000 : 1

const rateLimitDefault = {
    windowMs: 60 * 1000, // 1 minute
    limit: 1000 * limitMultiple, // Adjust the limit based on our environment
    standardHeaders: true, // Send standard headers with limit information
    legacyHeaders: false, // Don't bother sending legacy headers
}

// The most strict rate limit, great for routes like /signup
const strongestRateLimit = rateLimit({
    ...rateLimitDefault,
    limit: 10 * limitMultiple,
})

// A stricter rate limit for general POST requests
const strongRateLimit = rateLimit({
    ...rateLimitDefault,
    limit: 100 * limitMultiple,
})

// A general rate limit for our application
const generalRateLimit = rateLimit(rateLimitDefault)

app.use((req, res, next) => {
    const strongPaths = ["/signup"]
    if (req.method !== "GET" && req.method !== "HEAD") {
        if (strongPaths.some((p) => req.path.includes(p))) {
            return strongestRateLimit(req, res, next)
        }
        return strongRateLimit(req, res, next)
    }

    return generalRateLimit(req, res, next)
})
```

Lastly, as you can see, we're taking into account our environment when configuring our rate limits. In our tests (which may execute very fast), we'd effectively disable rate limiting by boosting our limit thresholds. This ensures our tests don't fail simply because they're making requests too quickly.

### 2.8.1 Basic Rate Limiting

👨‍💼 Let's get started with some basic rate limiting using express-rate-limit. Here's a quick primer on its API:

```tsx
import { rateLimit } from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Use standard draft-6 headers of `RateLimit-Policy` `RateLimit-Limit`, and `RateLimit-Remaining`
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
```

For our app, we're ok not using an external store to manage the rate limiting, but that's something you may consider looking into depending on your scale.

So let's open up and get some basic middleware for this set up.

Oh, and you're going to want to think about our testing environment... We want to keep the middleware in play, but we just want to increase the limits to account for the fact that a robot is actually submitting things faster than humans will be expected to 😅

-   📜 [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit)

#### Conclusion

The `max` property was renamed to `limit` in express-rate-limit. Your exercise code has been updated, but you'll notice the video still uses `max`. 👨‍💼 That's a great start! Let's keep going.

### 2.8.2 Tuned Rate Limiting

👨‍💼 As a general rule, our rate limiter is ok, but for higher impact pages and forms, we probably want to tighten things up a bit. For example, it wouldn't make sense for a user to submit our `/signup` for a thousand times in a minute. Maybe more like 10 times in a minute max (maybe they're just _really_ bad at entering their proper email address).

But then for some other forms it may be ok to submit 100 times in a minute (maybe they've got a _lot_ of notes they want to delete in a row). So we're going to have three tiers. General, strong, and strongest.

So let's give that a whirl.

#### Conclusion

The `max` property was renamed to `limit` in express-rate-limit. Your exercise code has been updated, but you'll notice the video still uses `max`.

👨‍💼 Great job! Now we're pretty well protected against brute force attacks on our app. We can further tune this rate limiting as needed in the future.

Well done 👏👏

# 3. 💾 Data Modeling Deep Dive

👨‍💼 Hello, my name is Peter the Product Manager. I'm here to help you get oriented and to give you your assignments for the day. We're going to have you working on the data for the Epic Notes app today.

So far our data has just lived in memory but we're finally ready to start persisting things to a database. We've decided to use SQLite for our database and Prisma as our ORM. You're going to need to get that all set up. Just as if you had been hired to work with us today. Throughout the workshop, you'll learn important foundational skills of full stack development like:

1. Creating a Database Schema
2. Managing Data Relationships
3. Managing Data Migrations
4. Seeding Data
5. Generating Seed Data
6. Querying Data
7. Updating Data
8. Writing Raw SQL
9. Optimizing your models for query performance

It's a big job and there's lots to do, so, let's get started!

You'll be running a lot of terminal commands in this workshop. These terminal commands need to be run from the `playground` directory of the project. Any exceptions will be noted

#### 🦉 Prisma Tips:

-   If your development database ever gets in a bad state, you can always delete the database file itself and prisma will recreate it for you next time you run something. (Note that you'll lose all your data if you do this, but we're working with fake data anyway so it's fine... Just don't do this with your production database 😅).
-   Install [the VSCode extension for Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) for syntax highlighting, formatting, and linting of your Prisma Schema

Over time, some things may change in the workshop material from the videos you watch. You can learn about these changes in the `CHANGELOG.md` file of the repo.

## 3.1 Database Schema

### 3.1.1 prisma init

👨‍💼 Let's initialize our application with a database and prisma schema. We don't have an existing database to pull from, so we'll create a new one using the Prisma CLI.

🐨 In the playground directory, run the following command:

```sh
npx prisma init --url file:./data.db
```

By using the --url flag, we're telling Prisma to create a SQLite database called data.db in the prisma directory.

Once you've done that, you should have two new files:

1. Environment variable for the `DATABASE_URL`
2. Prisma schema

The `.env` file is auto-loaded by Prisma to find your database connection string. The `prisma/schema.prisma` file is where you'll define your database schema and is already loaded with a little bit of information:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

This just has a few bits of configuration in it for now. If you'd like to dive into what these different bits mean, check out the [Prisma Schema docs](https://pris.ly/d/prisma-schema).

🐨 Add user to the schema. We have the following fields:

-   `id` should be a string, serve as the unique identifier for each record in the `User` model, and its default value should be generated by the `cuid` function ensuring uniqueness and collision resistance (`@default(cuid())`).
-   `email` needs to be a string and should be unique to prevent users from creating multiple accounts with the same email address.
-   `username` should be a string and needs to be unique to ensure every user has a distinct username.
-   `name` is a string that represents the name of the user. It is an optional field as indicated by the question mark (?), so it can be null.
-   `createdAt` is a `DateTime` field that defaults to the current timestamp (`@default(now())`) when a new user record is created.
-   `updatedAt` is a `DateTime` field that updates to the current timestamp whenever there is any update to a specific user record. This is handled automatically by Prisma with the `@updatedAt` attribute.

Check [the Prisma Schema](https://pris.ly/d/prisma-schema) docs for examples of the schema syntax.

💰 Note, if you get stuck on the syntax, remember you can check the Diff Tab to check your work against the solution.

Great, now that we've got that, let's push that schema to our database:

```sh
npx prisma db push
```

You should get output that says something like:

```sh
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "data.db" at "file:./data.db"

SQLite database data.db created at file:./data.db

🚀  Your database is now in sync with your Prisma schema. Done in 9ms

✔ Generated Prisma Client (5.0.0 | library) to ./node_modules/@prisma/client in 36ms
```

With that, let's open up Prisma Studio to see what we've got:

```sh
npx prisma studio
```

You should have the User model with the fields we defined in the schema. You should also be able to create new users and see them in the database. Go ahead and create a new user. You can use the following values:

-   `email`: `kody@kcd.dev`
-   `username`: `kody`
-   `name`: `Kody`

Save that and you should have a new user in the database! Great job! You've initialized your SQLite database with Prisma.

-   📜 [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

#### Conclusion

👨‍💼 Great job making the schema. We're a little ways away from actually being able to use this in our application since we've got more models we need to create, but this is a good start.

🦉 If you would like to check out the SQL that's generated by the prisma schema and you don't want to wait until we get to the `npx prisma migrate` exercise, you can ask SQLite to output a SQL file that represents the contents of the database (including tables).

First, you will need to [download and install the `sqlite3` CLI](https://www.sqlite.org/download.html).

I personally use [Homebrew](https://brew.sh/) for doing this on macOS. If you're on Windows, please make a suggestion here for how to do this! For Linux users: `sh nonumber sudo apt update sudo apt install sqlite3 sqlite3 -version `
Once you have that installed, then you can run `sqlite3` from the command line:

```sh
sqlite3 prisma/data.db .dump > data.sql
```

Then you can check data.sql and it should show you something like this:

```sql
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO User VALUES('clklmcxa50000x7drb1zc5bbu','kody@kcd.dev','kody','Kody',1690490436990,1690490427769);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
COMMIT;
```

Cool, huh? You can do that at any time if you're interested to check out how you could represent the current state of the database as SQL commands.

## 3.2 Data Relationships

Models in a database often have relationships, like objects in our code or even things in real life. There are a few types of relationships. We'll talk about three of the most common:

#### One-to-one

A person has one social security number, a social security number belongs to one person. Here's an example of how that could be represented in prisma.

```prisma
model Person {
  id             String          @unique @default(cuid())
  name           String
  socialSecurity SocialSecurity?
}

model SocialSecurity {
  id       String  @unique @default(cuid())
  number   String
  person   Person @relation(fields: [personId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  personId String @unique
}
```

You'll notice the `@relation` attribute on the `SocialSecurity` model. This configures the relationship between the two models with [referential actions](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions).

The `fields` argument specifies which fields in the model are used to refer to the other model. The `references` argument specifies which fields in the other model are used to refer to this model. The `personId` field is used to refer to the Person model and is called a _foreign key_.

The `onDelete` and `onUpdate` arguments specify what happens when the referenced model is deleted or updated. In this case, we're saying that if a `Person` is deleted or updated, the SocialSecurity should be deleted or updated as well.

### 3.2.1 One-to-Many Relationships

A person has many phone numbers, a phone number belongs to one person. For example:

```prisma
model Person {
  id           String        @unique @default(cuid())
  name         String
  phoneNumbers PhoneNumber[]
}

model PhoneNumber {
  id       String @unique @default(cuid())
  number   String
  person   Person @relation(fields: [personId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  personId String
}
```

In this case, the biggest difference is that the `personId` field is not declared as `@unique`. This is because a person can have many phone numbers, so the same personId can appear multiple times in the `PhoneNumber` model. And on the Person model, the `phoneNumbers` field is declared as an array of `PhoneNumber` models, because a person can have many phone numbers.

### 3.2.3 Many-to-Many Relationships

A blog post has many tags, a tag has many blog posts. For example:

```prisma
model Post {
  id    String @id @default(cuid())
  title String
  tags  Tag[]
}

model Tag {
  id    String @id @default(cuid())
  name  String
  posts Post[]
}
```

You may have noticed something interesting about this relationship configuration... There's no `@relationship` configuration! There's no `postId` or `tagId` on these models to relate them to each other. This is due to a limitation in relational models. You cannot represent a many-to-many relationship between two database tables.

Instead, you have a third table that stores the relationship. Luckily for us, Prisma makes this table for us automatically!

Check out what prisma does with these models:

```sql
-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");
```

It even handles cascading updates/deletes and creates indexes for us 💪

We're going to get to many-to-many relationships in the authentication workshop, here's a visualization of what our user/role/permission relationships will look like:

![visualization of the user, role, permission relationships which are all many-to-many](https://camo.githubusercontent.com/a4808b55757c662c55727229e626bef39a95ca8599314da8a609324d0a3c7f3c/68747470733a2f2f6769746875622d70726f64756374696f6e2d757365722d61737365742d3632313064662e73332e616d617a6f6e6177732e636f6d2f313530303638342f3236393035393631302d62376635303864312d666136392d346134332d616630302d6664643135653431636266662e706e67)

#### Visualizing relationships

Sometimes it can be helpful to represent these relationships visually. Especially for very complex relationships. This is often done using an _entity relationship diagram_ or ERD. [Learn more about ERDs](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model).

You can even use the [prisma-erd-generator](https://github.com/keonik/prisma-erd-generator) to generate an ERD from your prisma schema. For example:

[An ERD showing relationships for the Epic Notes app.](https://camo.githubusercontent.com/b15ca7d7fdd472bfc9dd7cf04522d53ae8f82125af8c18622863d7c9de17d805/68747470733a2f2f6769746875622d70726f64756374696f6e2d757365722d61737365742d3632313064662e73332e616d617a6f6e6177732e636f6d2f313530303638342f3235353239373535382d38633462393931612d616361302d343464632d396662392d3861643461626539653236372e737667)

-   [📜 Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### 3.2.1 One-to-Many Relationships

👨‍💼 We need to add the `Notes` model to our schema. This is a one-to-many relationship. A `User` can have many `Notes`, but a `Note` can only have one User (who we call an "owner").

Please add the `Notes` model `prisma/schema.prisma`.

The emoji will be in there to help guide you through this.

💰 Note, if you get stuck on the syntax, remember you can check the Diff Tab to check your work against the solution.

If you've installed the Prisma VSCode extension, it will automatically format your schema which is great. It also even completes some of the relationship syntax for you which is also great. However, it will also automatically capitalize the property names it adds which is annoying. Just double check the User model to make sure the property is lowercase `notes` and not `Notes`.
Great, with your schema ready to go, you can now push your updated schema to the database:

```sh
npx prisma db push
```

And then you can open Prisma Studio and you'll find your new `Notes` model:

```sh
npx prisma studio
```

Try to manually create a new note and associate it with a user.

Beware of the extension auto-updating to capital letters in model.

Try to manually create a new note and associate it with a user.

Beware of the extension auto-updating to capital letters in model.

#### Conclusion

👨‍💼 Great work! Now we've got the most important parts of our application's data model worked out. But we've still got another relationship to deal with, so let's get to that next.

### 3.2.2 One-to-One Relationships

👨‍💼 We still need to deal with the Note images. And we're also going to add images to the users as well. Before we do, Olivia the Owl would like to have a word with you about data modeling...

🦉 One thing you want to think about when you're building out your data model is... the future.

**CAUTION**: The future is impossible to predict. All you really can reasonably predict about the future is that things will change. But you don't know how. That said, it can be useful to build things in such a way that optimizes for change provided it doesn't make things sub-optimal for the present.
Consider, for example, that you are building a house. You're considering what to do about the pool you want one day. You know you don't want it now, but you may want to add one in the future. With that in mind, you may think about where the pool should go, and you decide to avoid planting trees there. Depending on how confident you are that you will get the pool you may even consider placing the plumbing for the pool in the ground before you pour the foundation so you don't have to pay the cost of digging things up later. You just need to weigh the costs of doing that now vs. the cost of doing it later and the likelihood you'll actually get the pool.

For our notes to have images, we just need a place to store the bytes for the image, its content type, and the alt text. It's not much data. But if you think about a note taking app, it's reasonable to assume folks will want to upload more than just images to their notes. Maybe they'll want to upload a `csv` or a `pdf` or any number of other types of files.

So we should think about modeling things in such a way that it makes supporting these other file types possible without complicating our data model in the present or having a difficult migration in the future.

👨‍💼 Thanks for that Olivia.

🦉 Oh, one other thing... On the subject of images... We'll be storing our images directly in the database. Turns out, in some cases, [serving files from SQLite can be 35% faster than the file system](https://www.sqlite.org/fasterthanfs.html) (and can be more space efficient as well)! Even in situations where that's not the case, it's certainly not much slower. So while you definitely can bring in another service to manage storing the images for you, or store it to a persistent volume, starting out with the images in the database is a perfectly reasonable approach for many applications.

👨‍💼 Ok, great. Thanks Olivia! So, with that said, instead of making a single `Image` model and using that for both the User and Note models, we're going to have `UserImage` and `NoteImage` models that each hold the content type, file bytes, and alt text.

This may feel like we're duplicating code and schema, which we definitely are, but if you consider the future possibilities, it will be much easier for us to add a `NotePDF` model later without impacting other models than to try and get all polymorphic with a single generic `File` model (polymorphism and databases don't mix well).

Here's a visualized model of this:

![visual representation of polymorphism as described with a 👎 emoji](https://camo.githubusercontent.com/1ae67f55cedb2946741900810340ecd2e944e08ef3729812eddae78a16a0e5ab/68747470733a2f2f6769746875622d70726f64756374696f6e2d757365722d61737365742d3632313064662e73332e616d617a6f6e6177732e636f6d2f313530303638342f3236393035393539382d61653833653563652d393765322d346161342d383839622d6236353536343838336263312e706e67)

And here's what we're going to do instead:

![visual representation of duplication as described with a 👍 emoji](https://camo.githubusercontent.com/bcbfaf12cb169f1c916fa144d7eb0916123565ad881038eb640f4e0f72f42d6c/68747470733a2f2f6769746875622d70726f64756374696f6e2d757365722d61737365742d3632313064662e73332e616d617a6f6e6177732e636f6d2f313530303638342f3236393035393630382d33356333613064392d363833362d343736642d616330372d6135326361623630323865392e706e67)

With these new models in place, we can connect them to the Note and User models. So we'll have the following relationships:

-   `User` -> `UserImage`: one-to-one
-   `Note` -> `NoteImage`: one-to-many

Don't forget that the Prisma VSCode extension, can automatically capitalize the property names it adds which is annoying. Just double check that all properties are lower-case.
The emoji should be in the schema file to help guide you through this.

💰 Remember, if you get stuck on the syntax, remember you can check the Diff Tab to check your work against the solution.

Once you've got the model in a good place, then let's push that to the database:

```sh
npx prisma db push
```

And now let's check out the studio:

```sh
npx prisma studio
```

Now we want to create a new image/file. The tricky bit here is Prisma studio represents files as base64 encoded strings which is fine, I even prepared this base64 image for you:

```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gAgQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3MA/9sAhAAHBwcHBwcICAgICwsKCwsQDg0NDhAYERIREhEYJBYaFhYaFiQgJh8dHyYgOS0nJy05Qjc0N0JPR0dPZF9kg4OwAQcHBwcHBwgICAgLCwoLCxAODQ0OEBgREhESERgkFhoWFhoWJCAmHx0fJiA5LScnLTlCNzQ3Qk9HR09kX2SDg7D/wgARCABAAEADASIAAhEBAxEB/8QAGwAAAwEBAQEBAAAAAAAAAAAABAUGAwIAAQf/2gAIAQEAAAAAT/I8F25O51l5bA6/K55jq2oEZx+3of8AUC83seGKPW9ZMlytM/31wfywq4kwP1JI9kFzheyGpB//xAAXAQEBAQEAAAAAAAAAAAAAAAAGBQME/9oACAECEAAAAF5HRNxi6qDMfXQ8hatY/8QAGAEAAwEBAAAAAAAAAAAAAAAABAUGAgP/2gAIAQMQAAAAR0WEZNkFNEVi+b6U69J//8QAIRAAAwEAAgMBAAMBAAAAAAAAAQIDBAURABITBhQhIzH/2gAIAQEAAQwAMZOCA7FvkieyvUd7f0v8WtY5oihGznbILfzaz8jzGqfSVrm0Nl06NAftTM9W/wCAgeE6ex16nxws1BI7856/2UZYhw04yzqlFoFtuLVr/bl1y4kMWJLd8a2yEYvcBk0xyTIohf1EZMpYM3qKXp2roCOYq55AqAF84r8/mpFLa07Zvz3DOnTZVHg4DiswJGdWbTxaX4x75x6PIOFK+vsQ2n16+SgUYOhCsA3KTonNZw5DGOmWdAr9lpctlq4kPorbeQzQ6+rdD89yGHe5nGwI3YxKp929CGl7Elz58ZkAipB1cM2l8m2Zbs5kqhC1efkck8ykl6UOnHGlZ3cktwOb47ZkWpTzm2IqHSZZlBLgGIAGiQHXy78w6JOlZMFBz29f6J8szuAUoFK6N5/zpPOYcbQ5oU1Edm5E6TjPSHkT79d1A8QuF7KL3mXbcH1APilpf5kgnkA9JgtorNOGqgu65tdqnkdPXHnNMg0nqYSPvJAFu9FJSc+snECpFLghOY3x4TjjRAgbid9t2IVs5azcumdhO4KsnOZsyNUAPTh+S0a/1UqtT2O7M2e1TOAMS1eh6AAf/8QAKhABAAIBBAIABQMFAAAAAAAAAQIRAAMhMUESYVFScYGRIjKxBBNiwdH/2gAIAQEADT8A+KYnFO2QkxNScv0Wd0Y9LGEfCtpRzYYmt4S9MUGz05bRNFr6m15XaZ9sdinHTNSUlqJvRH3eErpGUE+mIoChGXGxkG48btbmEZA+IjJKi1zQZ+1KG5VbhsWGH+O2Q0oFVyW1kqSBRR7rvE5wOX/RmlFlRaJAuqzlEun75zsVvnT5VmppwBGxPKqw6iMn8GPU9OUf5MfS/wAYaUjwbLU3d81FnEC7jg/DnHP6fWiTJADFR2+KYtrB8V9Xzl86kmbd825qRkCNMUesFsmkq9kqHB8LQYsTclFHcuxvGNqx9YPzORFiLd2fznTg3ueR+MEfONs2bYgVRGsIqHC11mn5truy1JMpVXQtGBvV5zXjW+Vy0A+3Dazh+mHLCTH81vXvJxpGXlAD5lObyUGfhdLDTRm4O1yXEVN98TaCvk/8M/ZowDYk913WOpPylXdvWfGrH2OJ+iBt95PRn9qY/KdoHRjKxCwvpOt8NqCs/8QAJhEAAQMDAgUFAAAAAAAAAAAAAQACAwQREiIxBRMhQXEUJEJSYf/aAAgBAgEBPwCsnZTROebdFNXzTuvzCAoausY5gbLkL7HqmP5jA5cav6N3fUFcLhrtT2k7joFSZCGzrixK4sXmkOH2GXhfio4/cMcwaeWCTbuonERjLdVNcI7saMintObvJVNOIY2R/LfwE03A1XX/xAAkEQACAQMDBAMBAAAAAAAAAAABAgMABBESIVEFE0FxIzEyYf/aAAgBAwEBPwC3gaeRUHmo7KGMfjJ5qW1tXD5j0nmnj0OVxXTADdL6NBE0jar6NBGuF9mrrBl24FdJEQuvl8qdPulwcGrph2nD/ouQN/FXOgzN2/rmobUthmOKhlwqseKvMTO7jZfof00wwTtX/9k=
```

Sadly, I couldn't find a way to create one-to-one required relationships in the Prisma studio. So it's time to move to some code!

Let's create a script to do this for us: Click here to create `prisma/seed.ts`.

Go ahead and stick this in there:

```tsx
import { PrismaClient } from "@prisma/client"
import fs from "node:fs"

const prisma = new PrismaClient()

const firstNote = await prisma.note.findFirst()

if (!firstNote) {
    throw new Error("You need to have a note in the database first")
}

await prisma.note.update({
    where: { id: firstNote.id },
    data: {
        images: {
            create: [
                {
                    altText: "an adorable koala cartoon illustration",
                    contentType: "image/png",
                    blob: await fs.promises.readFile(
                        "./tests/fixtures/images/kody-notes/cute-koala.png"
                    ),
                },
                {
                    altText:
                        "a cartoon illustration of a koala in a tree eating",
                    contentType: "image/png",
                    blob: await fs.promises.readFile(
                        "./tests/fixtures/images/kody-notes/koala-eating.png"
                    ),
                },
            ],
        },
    },
})
```

We'll dive deeper into this later...

Next, let's run it. Because this is a TypeScript file, you'll need to use `tsx` instead of `node`:

```sh
npx tsx ./prisma/seed.ts
```

Great, with that done, now open up the studio:

```sh
npx prisma studio
```

You should have your note with the two images and two files in there now. Huzzah! We'll get further into the seeding capability later, but this is a good verification that our model is working.

-   [📜 Prisma `Bytes` Type](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#bytes)

#### Conclusion

👨‍💼 Great job! Our data model is now pretty much done and we're just about ready to start working with it. But how do we get this thing properly deployed and handle changes to our schema in the future. Let's look at that next.

## 3.3 Data Migrations

It's great that Prisma allows us to easily represent our database models and their relationships in a `schema.prisma` file. And we can easily make our database just look like our schema by running `npx prisma db push`. But what if we make a "breaking schema change" that requires us to migrate our data?

Let's talk about what I mean by "breaking schema change". Let's say we have a sandwich ordering shop, like in the example from the first exercise. Here's the order model:

```prisma
model Order {
  id         String      @id @default(uuid())
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  status     String
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]
}
```

What if we decided to add a `Reviews` model and have `reviews` on the order? That's a pretty straightforward change using the knowledge we've accumulated so far. Simply create the `Reviews` model and add it to the order model:

```prisma
model Order {
  id         String      @id @default(uuid())
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  status     String
  userId     String
  user       User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]
  reviews    Review[]
}

model Review {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  rating    Int
  text      String?
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
}
```

We can `npx prisma db push` this change with no issues.

But let's look at the `User` model:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}
```

What if we decided we wanted to make the `name` required? Or what if we decided we want to make the `username` unique? These are "breaking schema changes" which necessitate a data migration.

Managing these data migrations is tricky business and often involves custom SQL or an intrusive ORM that may not quite fit with what you need done so you end up having to workaround the limitations.

Prisma takes the middle ground approach. Instead of completely hiding the details of the migration, Prisma generates the SQL for the migration and saves it to disk. From there you are free to alter it as needed.

This SQL file should be committed to your git repository and deployed alongside your app. That way you can track database changes over time. Prisma will also keep track of which migrations have been applied to your database so you don't have to worry about that. (It creates a very small table in your database for this). So when you deploy your app, you simply run `npx prisma migrate` deploy and Prisma will take care of the rest.

#### Example

I've found this to be helpful in my own work. As a personal example, on [kentcdodds.com](https://kentcdodds.com/) I have user accounts and originally I had my user roles field optional. I later realized this didn't work well for me, so I decided to switch it to a required field. I couldn't just `npx prisma db push` this change because I already had users who didn't have an assigned `role`.

So I created a migration to make the `role` field required and default to `MEMBER`. But then I modified the SQL to set the `role` to `MEMBER` for all users and then updated the `role` field for my own membership to `ADMIN`. [Here's the migration file](https://github.com/kentcdodds/kentcdodds.com/blob/df747c1583000f0f780b21d53efe819c38088893/prisma/migrations/20210608020151_user_roles/migration.sql):

```SQL
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" DEFAULT E'MEMBER';

-- Manually written stuff:

-- Update all users to be members:
update "User" set role = E'MEMBER';

-- update me@kentcdodds.com to be ADMIN:
update "User" set role = E'ADMIN' where email = 'me@kentcdodds.com';

-- make role required
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;
```

And because I had prisma migrations set up to run whenever I deploy new code changes I got everything updated and working as expected.

However, I could have had some issues if I had users signing up while I was deploying this change. I would have had to do some extra work to make sure that I didn't lose any data.

🦉 If you're curious what a migration directory looks like after a few migrations, check [the migrations directory of kentcdodds.com](https://github.com/kentcdodds/kentcdodds.com/tree/df747c1583000f0f780b21d53efe819c38088893/prisma/migrations).

#### Zero Downtime Migrations

At scale, dealing with migrations can be a little tricky. With lots of data and big changes, migrations can take a lot of time. We don't want to pull down our website while we're deploying a migration. But we also don't want to deploy a version of our app that doesn't work with the data in the database.

This is where the practice of "widen then narrow" comes in. The idea is that you make your database schema more permissive, deploy your app, then make your database schema more restrictive. For more on this subject, check out [the Epic Stack database migrations docs](https://github.com/epicweb-dev/epic-stack/blob/main/docs/database.md#migrations).

#### When to use Migrate vs Push

The short answer is you use `push` when you're experimenting with schema changes and `migrate` when you're ready to commit to a schema change.

The longer answer is: [Read the Prisma docs about it](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push) 😇

-   📜 [Prisma Migrate Mental Model](https://www.prisma.io/docs/concepts/components/prisma-migrate/mental-model)

### 3.3.1 Migrations

👨‍💼 Alright, let's get our migration file generated.

🐨 Run the following command:

```sh
npx prisma migrate dev
```

It will ask if you want to delete data. Say "yes" (we're going to generate it all anyway).

It will ask you what to call the migration. I call the first migration "init".

Now check your `prisma/migrations` folder and you'll see the new file there. The migration file is in a directory named after the timestamp of when it was created and the name you provided. This is so that Prisma can keep track of the order of migrations.

You'll also notice . Prisma uses this to make sure you don't change the database provider. Prisma doesn't support changing from Postgres to SQLite as part of a migration. If you want to do that, it's [a little more involved](https://www.prisma.io/docs/concepts/components/prisma-migrate/prisma-migrate-limitations-issues#you-cannot-automatically-switch-database-providers) (though easier than it should be thanks to Prisma). I have done this and it went really well: [I Migrated from a Postgres Cluster to Distributed SQLite with LiteFS](https://kentcdodds.com/blog/i-migrated-from-a-postgres-cluster-to-distributed-sqlite-with-litefs)

-   📜 [Prisma Migrate Getting Started Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate/get-started)
-   📜 [Prisma Migrate: About History](https://www.prisma.io/docs/concepts/components/prisma-migrate/migration-histories)

## 3.4 Seeding Data

Seeding data means to create data in your database that you can use to test your application. It's also useful for initializing your database with data that you know you'll need.

#### Seeding SQLite Data in Development

During development, it's much more useful to have data to work with. You can definitely use your own UI (or Prisma Studio) to add data to the database manually, but this may make you cry when you accidentally reset your database 😭.

Instead, you'll want to have a script that can reset your database. Typically it's best for this script to be idempotent. Meaning you can run it as many times as you like and you get the same desired result. So, typically you want this script to delete all the data in your database and then re-create it from scratch. If you make your seed script rely on existing data in the database you'll start looking for a way to seed your seed script! What a mess!

Another benefit of writing a seed script is you can set the IDs of your records so every time you run the seed script you can have some predictability in the IDs of your records which makes it easier to navigate around the app consistently.

#### Seeding SQLite Data in Production

For example, if you're building an application that allows users to lookup the nearest city with a certain population threshold from their geographic location, you'll need to have a database of cities with their population and geographic coordinates. You could manually enter this data into your database, but that would be tedious and error prone. Instead, you can write a script that will populate your database with the data you need.

The easiest way to seed production data is to include it in your migration script. You literally edit the `migration.sql` file that prisma generates for you to have it create the data you need.

We do this when we add permissions to the database in the web authentication workshop: [Roles Seed](https://auth.epicweb.dev/08/02).

#### Prisma Seed

Prisma's CLI has built-in support for a seed script. It will run your seed script after running dev migrate subcommand `npx prisma migrate reset`. You can also run it manually with `npx prisma db seed`.

But first it must be configured in the `package.json`:

```tsx
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

Whatever the seed property is set to will be what is run.

📜 [Prisma Guide: Seeding your database](https://www.prisma.io/docs/guides/migrate/seed-database).

### 3.4.1 Init Seed Script

👨‍💼 Let's get our seed script going. We already created a file when we added images to our database, so we just need to configure prisma to run this file when we run development migrate commands and on demand when we call `npx prisma db seed`.

🐨 Add this config to the package.json:

```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
},
```

👨‍💼 Great. Now you should be able to run npx prisma db seed and see the images in your database.

However, we want to make our seed script idempotent so it doesn't just keep filling our database with data. It's nice to be able to run the seed script as a way to start fresh.

So check the emoji in to update it to delete the data at the start of the script and create all new data every time it's run.

So check the emoji in to update it to delete the data at the start of the script and create all new data every time it's run.

🐨 Once you've done that, try running

```sh
npx prisma migrate reset
```

Then open up Prisma studio with

```sh
npx prisma studio
```

Now you should have a fresh database with a user, a post, and two images/files.

#### Conclusion

👨‍💼 Super! Now we can run this script any time we like and we'll always have the right data in our database.

### 3.4.2 Nested Writes

Check out the code for the note we're creating:

```tsx
await prisma.note.create({
    data: {
        id: "d27a197e",
        title: "Basic Koala Facts",
        content:
            "Koalas are found in the eucalyptus forests of eastern Australia. They have grey fur with a cream-coloured chest, and strong, clawed feet, perfect for living in the branches of trees!",
        ownerId: kody.id,
        images: {
            create: [
                {
                    altText: "an adorable koala cartoon illustration",
                    contentType: "image/png",
                    blob: await fs.promises.readFile(
                        "./tests/fixtures/images/kody-notes/cute-koala.png"
                    ),
                },
                {
                    altText:
                        "a cartoon illustration of a koala in a tree eating",
                    contentType: "image/png",
                    blob: await fs.promises.readFile(
                        "./tests/fixtures/images/kody-notes/koala-eating.png"
                    ),
                },
            ],
        },
    },
})
```

Notice that we're actually creating two images while we create the note? This is called a nested query.

This generates more optimal SQL queries than running multiple queries.

And it also manages connecting the foreign keys for us. Without using nested queries, we have to do that ourselves, which is why we have to update our note after creating the image:

```tsx
await prisma.note.update({
    where: { id: firstNote.id },
    data: {
        images: {
            connect: [{ id: newImage1.id }, { id: newImage2.id }],
        },
    },
})
```

Instead, I want you to nest everything into a single query. It will get a little nested, and you may feel it's better to break it up into multiple queries. Luckily that's your prerogative in your own app, but I want you to try it out first. As mentioned, there are legitimate benefits to nesting these queries. Also, we'll make it better in the next exercise.

You may find the docs links below to be useful here.
Once you're finished, seed the database again to check your work:

```sh
npx prisma db seed
```

-   [📜 Nested Writes Guide](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#nested-writes)
-   [📜 Nested Writes API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create-1)

## 3.5 Generating Seed Data

Hard-coding data works great for small datasets. But as your application data requirements grow you're going to find it hard to keep up. You can certainly use production data to help you come up with your seed data, but there are privacy concerns there etc.

#### Faker.js

A better way is to use a library like [faker](https://fakerjs.dev/) to

> Generate massive amounts of fake (but realistic) data for testing and development.

Faker has a good guide to get you an introduction to how it works in [the usage docs](https://fakerjs.dev/guide/usage.html#create-complex-objects). But here's a quick snippet from that to give you an idea:

```tsx
import { faker } from "@faker-js/faker"

function createRandomUser() {
    return {
        _id: faker.datatype.uuid(),
        avatar: faker.image.avatar(),
        birthday: faker.date.birthdate(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        sex: faker.person.sexType(),
        subscriptionTier: faker.helpers.arrayElement([
            "free",
            "basic",
            "business",
        ]),
    }
}

const user = createRandomUser()
```

#### Dynamic Data

Another thing we'll be doing in our workshop involves generating a random number of records (like a random number of images or notes). You can use faker to help with that as well:

```tsx
import { faker } from "@faker-js/faker"

const numberOfThings = faker.number.int({ min: 1, max: 10 })

// then you can use that number to generate an array of things:
const things = Array.from({ length: numberOfThings }, () => {
    // create your thing...
})
```

Tip: if the thing you're doing is async, you can wrap it in Promise.all:

### 3.5.1 Generated Data

### 3.5.2 Dynamic Data

### 3.5.3 Unique Constraints

## 3.6 Querying Data

### 3.6.1 Setup App Client

### 3.6.2 Select

### 3.6.3 Nested Select

## 3.7 Updating Data

### 3.7.1 Delete

### 3.7.2 Update

### 3.7.3 Transactions

### 3.7.4 Nested Update

## 3.8 SQL

### 3.8.1 Raw SQL

### 3.8.2 Validation

### 3.8.3 Joins

### 3.8.4 Order By

## 3.9 Query Optimization

### 3.9.1 Foreign Keys

### 3.9.2 Multi-Column Index
