import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusReservationPage } from './bus-reservation';

@NgModule({
  declarations: [
    BusReservationPage,
  ],
  imports: [
    IonicPageModule.forChild(BusReservationPage),
  ],
})
export class BusReservationPageModule {}
