import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SidebarComponent } from './layout/sidebar/sidebar'; 
import { NavbarComponent } from './layout/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './app.html', 
  styleUrl: './app.css'     
})
export class App {
  title = 'filial-retira-front';

  constructor(public router: Router) {} 
}