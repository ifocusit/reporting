import * as admin from 'firebase-admin';
import { app } from './app';
import { environment } from './environments/environment';

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-config.json')),
  databaseURL: 'https://timbrage-reporting.firebaseio.com',
  storageBucket: 'timbrage-reporting.appspot.com'
});

app().then(nestApp => {
  const port = process.env.PORT || 8080;
  if (!environment.production) {
    nestApp.enableCors({ origin: `http://localhost:${port}` });
  }
  return nestApp
    .listen(port, process.env.host || '0.0.0.0')
    .then(_ => nestApp.getUrl())
    .then(url => console.log(`Application is running on: ${url}`));
});
