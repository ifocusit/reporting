import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (!environment.production) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    return request.headers['token'] === 'test123';
  }
}
