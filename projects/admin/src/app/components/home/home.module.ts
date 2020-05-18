import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesModule } from 'projects/commons/src/lib/files/files.module';
import { EditProjectModule } from 'projects/commons/src/lib/settings/edit-project/edit-project.module';
import { SelectProjectModule } from 'projects/commons/src/lib/settings/select-project/select-project.module';
import { CopyrightModule, ReportingCommonModule } from 'projects/commons/src/public-api';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MonthCardComponent } from './month-card/month-card.component';
import { MonthListComponent } from './month-list/month-list.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [HomeComponent, ProfileComponent, MonthCardComponent, MonthListComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReportingCommonModule,
    SelectProjectModule,
    ReactiveFormsModule,
    FormsModule,
    FilesModule,
    CopyrightModule,
    EditProjectModule
  ]
})
export class HomeModule {}
