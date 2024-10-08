import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrl: './director-info.component.scss'
})
export class DirectorInfoComponent implements OnInit {

  // Constructs DirectorInfoComponent instance
  /**
   * 
   * @param dialogRef - Angular Material's Dialog Reference
   * @param data - Data that is injected into dialog; contains director's name, bio, birth & death dates
   */
  constructor(
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Bio: string;
      birthDate: Date;
      deathDate: Date;
    }
  ) { }

  ngOnInit(): void {

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
