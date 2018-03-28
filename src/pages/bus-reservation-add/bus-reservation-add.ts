import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { BusReservationPage } from '../bus-reservation/bus-reservation';
import { AlertController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
 import { DatePickerModule } from 'ion-datepicker';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ReservationProvider } from '../../providers/reservation/reservation';
import { DatePickerDirective } from 'ion-datepicker';
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
    public isOther:boolean = false;

    @ViewChild(DatePickerDirective) private datepickerDirective:DatePickerDirective;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder,
        private datePicker: DatePicker,
        public modalCtrl: ModalController,
        public reservationProv: ReservationProvider
    ) {
        this.addForm = this.formBuilder.group({
            applicant_name: ['', Validators.compose([Validators.required])],
            staff_no: ['', Validators.compose([Validators.required])],
            faculty: ['', Validators.compose([Validators.required])],
            contact_no: ['', Validators.compose([Validators.required])],
            event_desc: ['', Validators.compose([Validators.required])],
            vehicle_type: ['', Validators.compose([Validators.required])],
            number_of_passenger: ['', Validators.compose([Validators.required])],
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

        modalPage.onDidDismiss(data => {
            console.log(data);
            this.isModal = 0;
        });
        modalPage.present();
        this.isModal = 1;
    }

    addReservation(){
        console.log('vali', this.addForm.value, 'date', this.datepickerDirective.modal);
    }

    public closeDatepicker(){
        this.datepickerDirective.modal.dismiss();
    }
}
