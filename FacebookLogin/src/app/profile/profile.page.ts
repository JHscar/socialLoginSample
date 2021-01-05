import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user: any;
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    // 현재 Auth상태를 통해 로그인 된 유저의 정보들을 불러온다.
    this.fireAuth.auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User', user);
        this.user = {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
          isAnonymous: user.isAnonymous,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          refreshToken: user.refreshToken
        };
      }
      else {
        this.router.navigate(['/home']);
      }
    });
  }

  // 로그인 되어있는 Auth를 로그아웃 시켜준다.
  logout() {
    this.fireAuth.auth.signOut().then(() => {
      this.router.navigate(['/home']);
    });
  }

}
