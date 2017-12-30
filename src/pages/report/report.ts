import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    issues = [
        {value: 'issue1', name: 'Issue 1'},
        {value: 'issue2', name: 'Issue 2'},
        {value: 'issue3', name: 'Issue 3'},
        {value: 'issue4', name: 'Issue 4'},
        {value: 'other', name: 'Other'}
    ]

    ionViewDidLoad() {
        console.log('ionViewDidLoad ReportPage');
    }

}
