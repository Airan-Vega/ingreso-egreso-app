import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid;

    return this.firestore
      .doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  initIngresosEgresosListener(uid: string): Observable<any[]> {
    return this.firestore
      .collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          return snapshot.map((doc) => {
            return {
              uid: doc.payload.doc.id,
              ...(doc.payload.doc.data() as any),
            };
          });
        })
      );
  }

  borrarIngresoEgreso(uidItem: string): Promise<void> {
    const uid = this.authService.user.uid;
    return this.firestore
      .doc(`${uid}/ingresos-egresos/items/${uidItem}`)
      .delete();
  }
}
