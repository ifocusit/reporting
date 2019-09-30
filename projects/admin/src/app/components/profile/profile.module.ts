import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesModule } from 'projects/commons/src/lib/files/files.module';
import { EditProjectModule } from 'projects/commons/src/lib/settings/edit-project/edit-project.module';
import { SelectProjectModule } from 'projects/commons/src/lib/settings/select-project/select-project.module';
import { CopyrightModule, ReportingCommonModule } from 'projects/commons/src/public-api';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

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
    CopyrightModule,
    EditProjectModule
  ]
})
export class ProfileModule {}
