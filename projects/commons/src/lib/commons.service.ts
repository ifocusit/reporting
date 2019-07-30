import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {
  constructor() {}

  public sayHello() {
    return 'Hello from commons service';
  }
}
