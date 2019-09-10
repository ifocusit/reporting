import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ReportingCommonModule, CopyrightModule } from 'projects/commons/src/public-api';
import { ProfileComponent } from './profile.component';
import { SelectProjectModule } from 'projects/commons/src/lib/settings/select-project/select-project.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesModule } from 'projects/commons/src/lib/files/files.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReportingCommonModule,
    SelectProjectModule,
    ReactiveFormsModule,
    FormsModule,
    FilesModule,
    CopyrightModule
  ]
})
export class ProfileModule {}
