import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.scss'
})
export class MovieInfoComponent implements OnInit {

  // Constructs MovieInfoComponent instance
  /**
   * 
   * @param dialogRef - Angular Material's Dialog Reference
   * @param data - API data injected into dialog; contains movie title and description
   */
  constructor(
    public dialogRef: MatDialogRef<MovieInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Description: string;
    }
  ) { }

  ngOnInit(): void {

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
