import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService : AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
  
    let headersConfig = { };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    request = request.clone({ setHeaders: headersConfig });

    return next.handle(request);
  }
}
