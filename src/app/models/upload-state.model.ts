export interface UploadProgress {
    currentChunk: number;
    totalChunks: number;
    state: UploadState;
}

export enum UploadState {
    waitingForUpload,
    uploading,
    done,
    failed
}