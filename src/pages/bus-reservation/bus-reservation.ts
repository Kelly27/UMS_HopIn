import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { BusReservationAddPage } from '../bus-reservation-add/bus-reservation-add';
import { ReservationProvider } from '../../providers/reservation/reservation';

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

  public allReservations = [];
  public reservation = [];
  public search_result = [];
  public search_word;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public reservationProv: ReservationProvider,
    public loadCtrl: LoadingController) {
    this.getAllReservation();

    // this.prepareData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusReservationPage');
  }

  goToAddBusReservePage(){
    this.navCtrl.push(BusReservationAddPage,{})
  }

  getAllReservation(){
    var data;
    this.reservationProv.getReservationData()
      .subscribe(res => {
        data = this.decode_applicantInfo(res);
        this.allReservations = data;
        this.reservation = data;
        console.log(this.allReservations);
      })
  }

  prepareData(){
    let loading = this.loadCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  decode_applicantInfo(data){
    for(var i = 0; i < data.length; i++){
      data[i].applicant_info = JSON.parse(data[i].applicant_info);
    }
    return data;
  }

  getItems(){
    this.search_result = this.allReservations.filter(item => {
      return item.applicant_info.applicant_name.toLowerCase().indexOf(this.search_word.toLowerCase()) > -1;
    });
    this.reservation = this.search_result;
  }

  view_details(){
    this.navCtrl.push(BusReservationAddPage,{});
  }
}
