   // 出问题的自动设置fontsize
    // (function (){
    //     const setRem = () => {
    //         document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
    //         console.log(document.documentElement.style.fontSize)
    //     }
    //     document.addEventListener('DOMContentLoaded', setRem, false)
    //     window.addEventListener("orientationchange", setRem, false)
    // })()

// http://172.27.193.36:5000/
//自动获取fontsize
(function (doc, win) {
      var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    docEl.style.fontSize = clientWidth / 10 + 'px';
    // console.log(docEl.style.fontSize)
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
})(document, window);
var ip = "http://192.168.1.135:5000/"