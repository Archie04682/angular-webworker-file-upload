/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  if (data.terminate) {
    return;
  }

  if (!data.url && !data.file && !data.chunkSize && !data.bearer) return;
  const file: File = data.file;
  const chunkSize: number = data.chunkSize;
  const uploadId = generateId(file.name);
  const url: URL | string = data.url;
  const headers = {
    'Authentication': `Bearer ${data.bearer}`,
    'Content-Part': ''
  };
  const totalChunks = Math.ceil(file.size / chunkSize);

  uploadChunk(url, headers, file, 0, chunkSize, totalChunks, uploadId, (uploadedChunk: number) => {
    postMessage({uploadedChunk: uploadedChunk, totalChunks: totalChunks});
  });

});

function uploadChunk(url: URL | string, headers: {[key: string]: any}, 
  file: File, currentChunk: number, totalChunks: number,chunkSize: number, uploadId: string, 
  callback: (uploadedChunk: number) => void) {
  const start = currentChunk * chunkSize;
  const chunk = createChunk(file, start, chunkSize);
  const form = createForm(uploadId, file.name, chunk);
  headers['Content-Part'] = createContentRangeHeaderValue(currentChunk, totalChunks);
  upload(url, form, headers, () => {
    currentChunk++;
    callback(currentChunk);
    if (currentChunk < totalChunks) {
      uploadChunk(url, headers, file, currentChunk, totalChunks, chunkSize, uploadId, callback);
    } else {
      return;
    }
  });
}

function generateId(filename: string): string {
  return `${filename}-${new Date().getTime()}`;
}

function createChunk(file: File, start: number, chunkSize: number): Blob {
  const chunkEnd = Math.min(start + chunkSize, file.size);
  return file.slice(start, chunkEnd);
}

function createForm(uploadId: string, filename: string, chunk: Blob): FormData {
  const form = new FormData();
  form.append('uploadId', uploadId);
  form.append('file', chunk, filename);

  return form;
}

function createContentRangeHeaderValue(currentChunk: number, totalChunks: number): string {
  return `${currentChunk}/${totalChunks}`;
}

function upload(url: string | URL, chunkForm: FormData, headers: {[key: string]: any}, callback: () => void) {
  setTimeout(() => {
    callback();
  }, 200);
  // const request = new XMLHttpRequest();
  // request.open('POST', url, true);
  // for (const header in headers) {
  //   request.setRequestHeader(header, headers[header])
  // }
  
  // request.onload = (_) => {
  //   callback();
  // };

  // request.send(chunkForm);
}