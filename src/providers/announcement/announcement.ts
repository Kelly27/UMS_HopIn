import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AnnouncementProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnnouncementProvider {

  constructor(public http: Http) {
    console.log('Hello AnnouncementProvider Provider');
  }

  getAnnounce(){
    return this.http.get('http://umshopin.com/umshopin_admin/announcement/api')
      .map(response => response.json());
  }

}
