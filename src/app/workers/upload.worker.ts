/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  if (!data.url && !data.file && !data.chunkSize && !data.bearer) return;
  const file: File = data.file;
  const chunkSize: number = data.chunkSize;
  const uploadId = generateId(file.name);
  const url: URL | string = data.url;
  const headers = {
    'Authentication': `Bearer ${data.bearer}`,
    'Content-Part': ''
  };

  uploadChunk(url, headers, file, 0, chunkSize, uploadId, (start, total) => {
    postMessage({start: start, total: total});
  });

});

function uploadChunk(url: URL | string, headers: {[key: string]: any}, file: File, start: number, chunkSize: number, uploadId: string, callback: (uploaded: number, total: number) => void) {
  const chunk = createChunk(file, start, chunkSize);
  const form = createForm(uploadId, file.name, chunk);
  headers['Content-Part'] = createContentRangeHeaderValue(start, chunk.size, file.size);
  upload(url, form, headers, () => {
    start += chunk.size;
    callback(start, file.size);
    if (start < file.size) {
      uploadChunk(url, headers, file, start, chunkSize, uploadId, callback);
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

function createContentRangeHeaderValue(start: number, length: number, total: number): string {
  return `${start}-${start + length - 1}/${total}`;
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