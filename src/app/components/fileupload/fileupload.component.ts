import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flieupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FlieuploadComponent implements OnInit {

  selectFile: File = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onFileSelected(event) {
    console.log(event);
    
    this.selectFile = <File>event.target.files[0];
  }

  onUpload() {
    const filedata = new FormData();
    filedata.append('image', this.selectFile, this.selectFile.name);
    console.log(filedata.get("image"));
    this.http.post(`http//locallhost:44232/api/Values`, filedata)
      .subscribe(res => {
        console.log(res);

      })
  }



}
