import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusReservationViewPage } from './bus-reservation-view';

@NgModule({
  declarations: [
    BusReservationViewPage,
  ],
  imports: [
    IonicPageModule.forChild(BusReservationViewPage),
  ],
})
export class BusReservationViewPageModule {}
