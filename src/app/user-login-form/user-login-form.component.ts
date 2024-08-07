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

  @Input() userData = { Username: '', Password: '' };

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
        favoriteMovies: result.user.favoriteMovies || []
      };
      localStorage.setItem('user', JSON.stringify(user));
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
