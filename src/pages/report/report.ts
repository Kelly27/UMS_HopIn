import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

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

    private issues = [
        {value: 'issue1', name: 'Bus is late.'},
        {value: 'issue2', name: 'Bus does not follow the bus schedule.'},
        {value: 'issue3', name: 'There are no bus for my location.'}
    ]
    private other_hidden = false;
    private reportForm: FormGroup;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private formBuilder: FormBuilder) {
        this.reportForm = this.formBuilder.group({
            issue: [''],
            other_issue: ['']
        })
    }

    // ionViewDidLoad() {
    //     console.log('ionViewDidLoad ReportPage');
    // }

    logForm(){
        console.log(this.reportForm.value);
        let prompt = this.alertCtrl.create({
            title: "Submit",
            message: "Your report has been submitted. Thank you."
        });
        prompt.present();
        this.reportForm.reset();
        //reset or hide again the "other" textarea
        this.other_hidden = false;

    }

    show_textarea(x){
        this.other_hidden = x;
    }

}
