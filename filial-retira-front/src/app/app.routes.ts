import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MatrizConfigComponent } from './pages/matriz-config/matriz-config';
import { FiliaisConfigComponent } from './pages/filiais-config/filiais-config';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'matriz', component: MatrizConfigComponent },
  { path: 'filiais', component: FiliaisConfigComponent }
];