import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MatrizConfigComponent } from './pages/matriz-config/matriz-config';
import { FiliaisConfigComponent } from './pages/filiais-config/filiais-config';
import { LoginComponent } from './pages/login/login';
import { SegurancaConfigComponent } from './pages/seguranca-config/seguranca-config'; 
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'matriz', component: MatrizConfigComponent, canActivate: [authGuard] },
  { path: 'filiais', component: FiliaisConfigComponent, canActivate: [authGuard] },
  { path: 'seguranca', component: SegurancaConfigComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' } 
];