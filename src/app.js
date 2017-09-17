import './style/index.less'
import 'whatwg-fetch'

// Switch Page
const scenes = [
  {
    show: function() {
      $('.scene:nth-child(1)')
        .show()
        .animate('flipInY', 600, 'ease')
      $('#bg .left').animate({
        left: '-10%'
      }, 600, 'ease')
      $('#bg .right').animate({
        right: '-10%'
      }, 600, 'ease')
      $('#bg .bottom').animate({
        bottom: 0
      }, 600, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(1)').hide()
    }
  },
  {
    show: function() {
      $('.scene:nth-child(2) .chloe')
        .show()
        .animate('flipInX', 600, 'ease')
      $('.scene:nth-child(2) .pop')
        .show()
        .animate('fadeIn', 2000, 'ease')
      $('#bg .left').animate({
        left: '-100%'
      }, 600, 'ease')
      $('#bg .right').animate({
        right: '-100%'
      }, 600, 'ease')
      $('#bg .bottom').animate({
        bottom: '-100%'
      }, 600, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(2) .chloe')
        .hide()
      $('.scene:nth-child(2) .pop')
        .hide()
    }
  },
  {
    show: function() {
      $('.scene:nth-child(3) .quark')
        .show()
        .animate('flipInX', 600, 'ease')
      $('.scene:nth-child(3) .pop')
        .show()
        .animate('fadeIn', 2000, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(3) .quark').hide()
      $('.scene:nth-child(3) .pop').hide()
    }
  },
  {
    show: function() {
      $('.scene:nth-child(4) .group')
        .show()
        .animate('flipInX', 600, 'ease')
      $('.scene:nth-child(4) .pop')
        .show()
        .animate('fadeIn', 2000, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(4) .group').hide()
      $('.scene:nth-child(4) .pop').hide()
    }
  },
  {
    show: function() {
      $('.scene:nth-child(5) .pop')
        .show()
        .animate('fadeIn', 2000, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(5) .pop').hide()
    }
  },
  {
    show: function() {
      $('.scene:nth-child(6) .white')
        .show()
        .animate('zoomIn', 600, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(6) .white').hide()
    }
  }
]

const max = 6
let index = 0
$('.scenes').swipe( {
  swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
    console.log("You swiped " + direction + " with " + fingerCount + " fingers")
    if (direction === 'left') {
      if (index === (max - 1)) return
      scenes[index].hide()
      scenes[++index].show()
    }
    if (direction === 'right') {
      if (index === 0) return
      scenes[index].hide()
      scenes[--index].show()
    }
  },
  threshold:0,
  fingers:'all'
})
