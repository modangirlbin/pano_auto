/* ===========================================================
   * jquery-panorama_viewer.js v1
   * ===========================================================
   * Copyright 2014 Pete Rojwongsuriya.
   * http://www.thepetedesign.com
   *
   * Embed Panorama Photos on your website
   * with Panorama Viewer
   *
   * https://github.com/peachananr/panorama_viewer
   * ===========================================================
   * 2020.03.03
   * 상기 원본소스 수정작업한 버전입니다.
   * ========================================================== */

  !function($){
  
    $.defaultOption = {
      animationTime: 700,
      easing: "ease-out",
      autoPlay : false
    };
  
    $.fn.touchHandler = function(event) {
      
      var touches = event.changedTouches,
          first = touches[0],
          type = "";
      
      switch(event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove" : type = "mousemove"; break;        
        case "touchend"  : type = "mouseup"; break;
        default: return;
      }
       
      var simulatedEvent = document.createEvent("MouseEvent"),
          mult = 3;
      
      simulatedEvent.initMouseEvent(type, true, true, window, 1,
                    first.screenX, first.screenY,
                    (first.clientX * mult), (first.clientY * mult), false,
                    false, false, false, 0/*left*/, null);
      first.target.dispatchEvent(simulatedEvent);
    }
  
    $.fn.panorama_viewer = function(options){
      
      document.addEventListener("touchstart", $.fn.touchHandler, true);
      document.addEventListener("touchmove", $.fn.touchHandler, true);
      document.addEventListener("touchend", $.fn.touchHandler, true);
      document.addEventListener("touchcancel", $.fn.touchHandler, true);
      
      return this.each(function(){
        var settings = $.extend({}, $.defaultOption, options),
            el = $(this);
        
        el.find("> img").load(function () {
          
          el.find("> img").addClass("pv-pano");
          el.addClass("pv-container").wrapInner("<div class='pv-inner pv-animating'></div>");
          
          el.find(".pv-animating").css({
            "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
            "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
            "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
            "transition": "all " + settings.animationTime + "ms " + settings.easing
          })
          
          var imgSrc = el.find(".pv-pano").attr("src"),
              width = el.find(".pv-pano").width(),
              height = el.find(".pv-pano").height();
          
          el.find(".pv-inner").css({
            height: height,
            width: width,
            background: "url(" + imgSrc + ") 0 0 repeat",
            "background-size": "cover"
          })
          
          var $bg = el.find(".pv-inner"),
              elbounds = {
                w: parseInt($bg.parent().width()),
                h: parseInt($bg.parent().height())
              },
              bounds = {w: width - elbounds.w, h: height - elbounds.h},
              origin = {x: 0, y: 0},
              start = {x: 0, y: 0},
              movecontinue = false;
  
          function auto(){       
            var _auto;
            return {
              play: function(){
                if(settings.autoPlay == true) {
                  _auto = setInterval(autoplay, 100);
                  function autoplay(){
                    var bgX = Number($bg.css('background-position-x').slice(0, -2));
                    $bg.css('background-position-x', bgX - 10 + "px");
                  };
                  return _auto;
                }
              },
              stop: function(){
                if(settings.autoPlay == true) {
                  clearInterval(_auto);
                }
              }
            }
          }     
  
          function move (e){        
            var inbounds = {x: false, y: false},
                offset = {
                  x: start.x - (origin.x - e.clientX),
                  y: start.y - (origin.y - e.clientY)
                };
  
            inbounds.x = true;
  
            if (movecontinue && inbounds.x) {
              start.x = offset.x;
              start.y = 0;
            }
  
            $(this).css('background-position', start.x + 'px ' + start.y + 'px');
            
            origin.x = e.clientX;
            origin.y = e.clientY;
            
            e.stopPropagation();
            return false;
          }
  
          var toggleAuto = auto();
          
          function handle (e){
            movecontinue = false;
            $bg.off('mousemove', move);
            
            if (e.type == 'mousedown') {
              toggleAuto.stop();
              origin.x = e.clientX;
              origin.y = e.clientY;
              movecontinue = true;
              $bg.on('mousemove', move);
            } else {
              $(document.body).focus();
              toggleAuto.play();
            }
            
            e.stopPropagation();
            return false;
          }
    
          $bg.on('mousedown mouseup mouseleave', handle);
          if(settings.autoPlay == true){
            toggleAuto.play(); 
          }
          el.find(".pv-pano").hide()
        })      
      }); 
    }
  }(window.jQuery);