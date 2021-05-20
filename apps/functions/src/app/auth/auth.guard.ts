import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as functions from 'firebase-functions';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (!environment.production) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['token'];

    return token === functions.config().auth.token || token === functions.config().auth.swagger;
  }
}
