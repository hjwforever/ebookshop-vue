import JsFileDownloader from 'js-file-downloader'

// 保存到本地并自动点击
export function saveAs(data, name) {
  const urlObject = window.URL || window.webkitURL || window
  const export_blob = new Blob([data])
  const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
  save_link.href = urlObject.createObjectURL(export_blob)
  save_link.download = name
  save_link.click()
}
// 下载含有url的文件
export function downloadUrlFile(url, fileName) {
  const url2 = url.replace(/\\/g, '/')
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url2, true)
  xhr.responseType = 'blob'
  // xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
  // 为了避免大文件影响用户体验，建议加loading
  xhr.onload = () => {
    if (xhr.status === 200) {
      // 获取文件blob数据并保存
      saveAs(xhr.response, fileName)
    }
  }
  xhr.send()
}

export function downloadFileByUrl(url) {
  new JsFileDownloader({
    headers: [
      { name: 'Authorization', value: 'Bearer ABC123...' }
    ],
    // autoStart: true,
    url,
    // method: 'GET',
    process: process,
    forceDesktopMode: true,
    // withCredentials: true,
    nameCallback: function(name) {
      return 'ebookshop-' + decodeURI(name)
    }
  })
    .then(function() {
      // Called when download ended

    })
    .catch(function(error) {
      // Called when an error occurred
      console.log(error)
    })
}

function process(event) {
  if (!event.lengthComputable) return // guard
  var downloadingPercentage = Math.floor(event.loaded / event.total * 100)
  console.log(downloadingPercentage)
// what to do ...
}
