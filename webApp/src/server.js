/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import React from 'react';
import { StaticRouter } from 'react-router';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './pages/error/ErrorPage';
import errorPageStyle from './pages/error/ErrorPage.scss';
import createFetch from './createFetch';
import passport from './passport';
import models from './data/models';
import schema from './data/schema';
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { receiveLogin, receiveLogout } from './actions/user';
import config from './config';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import theme from './styles/theme.scss';
import axios from 'axios'
import crypto from 'crypto-browserify'

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}
app.post('/login', async (req, res) => {
  const login = req.body.login;
  const password = crypto.createHash('sha256').update(req.body.password).digest('hex')
  let user = axios.get(`http://127.0.0.1:5000/user/verify/` + login + '/' + password)
    .then(async response => {return await Promise.resolve(response.status)});
  user = await Promise.resolve(user); //safety net
  if (user === 200) {
    user = {user, login};
  }

  if (user) {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(user, config.auth.jwt.secret, {expiresIn});
    res.cookie('id_token', token, {
      maxAge: 1000 * expiresIn,
      httpOnly: false,
    });
    res.json({id_token: token});
  } else {
    res.status(401).json({message: 'To login use user: "user", password: "password".'});
  }
});

//
// Register API middleware
// -----------------------------------------------------------------------------
// require jwt authentication
app.use(
  '/graphql',
  expressJwt({
    secret: config.auth.jwt.secret,
    getToken: req => req.cookies.id_token,
  }),
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
  })),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    const initialState = {
      user: req.user || null,
    };

    const store = configureStore(initialState, {
      fetch,
    });

    if (req.user && req.user.login) {
      store.dispatch(
        receiveLogin({
          id_token: req.cookies.id_token,
        }),
      );
    } else {
      store.dispatch(receiveLogout());
    }

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
    };

    // eslint-disable-next-line no-underscore-dangle
    css.add(theme._getCss());

    const data = {
      title: 'React Dashboard',
      description:
        'React Admin Starter project based on react-router 4, redux, graphql, bootstrap 4',
      keywords: 'react dashboard, react admin template, react dashboard open source, react starter, react admin, react themes, react dashboard template',
      author: 'Flatlogic LLC'
    };
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js, assets.client.js];
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToString(
      <StaticRouter location={req.url} context={context}>
        <Provider store={store}>
          <App store={store} />
        </Provider>
      </StaticRouter>,
    );

    data.styles = [{ id: 'css', cssText: [...css].join('') }];

    data.children = html;

    const markup = ReactDOM.renderToString(<Html {...data} />);

    res.status(200);
    res.send(`<!doctype html>${markup}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res) => {
  // eslint-disable-line no-unused-vars
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./components/App');
}


export default app;
