import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EcocasesService } from '../../services/ecocases.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('fileImportInput')
  fileImportInput: any;
  jsonAllocation: any;
  usersInfos: any[];

  constructor(
    private router: Router,
    private es: EcocasesService
  ) { }

  ngOnInit() {
  }

  fileChangeListener($event): void {
    const input = $event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      this.usersInfos = JSON.parse(reader.result);
      console.log('users infos: ', this.usersInfos);
    };
  }

  getAllocationCasUsers(): void {
    this.es.getAllocationCasUsers(this.usersInfos)
      .subscribe(res => {
        console.log(res);
      });
  }
}
