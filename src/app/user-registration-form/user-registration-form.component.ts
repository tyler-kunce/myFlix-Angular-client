// src/app/user-registration-form/user-registration-form.component.ts
import { Component, Input, OnInit } from '@angular/core';

// Import to close dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// Import to bring in API calls
import { FetchApiDataService } from '../fetch-api-data.service';

// Import to display notifications back to user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss'
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthdate: '' };

  // Constructs UserProfileComponent instance
  /**
   * 
   * @param fetchApidata - API service to fetch data
   * @param dialogRef - Angular Material's Dialog Reference
   * @param snackBar - Angular Material's Snack Bar
   */
  constructor(
    public fetchApidata: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

  }

  // Functioni responsible for sending form inputs to backend
  registerUser(): void {
    this.fetchApidata.userRegistration(this.userData).subscribe((result) => {
      // Logic for successful user registration goes here! (To be implemented)
      this.dialogRef.close(); // Closes the modal on success
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }
}
