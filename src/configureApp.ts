import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import enrouten from 'express-enrouten';
import morgan from 'morgan';
import session from 'express-session';
import cors from 'cors';
import { v4 as uuidV4 } from 'uuid';
import 'fetch-everywhere';

export interface ExtendedRequest extends Request {
  id?: string;
}

export interface ResponseError extends Error {
  status?: number;
}

function finalErrorHandler(
  err: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    if (!err.status) {
      console.error(err.message, err.stack);
    }
    res.status(err.status || 500).json({
      message: err.message,
    });
  } else {
    next();
  }
}

export interface AppOptions {
  paths: {
    routes: string;
    staticDirectories?: Array<string>;
  };
  sessionSecret?: string;
  setup?: (app: express.Application) => void;
}

export function configureApp(options: AppOptions) {
  const {
    setup,
    paths: { routes, staticDirectories },
    sessionSecret,
  } = options;

  const app: Application = express();
  app.disable('x-powered-by');
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(compression());
  app.use(morgan('combined'));
  app.use(cors());

  // Enable distributed tracing through request identifiers
  app.use((req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.id) {
      req.id = uuidV4();
      next();
    } else {
      next();
    }
  });

  // Enable sessions if session secret was provided by consumer
  if (sessionSecret) {
    app.use(
      session({
        secret: sessionSecret,
        saveUninitialized: true,
        resave: false,
        cookie: {
          httpOnly: true,
          maxAge: 60 * 60 * 10000, // Cookies will be valid for 1 hour
        },
      })
    );
  }

  if (staticDirectories?.length) {
    staticDirectories.forEach((path) => {
      app.use(express.static(path));
    });
  }

  // Support directory-based routing by default
  app.use(
    enrouten({
      directory: routes,
    })
  );

  if (typeof setup === 'function') {
    // Allow consumer to run its own setup adding additional things for server app
    setup(app);
  }

  // Add final error handler for api endpoints
  app.use(finalErrorHandler);

  return app;
}
