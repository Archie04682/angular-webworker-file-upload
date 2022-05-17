import { Injectable } from '@angular/core';
import { UploadProgress, UploadState } from '../models/upload-state.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private uploadWorker: Worker | null = null;

  constructor() { }

  async upload(file: File, chunkSize: number, progress: (progress: UploadProgress) => void) {
    if (typeof Worker !== 'undefined') {
      this.uploadWorker = new Worker(new URL('../workers/upload.worker', import.meta.url));

      this.uploadWorker.onmessage = ({ data }) => {
        const state = this.getState(data.uploadedChunk, data.totalChunks);
        progress({
          currentChunk: data.uploadedChunk, 
          totalChunks: data.totalChunks, 
          state: state
        });

        if (state === UploadState.done) {
          this.uploadWorker?.terminate();
        }
      };

      this.uploadWorker.postMessage({url: '', file: file, chunkSize: chunkSize, bearer: ''});
    }
  }

  private getState(currentChunk: number, totalChunks: number): UploadState {
    if (currentChunk < totalChunks) return UploadState.uploading;
    if (currentChunk === totalChunks) return UploadState.done;

    return UploadState.waitingForUpload;
  }

  async stopUploading() {
    this.uploadWorker?.postMessage({terminated: true});
    this.uploadWorker?.terminate();
    this.uploadWorker = null;
  }
}
