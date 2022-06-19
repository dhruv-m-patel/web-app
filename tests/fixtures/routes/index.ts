import { Router, Request, Response } from 'express';

export default function TestRouter(router: Router) {
  router.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
  });
}
