import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hash',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importe módulos necessários
  templateUrl: './hash.component.html',
  styleUrls: ['./hash.component.css'],
})
export class HashComponent {}