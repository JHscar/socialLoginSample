import { Component } from '@angular/core';
import { NaverCordovaSDK } from 'naver-sdk-ngx/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public _naverCordovaSDK: NaverCordovaSDK) { }


  doLogin() {
    this._naverCordovaSDK.login().then((res) => {
      console.log(res);
    }, err => {
      console.log('Error', err)
    });
  }

}
