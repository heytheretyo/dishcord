import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  toLogin() {
    window.open('http://localhost:3000/auth/login', '_blank');
  }
}
