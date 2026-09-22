# Astro template

Provisioned from [`Qode-Platform/fleet-template-v1`](https://github.com/Qode-Platform/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows) with a
Astro starter laid on top.

## Origin

    npx create-astro@latest astro --template minimal --typescript strict --no-install

Generated 2026-09-21 on Node v22.12.0 / Python 3.12.3. **Dependencies were
never installed and this has never been built or run.** Boot it once before
trusting it.

## Fleet lifecycle

`fleet.conf` drives every script in `bin/`:

| step | command |
|---|---|
| install | `npm install` |
| build | `npm run build` |
| start | `npx astro preview --host 0.0.0.0 --port $PORT` |

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

Listens on `$PORT` (default `3000`); health check hits `/`.

## BASE_PATH

The fleet injects `BASE_PATH` (`/direct/<agent>:<port>`) and nginx forwards
that prefix **unchanged** — so this app serves every route and asset under
it. An empty or unset value means standalone mode: serve at the host root.

- Astro `base` in astro.config.mjs, baked at BUILD time.
- `HEALTH_PATH` in `fleet.conf` stays un-prefixed; the fleet prepends `$BASE_PATH` itself.
- A value like `direct/x:3000/` is normalised to `/direct/x:3000`.

## What differs from stock output

- Static output; `astro preview` is the built-in server for it.

---

# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Rule: everything under BASE_PATH

This app is served behind a proxy under a prefix (`BASE_PATH=/direct/<agent>:<port>`),
and the prefix is forwarded to the app unchanged. **Every API call and every asset
reference must carry the base path.** Anything hard-coded to `/` hits the host root,
not the app, and 404s in production even though it works on localhost.

The framework rewrites only *some* things for you:

- **Vite / Astro** rewrite `index.html` and bundled asset imports.
- **Next** rewrites `next/link` and `next/image`.

What is **not** rewritten: `fetch` / tRPC / XHR URLs, and string literals in code
(`<use href="/icons.svg#x">`, `<link href="/favicon.ico">`, `url: "/api/trpc"`, …).
Those must build the URL themselves from:

- `import.meta.env.BASE_URL` (Vite / Astro), or
- `process.env.NEXT_PUBLIC_BASE_PATH` (Next).

Run `npm run check:base-path` to verify — it scans `src/` for host-root literals and
fails if it finds any. A line that is genuinely framework-handled can be exempted with
a trailing `// base-path-ok` comment.
