import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return this._user;
  }

  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.angularFireAuth.authState.subscribe((fuser) => {
      if (fuser) {
        // usuario existe
        this.userSubscription = this.firestore
          .doc(`${fuser.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this._user = user;
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        // usuario no existe
        if (this.userSubscription) {
          this._user = null;
          this.userSubscription.unsubscribe();
          this.store.dispatch(authActions.unSetUser());
          this.store.dispatch(ingresoEgresoActions.unSetItems());
        }
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email);

        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });
  }

  loginUsuario(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.angularFireAuth.signOut();
  }

  isAuth() {
    return this.angularFireAuth.authState.pipe(map((fbuser) => fbuser != null));
  }
}
