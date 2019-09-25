import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CopyrightModule, ReportingCommonModule } from 'projects/commons/src/public-api';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, ReportingCommonModule, CopyrightModule, TranslateModule]
})
export class ProfileModule {}
