import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BusReservationAddPage } from '../bus-reservation-add/bus-reservation-add';
/**
 * Generated class for the BusReservationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bus-reservation',
  templateUrl: 'bus-reservation.html',
})
export class BusReservationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusReservationPage');
  }

  goToAddBusReservePage(){
    this.navCtrl.push(BusReservationAddPage,{})
  }
}
