import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

import { filter } from 'rxjs/operators';

import { IngresoEgreso } from '../../models/ingreso-egreso.model';

import { MultiDataSet, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss'],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  ingresosSubs: Subscription;

  // Doughnut
  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.ingresosSubs = this.store
      .select('ingresosEgresos')
      .pipe(filter(({ items }) => items.length !== 0))
      .subscribe(({ items }) => this.generarEstadistica(items));
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

    items.map((item) => {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    });

    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
  }
}
