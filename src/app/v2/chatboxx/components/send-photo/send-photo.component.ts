import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UploadService } from 'src/app/v2/shared/services/upload.service';
import { JkAlertService } from 'jk-alert';
import { SessionService } from 'src/app/v2/shared/services/session.service';


@Component({
  selector: 'app-send-photo',
  templateUrl: './send-photo.component.html',
  styleUrls: ['./send-photo.component.scss']
})
export class SendPhotoComponent implements OnInit {

  @Output() onupload: EventEmitter<string> = new EventEmitter<string>();

  selectedFile: File;
  constructor(
    private uploadSV: UploadService,
    private alertSV: JkAlertService,
    private sessionSV: SessionService,
  ) { }

  ngOnInit() {
  }

  async onFileChanged(e) {
    if ( !e.target.files ) {return; }
    this.selectedFile = e.target.files[0];

    const result = this.uploadSV.isValidFile(this.selectedFile);
    if (!result.valid) {
      this.alertSV.error(result.message);
      return;
    }
    this.upload();
  }

  upload() {
    const timestamp = new Date().getTime();
    const filename = `${this.sessionSV.data.user._id}_${timestamp}`;
    this.uploadSV.upload({
      id: filename,
      file: this.selectedFile
    }).subscribe( x => {
      this.onupload.emit(filename + '.jpg');
    });
  }
}
