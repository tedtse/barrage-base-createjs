import eventManager from './utils/event-manager'
import loadJs from './utils/load-script'
import { generateBullet } from './custom'
import { setting, extendSetting } from './setting'
import Stage from './createjs-element/Stage'

const SPEED = 12;
var defaultPipeOpts = { height: 0, marginTop: 0, marginBottom: 0 };

function watchPipeStatus (pipe, canvasWidth, frequence) {
  let bullets = pipe.children
  let result = true
  for (let i = bullets.length; i--;) {
    let bullet = bullets[i]
    if ((canvasWidth - bullet.x - bullet.width) / canvasWidth <= frequence) {
      result = false
      pipe.status = 'block'
      break
    }
  }
  if (result) {
    pipe.status = 'idle'
  }
}

// 子弹元素位置校正
function horizontalCorrect (bullet, canvasWidth, delta) {
  let width = bullet.width
  let oldX = bullet.x
  let newX = ~~(oldX * (width + canvasWidth) / (width + canvasWidth - delta))
  let duration = ~~((bullet.width + newX) * SPEED)
  return {
    x: newX,
    duration: duration
  }
}

function generatePipes (opts) {
  let result = []
  for (let i = 0; i < opts.number; i++) {
    let pipe = new window.createjs.Container()
    pipe.set({
      id: i,
      name: 'pipe',
      status: 'idle',
      width: opts.width,
      height: opts.height,
      x: 0,
      y: i * opts.height + (i + 1) * opts.marginTop + (Math.max(0, (i - 1))) * opts.marginBottom
    })
    result.push(pipe)
  }
  return result
}

/**
 * 弹幕函数
 * @module XlBarrage
 */
