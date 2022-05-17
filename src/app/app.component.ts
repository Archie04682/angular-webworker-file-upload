import { Component, OnInit } from '@angular/core';
import { UploadProgress, UploadState } from './models/upload-state.model';
import { UploadService } from './services/upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chunk-upload';

  uploadState: UploadState = UploadState.waitingForUpload;
  progressPercent: string = '0%';

  constructor(private uploadService: UploadService) {
  }

  async fileChanged(event: any) {
    await this.uploadService.upload(event.target.files[0], 50000, (progress: UploadProgress) => {
      this.uploadState = progress.state;
      if (this.uploadState === UploadState.done) {
        this.progressPercent = '0%';
      } else {
        this.progressPercent = `${(progress.currentChunk / progress.totalChunks) * 100}%`;
      }
    });
  }
}
