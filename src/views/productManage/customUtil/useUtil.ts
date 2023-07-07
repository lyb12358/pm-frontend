export function useUtil() {
  //下载图片
  function downloadIamge(imgsrc, name) {
    //下载图片地址和图片名
    const image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context?.drawImage(image, 0, 0, image.width, image.height)
      const url = canvas.toDataURL('image/jpeg') //得到图片的base64编码数据'
      const a = document.createElement('a') // 生成一个a元素
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }) // 创建一个单击事件
      a.download = name || 'photo' // 设置图片名称
      a.href = url // 将生成的URL设置为a.href属性
      a.dispatchEvent(event) // 触发a的单击事件
    }
    image.src = imgsrc
  }
  // public method to download file
  function fileDownload(data, name) {
    if (!data) {
      return
    }
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', name)
    document.body.appendChild(link)
    link.click()
    // release url object
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }

  return { downloadIamge, fileDownload }
}
