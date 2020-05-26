import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CopyrightModule, ReportingCommonModule } from '@ifocusit/commons';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, ReportingCommonModule, CopyrightModule, TranslateModule]
})
export class ProfileModule {}