class XlBarrage {
  /**
   * 构造函数
   * @method constructor
   * @param {string} id - Canvas Dom的id
   * @param {boolean} auto - 是否自动发射子弹，默认为false
   * @param {number} frequence - 发射子弹的频率，是指子弹经过整个stage宽度的百分比，如0.15
   * @param {object} relyOpts - easeljs、tweenjs的路径
   * @param {object} pipeOpts - 子弹通道对象参数
   */
  constructor (opts) {
    this.bullets = [];
    this.isLaunching = true;
    this.canLaunch = true;
    extendSetting(opts);
  }
  /**
   * 初始化，在ready的回调中调用
   * @method initialize
   */
  initialize () {
    this.stage = new Stage(setting.id);
    this.canvas = document.getElementById(setting.id);
    if (setting.auto) {
      this.autoLaunch()
    }
    // 初始化pipes
    let pipeOpts = Object.assign({ ...defaultPipeOpts, ...setting.pipeOpts, width: this.canvas.width })
    let pipes = generatePipes(pipeOpts)
    pipes.forEach((pipe) => {
      this.stage.addChild(pipe)
    })
  }
  /**
   * 加载完easeljs、tweenjs后的回调函数
   * @method ready
   */
  ready (callback) {
    if (window.createjs) {
      this.initialize()
      callback()
    }
    let relyOpts = setting.relyOpts
    loadJs(relyOpts.easeljsPath)
      .then(null, () => {
        throw Error('load the script easeljs failed!')
      })
      .then(() => {
        return loadJs(relyOpts.tweenjsPath)
      })
      .then(null, () => {
        throw Error('load the script tweenjs failed!')
      })
      .then(() => {
        this.initialize()
        callback()
      })
  }
  /**
   * 填充子弹
   * @method fillBullets
   * @param {object} datas - 生成子弹实例的数据
   */
  fillBullets (datas) {
    this.bullets = this.bullets.concat(datas)
  }
  /**
   * 将子弹填充在弹夹的指定位置
   * @method fillBulletAt
   * @param {number} index - 将子弹填充在弹夹的指定位置
   * @param {object} data - 生成子弹实例的数据
   */
  fillBulletAt (index, data) {
    this.bullets.splice(index, 0, data)
  }
  /**
   * 重新填充子弹
   * @method resetBullets
   * @param {object} datas - 生成子弹实例的数据
   */
  resetBullets (datas) {
    this.clearBullets()
    this.fillBullets(datas)
  }
  /**
   * 清空弹夹
   * @method clearBullets
   */
  clearBullets () {
    this.bullets.length = 0
    if (this.stage) {
      let pipes = this.stage.children
      pipes.forEach((pipe) => {
        pipe.children.length = 0
        pipe.status = 'idle'
      })
    }
  }
  /**
   * 获得子弹数量
   * @method getBulletsCount
   */
  getBulletsCount () {
    return this.bullets.length
  }
  /**
   * 发射子弹
   * @method launch
   * @param {object} pipe - 发射子弹的指定通道实例
   * @param {object} data - 要发射的子弹实例的数据
   */
  launch (data, pipe) {
    let canvasWidth = this.canvas.width
    generateBullet(canvasWidth, data)
      .then((bullet) => {
        let duration = ~~((canvasWidth + bullet.width) * SPEED)
        pipe.addChild(bullet)
        pipe.status = 'block'
        window.createjs.Tween.get(bullet)
          .wait(~~(Math.random() * 1000))
          .to({x: -bullet.width}, duration)
          .call(() => {
            pipe.removeChild(bullet)
          })
        this.dispatch('barrage.bulletLaunch')
      })
  }
  /**
   * 自动发射子弹
   * @method autoLaunch
   */
  autoLaunch () {
    let that = this
    window.createjs.Ticker.addEventListener('tick', () => {
      if (!that.canLaunch || !that.isLaunching || !that.bullets.length) {
        return
      }
      let pipes = that.stage.children
      pipes.forEach((pipe) => {
        watchPipeStatus(pipe, that.canvas.width, setting.frequence)
        if (pipe.status === 'idle' && that.bullets.length) {
          that.launch(that.bullets.shift(), pipe)
        }
      })
    })
  }
  /**
   * 继续发射子弹
   * @method goonLaunch
   */
  goonLaunch () {
    this.isLaunching = true
  }
  /**
   * 停止发射子弹
   * @method stopLaunch
   */
  stopLaunch () {
    this.isLaunching = false
    if (this.stage) {
      let pipes = this.stage.children
      pipes.forEach((pipe) => {
        pipe.children.length = 0
        pipe.status = 'idle'
      })
    }
  }
  /**
   * 继续、停止发射子弹相互切换
   * @method toggleLaunch
   */
  toggleLaunch (isLaunching) {
    if (!this.stage) {
      return
    }
    this.isLaunching = isLaunching
    if (isLaunching) {
      window.createjs.Ticker.paused = false
    } else {
      window.createjs.Ticker.paused = true
    }
  }
  /**
   * 可发射子弹的
   * @method enableLaunch
   */
  enableLaunch () {
    this.canLaunch = true
  }
  /**
   * 不可发射子弹的
   * @method disableLaunch
   */
  disableLaunch () {
    this.canLaunch = false
  }
  /**
   * stage对象水平尺寸改变时的子弹位置调整
   * @method horizontalResize
   * @param {number} delta - stage对象水平尺寸改变量
   */
  horizontalResize (delta) {
    if (!this.bullets.length) {
      return
    }
    let canvasWidth = this.canvas.width
    let pipes = this.stage.children
    pipes.forEach((pipe) => {
      let bullets = pipe.children
      bullets.forEach((bullet) => {
        let correct = horizontalCorrect(bullet, canvasWidth, delta)
        window.createjs.Tween.get(bullet, { override: true })
          .to({x: correct.x})
          .wait(0)
          .to({x: -bullet.width}, correct.duration)
          .call(() => {
            pipe.removeChild(bullet)
          })
      })
    })
  }
  // 事件管理
  /**
   * 事件管理之事件注册，监听多次
   * @method on
   */
  on () {
    eventManager.on.apply(eventManager, arguments)
  }
  /**
   * 事件管理之事件注册，只监听一次
   * @method once
   */
  once () {
    eventManager.once.apply(eventManager, arguments)
  }
  /**
   * 事件管理之事件分发
   * @method dispatch
   */
  dispatch () {
    eventManager.dispatch.apply(eventManager, arguments)
  }
}

export default XlBarrage
