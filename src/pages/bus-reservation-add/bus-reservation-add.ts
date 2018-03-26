import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { BusReservationPage } from '../bus-reservation/bus-reservation';
import { AlertController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
 import { DatePickerModule } from 'ion-datepicker';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


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

    public addForm: FormGroup;
    private isModal = 0;

    public localDate = new Date();
    public date;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder,
        private datePicker: DatePicker,
        public modalCtrl: ModalController
    ) {
        this.addForm = this.formBuilder.group({
            applicant_name: [''],
            staff_no: [''],
            faculty: [''],
            contact_no: [''],
            event_desc: [''],
            vehicle_type: [''],
        });
        console.log('local', this.localDate);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BusReservationAddPage');
        // this.loadMap();
    }

    goToBusReserveIndexPage(){
        let prompt = this.alertCtrl.create({
            message: "Are you sure you want to cancel?",
            buttons:[{
                text: 'Yes',
                handler: data => {
                    this.navCtrl.pop();
                }
            },
            {
                text: 'No',
                handler: data => {}
            }]
        });
        prompt.present();
    }

    openModal(){
        var modalPage = this.modalCtrl.create('MapModalPage');
        modalPage.present();
        this.isModal = 1;
    }
}
