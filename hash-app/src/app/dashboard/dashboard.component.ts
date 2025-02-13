import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHashtag, faFingerprint, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // Defina os ícones como propriedades do componente
  faHashtag = faHashtag;
  faFingerprint = faFingerprint;
  faLock = faLock;

  isSidebarCollapsed = false; // Estado inicial da barra lateral (visível)

  // Método para alternar o estado da barra lateral
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}