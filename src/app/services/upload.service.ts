import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  async upload(file: File, chunkSize: number, progress: (transfered: number, total: number) => void) {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('../workers/upload.worker', import.meta.url));

      worker.onmessage = ({ data }) => {
        console.log(data);
      };

      worker.postMessage({url: '', file: file, chunkSize: chunkSize, bearer: ''})
    }
  }
}
