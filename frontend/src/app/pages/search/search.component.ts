import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { DataService } from '../../utils/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  data: any = [];

  username: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  publicRepoCount: number;
  bio: string;
  img: string;
  followers: number;
  following: number;

  repoData: any = [];

  displayedColumns: string[] = ['id', 'name', 'repoID'];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required]),
    });
  }

  getData() {
    if (this.form.invalid) {
      return;
    } else {
      this.loading = true;
      this.dataService.getData(this.form.value.username).subscribe(
        (res: any) => {
          this.loading = false;

          this.toastr.success("User's details fetched!", 'Success', {
            timeOut: 3000,
            easing: 'ease-in',
            easeTime: 300,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left',
          });

          this.data = res;
          this.name = this.data[0].name;
          this.company = this.data[0].company;
          this.blog = this.data[0].blog;
          this.location = this.data[0].location;
          this.email = this.data[0].email;
          this.publicRepoCount = this.data[0].publicRepoCount;
          this.bio = this.data[0].bio;
          this.img = this.data[0].avatar;
          this.followers = this.data[0].followers;
          this.following = this.data[0].following;

          this.repoData = this.data[0].repoData;

          // data manipulation
          const data = Array.from({ length: this.repoData.length }, (_, k) =>
            modifyData(
              k + 1,
              this.repoData[k]._id,
              this.repoData[k].name,
              this.repoData[k].repoID,
              this.repoData[k].repoURL
            )
          );

          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: any) => {
          this.loading = false;
          console.log(error);
          this.toastr.error('', 'Failed', {
            timeOut: 3000,
            easing: 'ease-in',
            easeTime: 300,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left',
          });
        }
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  repoTab(url: string) {
    window.open(url, '_blank');
  }
}

function modifyData(
  id: number,
  _id: string,
  name: string,
  repoID: number,
  repoURL: string
): any {
  return {
    id: id.toString(),
    _id: _id,
    name: name,
    repoID: repoID,
    repoURL: repoURL,
  };
}
