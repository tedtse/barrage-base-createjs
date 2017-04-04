import eventManager from './utils/event-manager';
import { loadJs } from './utils/load-script';
import { setting, extendSetting } from './setting';
import { STAGE, CANVAS, generateBullet } from './feature';

const SPEED = 12;

function watchPipeStatus (pipe, frequence) {
  let bullets = pipe.children;
  let canvasWidth = CANVAS.width;
  let result = true;
  for (let i = bullets.length; i--;) {
    let bullet = bullets[i];
    if ((canvasWidth - bullet.x - bullet.width) / canvasWidth <= frequence) {
      result = false;
      pipe.status = 'block';
      break;
    }
  }
  if (result) {
    pipe.status = 'idle';
  }
}

// 子弹元素位置校正
function horizontalCorrect (bullet, delta) {
  let canvasWidth = CANVAS.width;
  let width = bullet.width;
  let oldX = bullet.x;
  let newX = ~~(oldX * (width + canvasWidth) / (width + canvasWidth - delta));
  let duration = ~~((bullet.width + newX) * SPEED);
  return {
    x: newX,
    duration: duration
  };
}

function initialize (barrage) {
  require('./initialize')(barrage);
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
   * @param {object} templateOpts - 模板对象参数
   */
  constructor (opts) {
    this.bullets = [];
    this.isLaunching = true;
    this.canLaunch = true;
    extendSetting(opts);
  }
  /**
   * 加载完easeljs、tweenjs后的回调函数
   * @method ready
   */
  ready (callback) {
    if (window.createjs) {
      initialize(this);
      callback();
    }
    let relyOpts = setting.relyOpts;
    loadJs(relyOpts.easeljsPath)
      .then(null, () => {
        throw Error('load the script easeljs failed!');
      })
      .then(() => {
        return loadJs(relyOpts.tweenjsPath);
      })
      .then(null, () => {
        throw Error('load the script tweenjs failed!');
      })
      .then(() => {
        initialize(this);
        callback();
      })
  }
  /**
   * 填充子弹
   * @method fillBullets
   * @param {object} datas - 生成子弹实例的数据
   */
  fillBullets (datas) {
    this.bullets = this.bullets.concat(datas);
  }
  /**
   * 将子弹填充在弹夹的指定位置
   * @method fillBulletAt
   * @param {number} index - 将子弹填充在弹夹的指定位置
   * @param {object} data - 生成子弹实例的数据
   */
  fillBulletAt (index, data) {
    this.bullets.splice(index, 0, data);
  }
  /**
   * 重新填充子弹
   * @method resetBullets
   * @param {object} datas - 生成子弹实例的数据
   */
  resetBullets (datas) {
    this.clearBullets();
    this.fillBullets(datas);
  }
  /**
   * 清空弹夹
   * @method clearBullets
   */
  clearBullets () {
    this.bullets.length = 0;
    if (STAGE) {
      let pipes = STAGE.children;
      pipes.forEach((pipe) => {
        pipe.children.length = 0;
        pipe.status = 'idle';
      })
    }
  }
  /**
   * 获得子弹数量
   * @method getBulletsCount
   */
  getBulletsCount () {
    return this.bullets.length;
  }
  /**
   * 发射子弹
   * @method launch
   * @param {object} pipe - 发射子弹的指定通道实例
   * @param {object} data - 要发射的子弹实例的数据
   */
  launch (data, pipe) {
    if (!pipe) {
      let pipes = STAGE.children;
      pipes.forEach((_pipe) => {
        try {
          watchPipeStatus(_pipe, setting.frequence);
          if (_pipe.status === 'idle') {
            pipe = _pipe;
            throw Error('abort now');
          }
        } catch (e) {}
      })
    }
    generateBullet(data)
      .then((bullet) => {
        let duration = ~~((CANVAS.width + bullet.width) * SPEED);
        pipe.addChild(bullet);
        pipe.status = 'block';
        window.createjs.Tween.get(bullet)
          .wait(~~(Math.random() * 1000))
          .to({x: -bullet.width}, duration)
          .call(() => {
            pipe.removeChild(bullet);
          });
        this.dispatch('barrage.bulletLaunch');
      })
  }
  /**
   * 自动发射子弹
   * @method autoLaunch
   */
  autoLaunch () {
    let that = this;
    window.createjs.Ticker.addEventListener('tick', () => {
      if (!that.canLaunch || !that.isLaunching || !that.bullets.length) {
        return;
      }
      let pipes = STAGE.children;
      pipes.forEach((pipe) => {
        watchPipeStatus(pipe, setting.frequence);
        if (pipe.status === 'idle' && that.bullets.length) {
          that.launch(that.bullets.shift(), pipe);
        }
      })
    })
  }
  /**
   * 继续发射子弹
   * @method goonLaunch
   */
  goonLaunch () {
    this.isLaunching = true;
  }
  /**
   * 停止发射子弹
   * @method stopLaunch
   */
  stopLaunch () {
    this.isLaunching = false;
    if (STAGE) {
      let pipes = STAGE.children;
      pipes.forEach((pipe) => {
        pipe.children.length = 0;
        pipe.status = 'idle';
      })
    }
  }
  /**
   * 继续、停止发射子弹相互切换
   * @method toggleLaunch
   */
  toggleLaunch (isLaunching) {
    if (!STAGE) {
      return;
    }
    this.isLaunching = isLaunching;
    if (isLaunching) {
      window.createjs.Ticker.paused = false;
    } else {
      window.createjs.Ticker.paused = true;
    }
  }
  /**
   * 可发射子弹的
   * @method enableLaunch
   */
  enableLaunch () {
    this.canLaunch = true;
  }
  /**
   * 不可发射子弹的
   * @method disableLaunch
   */
  disableLaunch () {
    this.canLaunch = false;
  }
  /**
   * stage对象水平尺寸改变时的子弹位置调整
   * @method horizontalResize
   * @param {number} delta - stage对象水平尺寸改变量
   */
  horizontalResize (delta) {
    if (!this.bullets.length) {
      return;
    }
    let pipes = STAGE.children;
    pipes.forEach((pipe) => {
      let bullets = pipe.children;
      bullets.forEach((bullet) => {
        let correct = horizontalCorrect(bullet, CANVAS.width, delta);
        window.createjs.Tween.get(bullet, { override: true })
          .to({ x: correct.x })
          .wait(0)
          .to({ x: -bullet.width }, correct.duration)
          .call(() => {
            pipe.removeChild(bullet)
          });
      });
    });
  }
  // 事件管理
  /**
   * 事件管理之事件注册，监听多次
   * @method on
   */
  on () {
    eventManager.on.apply(eventManager, arguments);
  }
  /**
   * 事件管理之事件注册，只监听一次
   * @method once
   */
  once () {
    eventManager.once.apply(eventManager, arguments);
  }
  /**
   * 事件管理之事件分发
   * @method dispatch
   */
  dispatch () {
    eventManager.dispatch.apply(eventManager, arguments);
  }
}

var barrage = new XlBarrage({
  id: 'barrage-stage',
  auto: true,
  frequence: 0.1,
  relyOpts: {
    easeljsPath: '../lib/easeljs-NEXT.min.js',
    tweenjsPath: '../lib/tweenjs-NEXT.min.js'
  },
  tplOpts: {
    template: require('./bullet.tpl'),
    styleSheet: require('./bullet-css.js')
  }
});
barrage.ready(() => {
  let datas = [
    { type: 'new', comment: '蛤蛤蛤，居然有这等奇葩' },
    { type: 'hot', comment: '舅扶你' },
    { type: 'new', comment: '就差1亿！王健林险胜李嘉诚夺华人首富 马云差距拉大' },
    { type: 'new', comment: '666' },
    { type: 'hot', comment: '外行看热闹，内行看门道' },
    { type: 'new', comment: '红色特别版iPhone是对中国消费者的一种谄媚吗' }
  ];
  barrage.fillBullets(datas);
});

export default XlBarrage;
