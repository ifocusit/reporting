import { app } from './app';
import { environment } from './environments/environment';

app()
  .then(nestApp => {
    const port = process.env.PORT || 3333;
    if (!environment.production) {
      nestApp.enableCors({ origin: `http://localhost:${port}` });
    }
    return nestApp.listen(port, process.env.host || '0.0.0.0');
  })
  .then(server => server.getUrl())
  .then(url => console.log(`Application is running on: ${url}`));
