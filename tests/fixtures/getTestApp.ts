import path from 'path';
import { AppOptions, configureApp } from '../../src/configureApp';

export default function getTestApp(options?: AppOptions) {
  const appOptions = options || {
    paths: {
      routes: path.join(process.cwd(), 'tests/fixtures/routes'),
    },
  };
  const app = configureApp(appOptions);
  return app;
}
