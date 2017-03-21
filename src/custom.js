var TextWrap

export function generateBullet (canvasWidth, data) {
  if (!TextWrap) {
    CodeWrap()
  }
  let color = data.type === 'hot' ? '#ffd38e' : 'rgba(255,255,255,.75)'
  let text = new TextWrap(data.comment, '15px Microsoft YaHei', color)
  let bullet = new window.createjs.Container()
  bullet.set({
    name: 'bullet',
    x: canvasWidth,
    y: 0
  })
  return new Promise((resolve, reject) => {
    if (data.type === 'hot') {
      let iconSheet = new window.Image()
      // 图片加载成功
      iconSheet.addEventListener('load', () => {
        let icon = generateHotIcon(iconSheet)
        text.set({ x: 20, y: 0 })
        bullet.set({ width: text.getMeasuredWidth() + 20 })
        bullet.addChild(icon)
        bullet.addChild(text)
        resolve(bullet)
      })
      // 图片加载失败
      iconSheet.addEventListener('error', () => {
        text.set({ x: 0, y: 0 })
        bullet.set({ width: text.getMeasuredWidth() })
          .addChild(text)
        resolve(bullet)
      })
      // iconSheet.src = require('assets/img/spr-page.png')
    } else {
      text.set({ x: 0, y: 0 })
      bullet.set({ width: text.getMeasuredWidth() })
        .addChild(text)
      resolve(bullet)
    }
  })
}

function generateHotIcon (iconSheet) {
  let data = { images: [iconSheet], frames: {width: 20, height: 20, count: 100} }
  let spriteSheet = new window.createjs.SpriteSheet(data)
  let icon = new window.createjs.Sprite(spriteSheet)
  icon.set({ x: 0, y: 0 })
  icon.gotoAndStop(70)
  return icon
}

function CodeWrap () {
  TextWrap = function (text, font, color) {
    // 去掉换行
    text = text.replace(/[\r\n]/g, '');
    this.Text_constructor(text, font, color);
    this.hitArea = new window.createjs.Shape();
    this.textBaseline = 'top';

    this.addEventListener('rollover', this);
    this.addEventListener('rollout', this);
  }
  window.createjs.extend(TextWrap, window.createjs.Text)
  TextWrap.prototype.draw = function (ctx, ignoreCache) {
    this.Text_draw(ctx, ignoreCache);
    this.hitArea.graphics.clear().beginFill('#ffffff').drawRect(0, 0, this.getMeasuredWidth(), this.getMeasuredHeight());
  }
  TextWrap.prototype.handleEvent = function (evt) {}
  window.createjs.promote(TextWrap, 'Text');
}
