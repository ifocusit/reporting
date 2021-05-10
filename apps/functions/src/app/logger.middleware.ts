import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    const startTime = new Date().getTime();
    this.logger.log(`${method} ${originalUrl}`);
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const elapsed = new Date().getTime() - startTime;
      const message = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${elapsed / 1000}s`;
      if (statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
