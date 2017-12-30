import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusReservationAddPage } from './bus-reservation-add';

@NgModule({
  declarations: [
    BusReservationAddPage,
  ],
  imports: [
    IonicPageModule.forChild(BusReservationAddPage),
  ],
})
export class BusReservationAddPageModule {}
