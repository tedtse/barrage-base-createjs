module.exports = {
  '[role="bullet"]': {
  },
  '[role="hot-icon"]': {
    images: ['assets/img/spr-page.png'],
    frames: {
      width: 20,
      height: 20,
      count: 100
    },
    x: 0,
    y: 0,
    gotoAndStop: 70
  },
  '[role="hot-comment"], [role="new-comment"]': {
    font: '15px Microsoft YaHei',
    x: 20,
    y: 0
  },
  '[role="hot-comment"]': {
    color: '#ffd38e'
  },
  '[role="new-comment"]': {
    color: 'rgba(255, 255, 255, .75)'
  }
};