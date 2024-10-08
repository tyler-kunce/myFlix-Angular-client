import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrl: './genre-info.component.scss'
})
export class GenreInfoComponent implements OnInit {

  // Constructs GenreInfoComponent instance
  /**
   * 
   * @param dialogRef - Angular Material's Dialog Reference
   * @param data - Data that is injected into dialog; contains genre's name and description
   */
  constructor(
    public dialogRef: MatDialogRef<GenreInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Description: string;
    }
  ) {
    console.log('Genre data received:', data);
  }

  ngOnInit(): void {

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
