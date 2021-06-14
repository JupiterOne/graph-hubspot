const Koa = require('koa');
const Router = require('@koa/router');

const {
  SERVER_PORT,
  OAUTH_APP_INSTALL_BASE_URL,
  OAUTH_CLIENT_ID,
  OAUTH_SCOPES,
} = require('dotenv').config().parsed;

const Hubspot = require('./hubspot');
const Database = require('./database');

const app = new Koa();
const appRouter = new Router();

const hubspot = new Hubspot();
const db = new Database();

appRouter.get('/redirect', ({ response }) => {
  response.redirect(
    OAUTH_APP_INSTALL_BASE_URL +
    `?client_id=${encodeURIComponent(OAUTH_CLIENT_ID)}` + // app's client ID
    `&scope=${encodeURIComponent(
      OAUTH_SCOPES.split(',')
        .map((it) => it.trim())
        .join(' '),
    )}` + // scopes being requested by the app
      `&redirect_uri=${encodeURIComponent(Hubspot.REDIRECT_URI)}`, // must match what's defined in the app settings
  );
});

appRouter.get(Hubspot.PATH, async ({ request, response }) => {
  const { code } = request.query;

  if (code) {
    const payload = {
      code,
      ...(await hubspot.retrieveTokens(code)),
    };

    if (payload.access_token && payload.refresh_token) {
      db.set(payload);
    }

    response.body = `
      ${JSON.stringify(payload)}
      <br>
      <a href="/redirect">Refresh</a>
      `;
  } else {
    response.body = 'Please check the callback url';
  }
});

appRouter.get('/', async ({ response }) => {
  const saved = await db.get();
  if (saved) {
    response.body = `
      <pre>${JSON.stringify(saved)}
      </pre>
      <br>
      access_token:
      <br>
      <code>${saved.access_token}</code>
      <br>
      <br>
      <a href="/redirect">Refresh</a>
    `;
  } else {
    response.redirect(`http://localhost:${SERVER_PORT}/redirect`);
  }
});

app.use(appRouter.routes()).use(appRouter.allowedMethods());

app.listen(parseInt(SERVER_PORT), (e) => {
  console.log(`Visit http://localhost:${SERVER_PORT} to install the app`);
});
