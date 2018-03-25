import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ReportsProvider } from '../../providers/reports/reports';
/**
* Generated class for the ReportPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-report',
    templateUrl: 'report.html',
})
export class ReportPage {

    private subjects = [
        {value: 'Bus is late.', name: 'Bus is late.'},
        {value: 'Bus does not follow the bus schedule.', name: 'Bus does not follow the bus schedule.'},
        {value: 'There are no bus for my location.', name: 'There are no bus for my location.'}
    ]
    private reportForm: FormGroup;
    public show_subject_err: boolean = false;
    public show_content_err: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        public reportsProv: ReportsProvider
    ) {
        this.reportForm = this.formBuilder.group({
            subject: ['', Validators.compose([Validators.required])],
            content: ['', Validators.compose([Validators.required])]
        })
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ReportPage');
    }

    logForm(){
        if(!this.reportForm.controls.subject.valid && !this.reportForm.controls.content.valid){
            this.show_subject_err = true;
            this.show_content_err = true;
        }
        else if(!this.reportForm.controls.subject.valid){
            this.show_subject_err = true;
            this.show_content_err = false;
        }
        else if(!this.reportForm.controls.content.valid){
            this.show_subject_err = false;
            this.show_content_err = true;
        }
        else{
            let prompt = this.alertCtrl.create({
                title: "Submit",
                message: "Your report has been submitted. Thank you.",
                buttons:[
                {
                    text: 'OK',
                }
                ]
            });

            let error = this.alertCtrl.create({
                title: 'Submit Error',
                message: "Please try again later.",
                buttons:[
                {
                    text: 'OK'
                }
                ]
            })

            let data = {
                subject: this.reportForm.value.subject,
                content: this.reportForm.value.content,
                type: 'user'
            }
            console.log(data);
            this.reportsProv.storeReport(data);
            if(this.reportsProv.hasError){
                this.reportForm.reset();
                error.present();
            }
            else{
                prompt.present();
            }
        }
    }
}
