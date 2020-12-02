import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

import { filter } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];

  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosSubs = this.store
      .select('ingresosEgresos')
      .pipe(filter(({ items }) => items.length !== 0))
      .subscribe(({ items }) => (this.ingresosEgresos = items));
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
  }

  borrar(uid: string) {
    this.ingresoEgresoService
      .borrarIngresoEgreso(uid)
      .then(() => Swal.fire('Borrado', 'Item Borrado', 'success'))
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  }
}
