# Preact Hybrid Boilerplate

A boilerplate to quickly start working on React projects using hybrid rendering.

Based on [React Hybrid Boilerplate](https://github.com/cyyynthia/react-hybrid-boilerplate) by [cyyynthia](https://github.com/cyyynthia) with a few [differences](#differences).

## Hybrid rendering?
Basically, in production there is a small web server (here fastify) that'll be in charge of
pre-rendering your Preact application. It then gets hydrated client-side, which means Preact will then bind all
the events it needs to bind and work as if it was CSR. It helps to enhance SEO, load times, and makes your
application usable by users who disabled JavaScript.

## Features
 - Hot reload: It is capable of hot reloading while developing,
 - Framework: [Preact](https://preactjs.com) (does not include `preact/compat`),
 - Web Server: [Fastify](https://github.com/fastify/fastify) (with the [fastify-compress](https://github.com/fastify/fastify-compress) plugin),
 - Image minification: [imagemin](https://github.com/imagemin/imagemin) (in production builds),
 - Routing: Minimalist friendly [Wouter](https://github.com/molefrog/wouter),
 - Hotel? Trivago.

Furthermore, this includes `.replit` file which prevents UPM from installing non-existent packages. (I hate UPM)

There are also some env variables that get injected in your application through webpack's `DefinePlugin`:
 - `WEBPACK.GIT_REVISION` - Git revision; null if git isn't present.

### Differences
There are a few significant differences from other boilerplates which you should consider when 
deciding if you like this one or not. This boilerplate focuses on minimalism (you can't *really* go minimalist
with JavaScript frameworks, but I try to do my best) and speed. If you want these, this boilerplate is for you.

Here is a list of differences from the original one this is based on:
 - React is replaced by [Preact](https://preactjs.com), probably the most significant difference is this.
 - React Router is replaced by minimalist friendly [wouter-preact](https://github.com/molefrog/wouter).
 - Vanilla http is replaced by [Fastify](https://github.com/fastify/fastify) (with the [fastify-compress](https://github.com/fastify/fastify-compress) plugin).
 - React Helmet is yeeeeted out of the window.
 - Trivago for hotel.

You're of course able to edit the configuration to your needs.

**Note**: This boilerplate uses [css modules](https://github.com/css-modules/css-modules) by default. You can disable
them by looking at `webpack.config.js` line 90.

## How to use
### Aliases
 - `@components/*`: src/components/*
 - `@constants`: src/constants.js
 - `@styles/*`: src/styles/*
 - `@assets/*`: src/assets/*

## How to run
**Note**: This boilerplate uses [pnpm](https://github.com/pnpm/pnpm) for dependency management.

### Development
Both webpack and the http server must be running
 - `pnpm run dev` - Runs the http server with [nodemon](https://github.com/remy/nodemon)
 - `pnpm run watch` - Runs webpack dev server

Then, open http://localhost:8080 in your web browser and start tinkering!

### Production
 - Build the app: `pnpm run build`
 - And then start the http server! `pnpm run start`

You can change the port by setting the PORT env variable. By default, it'll listen on http://localhost:6969.