import path from 'path';
import request from 'supertest';
import getTestApp from './fixtures/getTestApp';

describe('configureApp', () => {
  it('should work with custom setup', (done) => {
    const app = getTestApp({
      paths: {
        routes: path.resolve(__dirname, './fixtures/routes'),
      },
      setup: (webApp) => {
        webApp.get('/hello', (req, res) => {
          res.send('Hello World');
        });
      },
    });

    request(app)
      .get('/hello')
      .expect(200)
      .then((res) => {
        expect(res.text).toBe('Hello World');
        done();
      });
  });
});
