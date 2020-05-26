import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CopyrightModule, EditProjectModule, FilesModule, ReportingCommonModule, SelectProjectModule } from '@ifocusit/commons';
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
