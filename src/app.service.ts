import { Injectable } from '@nestjs/common';
import { INestApplication } from '@nestjs/common/interfaces';
import { capitalizeFirstLetter } from './common/utils/string';
import { NextFunction } from 'express';

type HandleFunction = (req: Request, res: Response, next: NextFunction) => void;
type Layer = {
  route?: {
    path: string;
    stack: { method: string }[];
    methods: { [method: string]: boolean };
  };
  name: string;
  handle: HandleFunction;
  regexp: RegExp;
};

@Injectable()
export class AppService {
  private app: INestApplication | null = null;

  setApp(app: INestApplication) {
    this.app = app;
  }

  getRoutesInfo(): Record<string, string[] | null> {
    if (!this.app) return null;
    const httpServer = this.app.getHttpServer();
    const router = httpServer._events.request._router;
    const result: Record<string, string[]> = {};

    router.stack.forEach((layer: Layer) => {
      if (layer.route) {
        const route = {
          path: layer.route.path,
          method: Object.keys(layer.route.methods)[0].toUpperCase(),
        };

        const controllerName = capitalizeFirstLetter(this.getControllerName(layer.route.path));
        if (!result[controllerName]) {
          result[controllerName] = [];
        }
        result[controllerName].push(`[${route.method}] ${route.path}`);
      }
    });

    return result;
  }

  private getControllerName(path: string): string {
    const segments = path.split('/');
    return segments[1] ? segments[1] + 'Controller' : 'RootController';
  }
}
