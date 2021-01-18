import { Component, OnInit } from '@angular/core';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  showAppleSignIn = false;
  user = null;
  constructor(
    private alertController: AlertController,
    public plt: Platform,
    public signApple: SignInWithApple,
    private fireAuth: AngularFireAuth
  ) { }
  async ngOnInit() {
    // Only show the Apple sign in button on iOS

    let device = await this.plt.is('ios');
    this.showAppleSignIn = device;
  }

  openAppleSignIn() {
    this.signApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
      ]
    }).then((data) => {
      console.log('Data', data);
      const credential = new firebase.auth.OAuthProvider('apple.com').credential(data.identityToken);
      this.fireAuth.auth.signInWithCredential(credential)
        .then((res) => {
          console.log('Login successful', res);
        })
        .catch((error) => {
          console.log(error);
        });
    }, err => {
      console.log('Error', err);
      this.presentAlert();
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Please try again later',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
