"use strict";

bespoke.plugins.delaySrc = function(deck, options) {
  var delayedObjects = deck.slides.map(function(slide) {
    return [].slice.call(slide.querySelectorAll('[data-bespoke-delay-src]'), 0);
  });

  deck.on('activate', function(slide) {
    delayedObjects[slide.index].map(function(object) {
      object.setAttribute('src', object.dataset.bespokeDelaySrc);
      requestAnimationFrame(function() {
        object.classList.add('scrolldown');
      })
    })
  });

  deck.on('deactivate', function(slide) {
    delayedObjects[slide.index].map(function(object) {
      object.setAttribute('src', '');
      object.classList.remove('scrolldown');
    })
  })
}

bespoke.plugins.startXGif = function(deck, options) {
  var gifs = deck.slides.map(function(slide) {
    return [].slice.call(slide.querySelectorAll('x-gif'), 0);
  });

  var setStopped = function(stopped) {
    return function(slide) {
      gifs[slide.index].map(function(gif) {
        stopped ? gif.setAttribute('stopped', '') : gif.removeAttribute('stopped');
        slide.slide.classList.remove('x-gif-finished');
        if (!stopped) gif.addEventListener('x-gif-finished', function() {
            slide.slide.classList.add('x-gif-finished');
          })
      });
    }
  };

  deck.on('activate', setStopped(false));
  deck.on('deactivate', setStopped(true));
};

bespoke.plugins.steps = function(deck, options) {
  deck.on('activate', function(e) {
    // if(e.slide.id==='projecttime'){
    //     // build chart

    // }
    // $('.bespoke-inactive').find('.animate').removeClass('animated');

    $(e.slide).find('.animate').each(function() {
      $(this).removeClass('animated');
      this.outerHTML = this.outerHTML.replace('animate', 'animate animated');
    });
  });
  deck.on('next', function(e) {
    window.userInitiated = true;
    return true;
  });
};

bespoke.from('article', {
  keys: true,
  touch: true,
  scale: false,
  hash: true,
  state: true,
  bullets: '.bullet',
  delaySrc: true,
  startXGif: true,
  steps: true
});

window.addEventListener('resize', function() {
  [].forEach.call(document.querySelectorAll('x-gif'), function(elem) {
    elem.relayout();
  });
})

var brightness = 0;
document.addEventListener('keyup', function(e) {
  var setBrightness = function() {
    document.querySelector('article').style.webkitFilter = "brightness(" + (1 + brightness) + ") contrast(" + (1 + brightness * 0.25) + ")"
  }
  if (e.shiftKey) {
    if (e.keyCode == 38) {
      brightness += 0.1;
      setBrightness(brightness);
    } else if (e.keyCode == 40) {
      brightness -= 0.1;
      setBrightness(brightness);
    } else if (e.keyCode == 48) {
      brightness = 0;
      setBrightness(brightness);
    }
  }
  console.log(e.keyCode);
  if (e.keyCode == 82) { // r
    document.querySelector('.rotate').classList.toggle('on');
  }
});
$.notify.addStyle("eivy", {
  html: "<div>" +
    "<div class='image' data-notify-html='image'/>" +
    "<div class='text-wrapper'>" +
    "<div class='title' data-notify-html='title'/>" +
    "<div class='text' data-notify-html='text'/>" +
    "</div>" +
    // "<div class='buttons'>" +
    // "<button class='yes' data-notify-text='button'></button>" +
    // "</div>" +
    "<div class='clearfix'></div>" +
    "</div>"
});
$(document).on('click', '.notifyjs-eivy-base .yes', function() {
  //hide notification
  $(this).trigger('notify-hide');
  // start navigating
  bespoke.next();
  setInterval(function() {
    bespoke.next();
  }, 2000);
});

setTimeout(function() {
  if (!window.userInitiated) {
    // growl
    $('#introtip').notify({
      title: 'Swipe or use arrow keys to navigate &rarr;',
      button: 'Automate this!'
    }, {
      style: 'eivy',
      className: 'base',
      autoHide: false,
      arrowShow: false,
      position: "left bottom"
    });
    $('#audio').notify({
      text: '(optionally, press play for soundtrack)'
    }, {
      style: 'eivy',
      className: 'base',
      autoHide: false
    });
  }
}, 2000);

$('.animate').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
  $(this).removeClass('animated');
});
/*
var myMyo = Myo.create();

myMyo.on('fingers_spread', function(edge){
    if(!edge) return;
    console.log('spread');
    // unlock for 5 minutes
    //myMyo.vibrate();
});

myMyo.on('wave_out', function(edge){
    if(!edge) return;
    bespoke.next();
    myMyo.unlock(60000);
    //myMyo.vibrate();
});
myMyo.on('wave_in', function(edge){
    if(!edge) return;
    bespoke.prev();
    //myMyo.vibrate();
});
var audio = false,
    audioOn = false;
myMyo.on('fist', function(edge){
    if(!edge) return;
    if(!audio){
      audio = document.getElementById('audio');
    }
    if(audioOn){
      audioOn = false;
      audio.pause()
    }else{
      audioOn = true;
      audio.play()
    }
    //myMyo.vibrate();
});
*/
