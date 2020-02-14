import { Component, OnInit } from '@angular/core';
import { JkAlertService } from 'jk-alert';
import { ActionService } from 'src/app/v2/shared/services/action.service';
import { UserService } from 'src/app/v2/shared/services/user.service';
import { SessionService } from 'src/app/v2/shared/services/session.service';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { UploadService } from 'src/app/v2/shared/services/upload.service';

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
    private sessionSV: SessionService,
    private uploadSV: UploadService
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

  async onFileChanged(e) {
    if ( !e.target.files ) {return; }
    this.selectedFile = e.target.files[0];
    if (!this.isValid(this.selectedFile)) {
      this.imgURL = null;
      this.valid = false;
      return;
    }
    this.imgURL = await this.uploadSV.previewData(e.target.files);
    this.valid = true;
  }

  isValid(file) {
    const result = this.uploadSV.isValidFile(file);
    if (!result.valid) {
      this.alertSV.error(result.message);
      return false;
    }
    return true;
  }

  upload() {
    if (!this.valid) { return; }

    this.uploadSV.upload({
      id: this.currentUser._id,
      file: this.selectedFile
    }).subscribe( x => {
      this.actionSV.dispatch({
        action: 'PROFILE_PICTURE_UPDATE'
      });
      this.close();
    });

  }
}
