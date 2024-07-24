import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor() {}

  toLogin() {
    window.open('http://localhost:3000/auth/login', '_blank');
  }
}
