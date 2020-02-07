import { Component, OnInit } from '@angular/core';
import { JkAlertService } from 'jk-alert';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';

@Component({
  selector: 'app-profile-picture-update',
  templateUrl: './profile-picture-update.component.html',
  styleUrls: ['./profile-picture-update.component.scss']
})
export class ProfilePictureUpdateComponent implements OnInit {

  selectedFile: File;
  imgURL: any;
  valid = false;
  currentUser: UserInterface;

  constructor(
    private alertSV: JkAlertService,
    private actionSV: ActionService,
    private userSV: UserService,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.imgURL = this.userSV.getProfilePicture(this.currentUser._id);
  }

  close() {
    this.actionSV.dispatch({
      action: 'SHOW_UPDATE_PROFILE_PICTURE',
      data: false
    });
  }

  onFileChanged(e) {
    if ( !e.target.files ) {return; }
    this.selectedFile = e.target.files[0];
    if (!this.isValid(this.selectedFile)) {
      this.imgURL = null;
      this.valid = false;
      return;
    }
    this.preview(e.target.files);
    this.valid = true;
  }

  isValid(file) {
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      this.alertSV.error('Invalid file type');
      return false;
    }

    const size = this.formatBytes(file.size);
    const sizeNumber = parseFloat(size.split(' ')[0]);
    if (
      !(size.indexOf('KB') >= 0 || size.indexOf('Bytes') >= 0) ||
      (size.indexOf('KB') >= 0 && sizeNumber > 250)
    ) {
      this.alertSV.error('File size exceeds to 250KB');
      return false;
    }
    return true;
  }

  preview(files) {
    if (files.length === 0) { return; }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    };
  }

  upload() {
    if (!this.valid) { return; }

    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    this.userSV.updateProfilePicture({
      id: this.currentUser._id,
      file: uploadData
    }).subscribe( x => {
      this.actionSV.dispatch({
        action: 'PROFILE_PICTURE_UPDATE'
      });
      this.close();
    });
  }

  formatBytes(bytes, decimals = 2) {
      if (bytes === 0) { return '0 Bytes'; }
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}