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
});

// LOGO Animation
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(document.body)

fetch('./vendor/img/welcome.svg')
  .then((response) => {
    return response.text()
  }).then((svg) => {
    let doc = document.implementation.createDocument('', '', null)
    let div = doc.createElement('div')
    div.innerHTML = svg

    let t = 0
    let startOver
    let clearT = function() {
      t = 0
      setEnding(logo, 0)
      startOver = _.after(60, clearT)
    }

    const logo = two.interpret(div.querySelector('svg'))
    logo.subdivide()
    logo.noFill()
    logo.center().translation.set(two.width / 2, two.height / 3)
    logo.distances = calculateDistances(logo)
    logo.total = 0
    logo.stroke = '#40351b'
    logo.linewidth = 5
    _.each(logo.distances, function(d) {
      logo.total += d
    })

    clearT()

    two
      .appendTo(document.getElementById('logo'))
      .bind('update', function() {
        if (t < 0.9999) {
          t += 0.00625
        } else {
          // startOver()
        }

        setEnding(logo, t)

      }).play()
  })

function calculateDistances(group) {
  return _.map(group.children, function(child) {
    var d = 0, a;
    _.each(child.vertices, function(b, i) {
      if (i > 0) {
        d += a.distanceTo(b)
      }
      a = b
    })
    return d
  })
}

function setEnding(group, t) {
  var i = 0
  var traversed = t * group.total
  var current = 0

  _.each(group.children, function(child) {
    var distance = group.distances[i]
    var min = current
    var max = current + distance
    var pct = cmap(traversed, min, max, 0, 1)
    child.ending = pct
    current = max
    i++
  })
}

function clamp(v, min, max) {
  return Math.max(Math.min(v, max), min);
}

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}

function cmap(v, i1, i2, o1, o2) {
  return clamp(map(v, i1, i2, o1, o2), o1, o2);
}
