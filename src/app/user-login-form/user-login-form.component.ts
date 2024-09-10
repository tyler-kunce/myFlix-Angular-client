import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit {

  // Object placeholder with user login data
  /**
   * @property {string} username - User's username
   * @property {string} password - User's password
   */
  @Input() userData = { Username: '', Password: '' };

  // Constructs UserLoginFormComponent instance
  /**
   * 
   * @param fetchApiData - API service to fetch data
   * @param dialogRef - Angular Material's Dialog Reference
   * @param snackBar - Angular Material's Snack Bar
   * @param router - Angular's Router
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      const user = {
        _id: result.user._id,
        username: result.user.Username,
        favoriteMovies: result.user.FavoriteMovies || []
      };
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      this.dialogRef.close();
      this.snackBar.open('Successfully logged in!', 'OK', {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (error) => {
      this.snackBar.open('Login failed.', 'OK', {
        duration: 2000
      });
    });
  }
}
