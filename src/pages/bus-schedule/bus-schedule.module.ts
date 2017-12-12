import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusSchedulePage } from './bus-schedule';

@NgModule({
  declarations: [
    BusSchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(BusSchedulePage),
  ],
})
export class BusSchedulePageModule {}
