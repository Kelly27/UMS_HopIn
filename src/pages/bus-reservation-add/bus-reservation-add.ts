import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { BusReservationPage } from '../bus-reservation/bus-reservation';
import { AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ReservationProvider } from '../../providers/reservation/reservation';
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

    public localDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
    public isOther:boolean = false;
    public pickupLoc;
    public dropoffLoc;
    public vehicle:any = 'bus';

    public form_errs = { applicant_name: false,
                        staff_no: false,
                        faculty: false,
                        contact_no: false,
                        event_desc: false,
                        number_of_passenger: false,
                        pickupLoc: false,
                        dropoffLoc: false,
                       }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder,
        public modalCtrl: ModalController,
        public reservationProv: ReservationProvider
    ) {
        this.addForm = this.formBuilder.group({
            applicant_name: ['', Validators.compose([Validators.required])],
            staff_no: ['', Validators.compose([Validators.required])],
            faculty: ['', Validators.compose([Validators.required])],
            contact_no: ['', Validators.compose([Validators.required])],
            event_desc: ['', Validators.compose([Validators.required])],
            vehicle_type: [this.vehicle],
            number_of_passenger: ['', Validators.compose([Validators.required])],
            pickupLoc: ['', Validators.compose([Validators.required])],
            dropoffLoc: ['', Validators.compose([Validators.required])],
            required_datetime: ['', Validators.compose([Validators.required])],
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BusReservationAddPage');
        // this.loadMap();
    }

    goToBusReserveIndexPage(){
        let exit_alrt = this.alertCtrl.create({
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
        exit_alrt.present();
    }

    openModal(modalNo){
        var modalPage;
        if(modalNo == 0){
            modalPage = this.modalCtrl.create('MapModalPage', {location: this.pickupLoc});
        }
        else if(modalNo == 1){
            modalPage = this.modalCtrl.create('MapModalPage', {location: this.dropoffLoc});
        }

        modalPage.onDidDismiss(data => {
            if(modalNo == 0){ // 0 for pick up
                this.pickupLoc = data;
            }
            else if(modalNo == 1){ // 1 for dest
                this.dropoffLoc = data;
            }
            this.isModal = 0;
        });
        modalPage.present();
        this.isModal = 1;
    }

    addReservation(){
        console.log(this.addForm.value);
        for(let key in this.addForm.controls){
            if(!this.addForm.controls[key].valid){
                this.form_errs[key] = true;
            }
            else{
                this.form_errs[key] = false;
            }
        }

        this.addForm.value.vehicle_type = this.vehicle;

        let submit_alrt = this.alertCtrl.create({
            message: "Are you sure you want to submit? You will be contacted once the application is approved.",
            buttons:[{
                text: 'Yes',
                handler: data => {
                    this.reservationProv.storeReservation(this.addForm.value);
                    this.navCtrl.pop();
                }
            },
            {
                text: 'No',
                handler: data => {}
            }]
        })
        if(this.is_errorless()){
            submit_alrt.present();
        }
        else{
            console.log('err', this.form_errs);
        }
    }

    is_errorless(){
        for(let key in this.form_errs){
            if(this.form_errs[key] == true){
                return false;
            }
        }
        return true;
    }

    onChange($event: string){
        this.vehicle = $event;
    }
}
