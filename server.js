const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
const i18n = require('./lib/i18n');

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    preload: ['es'], // preload all langages
    ns: ['common'], // need to preload all the namespaces
    backend: {
      loadPath: `${__dirname}/locales/{{lng}}/{{ns}}.json`,
      addPath: `${__dirname}/locales/{{lng}}/{{ns}}.missing.json`,
    },
  }, () => {
    app.prepare()
      .then(() => {
        const server = express();

        server.use(i18nextMiddleware.handle(i18n));

        server.use('/locales', express.static(`${__dirname}/locales`, {
          setHeaders(res) {
            res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
          },
        }));
        server.use('/static', express.static(`${__dirname}/static`, {
          setHeaders(res) {
            res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
          },
        }));

        server.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18n));

        const options = {
          root: `${__dirname}/static/`,
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
          },
        };
        server.get('/robots.txt', (req, res) => (
          res.status(200).sendFile('robots.txt', options)
        ));
        server.get('/sitemap.xml', (req, res) => (
          res.status(200).sendFile('sitemap.xml', options)
        ));

        server.get('*', (req, res) => handle(req, res));

        server.listen(port, (err) => {
          if (err) throw err;
          console.log(`> Ready on http://localhost:${port}`);
        });
      });
  });

