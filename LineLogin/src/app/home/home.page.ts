import { Component } from '@angular/core';
import { LineLogin } from '@ionic-native/line-login/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private lineLogin: LineLogin
  ) { }

  linelogin() {
    this.lineLogin.initialize({ channel_id: "발급받은 id" })

    this.lineLogin.login().then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error)
    })
  }

}
