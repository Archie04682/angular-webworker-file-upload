import { Component, OnInit } from '@angular/core';
import { UploadService } from './services/upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chunk-upload';

  constructor(private uploadService: UploadService) {

  }

  async fileChanged(event: any) {
    await this.uploadService.upload(event.target.files[0], 500, (t, tt) => {});
  }
}
