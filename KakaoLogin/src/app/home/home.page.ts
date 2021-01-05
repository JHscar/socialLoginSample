import { Component } from '@angular/core';
import {
  AlertController,
  NavController,
  Platform,
  LoadingController,
} from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import * as firebase from 'firebase/app';

// Kakao api
import {
  KakaoCordovaSDK,
  AuthTypes,
} from 'kakao-sdk/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public kakao: KakaoCordovaSDK, public platform: Platform, private http: HTTP, public afAuth: AngularFireAuth,) { }

  kakaoLogin() {
    // 인증 유형 : default값
    let loginOptions = {
      authTypes: [
        AuthTypes.AuthTypeTalk,
        AuthTypes.AuthTypeStory,
        AuthTypes.AuthTypeAccount,
      ],
    };

    // 원하는 값을 반환 받기 위한 타겟 설정
    let values = {
      targetScopes: ['account_email'],
    };

    this.kakao.login(loginOptions).then((res) => {
      console.log('KaKao Login Info', res);

      // 가져올 항목들의 정보 수집 설정을 했을 경우
      this.kakao.updateScopes(values).then((val) => {
        console.log('updateScopes Values', val);
      })

      // 서버에다가 계정의 토큰 값을 전달해 파이버베이스 Auth인증에 uid값을 설정하게 해준다.
      this.http.post('firebase functions url 주소', { token: res.accessToken }, {}).then((response) => {

        // 서버를 통해 받은 값을 변수에 넣어준다.
        let data: any = JSON.parse(response.data);

        // 토큰 값을 넣어준다.
        const token = data.firebase_token;

        // 토큰 값을 통해 로그인 인증을 시도한다.
        this.loginWithToken(token).then(() => {
          // 현재 로그인이 성공된 사용자의 정보를 가져온다.
          let user: any = this.userDetails();
          console.log('user', user);
        })

      })
    })
  }

  // 토큰 값으로 로그인을 시도하는 함수
  loginWithToken(token) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise<any>((resolve, reject) => {
      firebase.default
        .auth()
        .signInWithCustomToken(token)
        .then(
          (res) => resolve(res),
          (err) => reject(err)
        );
    });
  }

  // 로그인된 유저의 정보를 가져오는 함수
  userDetails() {
    return this.afAuth.currentUser;
  }

}
