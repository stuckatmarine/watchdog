## Watchdog React Dashboard — An "[isomorphic](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/)" Web App

## Quick Start

#### 1. Get the latest version

You can start by cloning the latest version of watchdog on your
local machine by running:

```shell
$ git clone -o react-dashboard -b master --single-branch \
      https://github.com/stuckatmarine/watchdog.git watchdog
$ cd watchdog/webApp
```

If you don't already have yarn installed you can get it [here](https://yarnpkg.com/lang/en/docs/install/#windows-stable) (its just a package manager)

#### 2. Run `yarn install`

This will install both run-time project dependencies and developer tools listed
in [package.json](../package.json) file.

#### 3. Run `yarn start`

This command will build the app from the source files (`/src`) into the output
`/build` folder. As soon as the initial build completes, it will start the
Node.js server (`node build/server.js`) and [Browsersync](https://browsersync.io/)
with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

> [http://localhost:3000/](http://localhost:3000/) — Node.js server (`build/server.js`)<br>
> [http://localhost:3000/graphql](http://localhost:3000/graphql) — GraphQL server and IDE<br>

Now you can open your web app in a browser, on mobile devices and start
hacking. Whenever you modify any of the source files inside the `/src` folder,
the module bundler ([Webpack](http://webpack.github.io/)) will recompile the
app on the fly and refresh all the connected browsers.

For more info please refer to [getting started](./docs/getting-started.md) guide to download and run the project (Node.js >= 6.5)

## Built using 
* [React](https://facebook.github.io/react/)
* [Bootstrap](http://getbootstrap.com/)
* [React Router](https://reacttraining.com/react-router/) (with **Server Side Rendering**!),
* [Redux](http://redux.js.org/)
* [GraphQL](http://graphql.org/)

This project is bootstraped from [Flatlogic](https://github.com/flatlogic/react-dashboard), which is a seed project of a free version of a template that may be found on [Themeforest](https://themeforest.net/category/site-templates/admin-templates)
or [Wrapbootstrap](https://wrapbootstrap.com/themes/admin) with working backend integration.



## Features
* React
* Server Side Rendering
* Mobile friendly layout (responsive)
* React Router
* Bootstrap3
* GraphQL
* Nodejs backend inegration
* Sass styles
* Webpack build
* Stylish, clean, responsive layout
* Lots of utility css classes for rapid development (flatlogic css set)
* Authentication
* CRUD operations examples
* Browsersync for the ease of development

## Sub-Licenses

[MIT](https://github.com/flatlogic/react-dashboard/blob/master/LICENSE.txt) and another [MIT](https://github.com/flatlogic/react-dashboard/blob/master/LICENSE-react-starter-kit.txt) from RSK.
