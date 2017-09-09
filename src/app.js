import './style/index.less'
import 'whatwg-fetch'
import Parallax from 'parallax-js'

// Switch Page
const scenes = [
  {
    show: function() {
      $('.scene:nth-child(1)').show()
    },
    hide: function() {
      $('.scene:nth-child(1)').hide()
    }
  },
  {
    show: function() {
      $('.scene:nth-child(2) .chloe').animate({
        bottom: 0
      }, 600, 'ease')
      $('.scene:nth-child(2) .pop1')
        .show()
        .animate('flipInX', 600, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(2) .pop1').hide()
      $('.scene:nth-child(2) .chloe').animate({
        bottom: '-100%'
      }, 600, 'ease')
    }
  },
  {
    show: function() {
      $('.scene:nth-child(3) .quark').animate({
        bottom: 0
      }, 600, 'ease')
      $('.scene:nth-child(3) .pop2')
        .show()
        .animate('flipInX', 600, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(3) .pop2').hide()
      $('.scene:nth-child(3) .quark').animate({
        bottom: '-100%'
      }, 600, 'ease')
    }
  },
  {
    show: function() {
      $('.scene:nth-child(4) .group').animate({
        bottom: 0
      }, 600, 'ease')
      $('.scene:nth-child(4) .pop3')
        .show()
        .animate('flipInX', 600, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(4) .pop3').hide()
      $('.scene:nth-child(4) .group').animate({
        bottom: '-100%'
      }, 600, 'ease')
    }
  },
  {
    show: function() {
      $('.scene:nth-child(5) .pop4')
        .show()
        .animate('rotateIn', 600, 'ease')
    },
    hide: function() {
      $('.scene:nth-child(5) .pop4').hide()
    }
  }
]

const max = 5
let index = 0
$('.scenes').on('swipeLeft', (e) => {
  if (index === (max - 1)) return
  scenes[index].hide()
  scenes[++index].show()
})
$('.scenes').on('swipeRight', (e) => {
  if (index === 0) return
  scenes[index].hide()
  scenes[--index].show()
})

// Background Animation
const scene = document.getElementById('bg')
const parallax = new Parallax(scene)

// LOGO Animation
const two = new Two({
  type: Two.Types.svg,
  width: 332,
  height: 959
}).appendTo(document.body)

fetch('/vendor/img/logo.svg')
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
    logo.center().translation.set(two.width / 2, two.height / 2)
    logo.distances = calculateDistances(logo)
    logo.total = 0
    logo.stroke = '#f42843'
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
