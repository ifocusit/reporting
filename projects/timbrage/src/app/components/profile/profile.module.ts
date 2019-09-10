import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ReportingCommonModule, CopyrightModule } from 'projects/commons/src/public-api';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, ReportingCommonModule, CopyrightModule]
})
export class ProfileModule {}
