
var judgeDeviceType = function () {
    var ua = window.navigator.userAgent.toLocaleLowerCase();
    var isIOS = /iphone|ipad|ipod/.test(ua);
    var isAndroid = /android/.test(ua);
    return {
        isIOS: isIOS,
        isAndroid: isAndroid
    }
}()

export function listenKeybord(data:any) {
    if (judgeDeviceType.isAndroid) {
        var originHeight = document.documentElement.clientHeight || document.body.clientHeight;
        window.addEventListener('resize', function () {
            var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
            if (originHeight < resizeHeight) {
                data("off")
                console.log('Android 键盘收起啦！');
                // Android 键盘收起后操作
            } else {
                data('on')
                console.log('Android 键盘弹起啦！');
                // Android 键盘弹起后操作
            }
            originHeight = resizeHeight;
        }, false)
    }
}


export default {
    listenKeybord

}