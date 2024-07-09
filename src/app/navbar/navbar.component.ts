import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public username: string = '';

  constructor(
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('user')!).username;
  }

  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.snackBar.open('You have successfully logged out', 'OK', {
      duration: 2000
    });
    this.router.navigate(['welcome']);
  }
}
