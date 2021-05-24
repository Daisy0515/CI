// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
    install(Vue, options) {
        Vue.prototype.getPdf = function(title) {
            let element = document.querySelector('#pdfDom'); // 这个dom元素是要导出pdf的div容器
            const scale = 1
            setTimeout(() => {
                html2Canvas(element, {
                    scale
                }).then(function(canvas) {
                    const contentWidth = canvas.width / scale
                    const contentHeight = canvas.height / scale
                    const pdf = new JsPDF('', 'pt', [contentWidth, contentHeight + 300])
                    const pageData = canvas.toDataURL('image/jpeg', 1.0)

                    pdf.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight)
                    pdf.save(title + '.pdf');
                });
            }, 0);
        }
        Vue.prototype.getJPG = function() {
            let element = document.querySelector('#pdfDom'); // 这个dom元素是要导出pdf的div容器
            html2Canvas(element).then(function (canvas) {
                let canvas2JPG = document.createElement('canvas')
                canvas.height = canvas.height * 3
                canvas2JPG.href = canvas.toDataURL("image/jpeg", 0.92).replace("image/jpeg", "image/octet-stream");
                canvas2JPG.download = 'image.jpg';
                canvas2JPG.click();
            })
        }
    }
}