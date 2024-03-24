export function saveTextAsFile(textTowrite: string, fileNameToSaveAs: string, fileType: any) {
  //提供文本和文件类型用于创建一个Blob对象
  let textFileAsBlob = new Blob([textTowrite], { type: fileType });
  //创建一个 a 元素
  let downloadLink = document.createElement('a');
  //指定下载过程中显示的文件名
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = 'Download File';
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  //模式鼠标左键单击事件
  downloadLink.click();
  downloadLink.remove();
}
