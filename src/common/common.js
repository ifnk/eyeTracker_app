// 引入lodash
import _ from 'lodash'

// 切换全屏方法
const fullScreen = (isOpen, target) => {
  let dom = target || void 0
  let openList = ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullScreen', 'msRequestFullscreen']
  let cancelList = ['exitFullscreen', 'mozCancelFullScreen', 'webkitCancelFullScreen']
  let fn = void 0
  if (isOpen) {
    fn = _.find(openList, (n) => {
      return Boolean(dom[n])
    })
    fn && dom[fn]()
  } else {
    fn = _.find(cancelList, (n) => {
      return Boolean(document[n])
    })
    fn && document[fn]()
  }
}

/**
 * [isFullscreen 判断浏览器是否全屏]
 * @return [全屏true,不全屏返回false]
 */
const isFullscreen = params => {
  return window.innerWidth === screen.width && window.innerHeight === screen.height
}

/**
 * [isFullscreenEnabled 判断全屏模式是否是可用]
 * @return [支持则返回true,不支持返回false]
 */
const isFullscreenEnabled = params => {
  return document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.msFullscreenEnabled || false
}

export default {
  fullScreen,
  isFullscreenEnabled,
  isFullscreen
}

// // 触发全屏
// fullScreen(e) {
//   if (!this.isFullScreen()) {
//     this.fullScreen(true, document.body)
//   } else {
//     this.fullScreen(false)
//   }
// }
