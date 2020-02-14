import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { EventInterface } from '../interfaces/event.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private http: HttpClient,
  ) { }

  isValidFile(file: File): {
    valid: boolean,
    message?: string
  } {
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return {
        valid: false,
        message: 'Invalid file type'
      };
    }

    const size = this.formatBytes(file.size);
    const sizeNumber = parseFloat(size.split(' ')[0]);
    if (
      !(size.indexOf('KB') >= 0 || size.indexOf('Bytes') >= 0) ||
      (size.indexOf('KB') >= 0 && sizeNumber > 250)
    ) {
      return {
        valid: false,
        message: 'File size exceeds to 250KB'
      };
    }
    return {
      valid: true
    };
  }

  async previewData(files): Promise<any> {
    if (files.length === 0) { return; }
    return new Promise( (resolved, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (event) => {
        resolved(reader.result);
      };
    });
  }

  private uploadData(file: File) {
    const uploadData = new FormData();
    uploadData.append('file', file, file.name);
    return uploadData;
  }

  private formatBytes(bytes, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  upload(params: {
    id: string,
    file: File
  }) {
    const formData = this.uploadData(params.file);
    return this.http.post(`user/upload/${params.id}`, formData);
  }
}
