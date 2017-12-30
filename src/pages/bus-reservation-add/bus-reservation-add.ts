import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BusReservationPage } from '../bus-reservation/bus-reservation';
import { AlertController } from 'ionic-angular';

/**
* Generated class for the BusReservationAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-bus-reservation-add',
    templateUrl: 'bus-reservation-add.html',
})
export class BusReservationAddPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BusReservationAddPage');
    }

    goToBusReserveIndexPage(){
        let prompt = this.alertCtrl.create({
            message: "Are you sure you want to cancel?",
            buttons:[{
                text: 'Yes',
                handler: data => {
                    this.navCtrl.push(BusReservationPage,{});
                }
            },
            {
                text: 'No',
                handler: data => {}
            }]
        });
        prompt.present();
    }

}
