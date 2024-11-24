import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { UserService } from './user/user.service';

@NgModule({
  declarations: [],
  imports: [
    // TODO factoriser les imports
  ],
  providers: [AuthService, UserService]
})
export class AuthModule {}
