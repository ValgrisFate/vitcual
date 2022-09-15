/*
* File: jquery.barfiller.js
* Version: 1.0.1
* Description: A plugin that fills bars with a percentage you set.
* Author: 9bit Studios
* Copyright 2012, 9bit Studios
* http://www.9bitstudios.com
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {
  $.fn.barfiller = function (options) {
    const defaults = $.extend({
      barColor: '#09CC7F',
      tooltip: true,
      duration: 1000,
      animateOnResize: true,
      symbol: '%'
    }, options)

    /******************************
        Private Variables
        *******************************/

    const object = $(this)
    const settings = $.extend(defaults, options)
    let barWidth = object.width()
    const fill = object.find('.fill')
    const toolTip = object.find('.tip')
    const fillPercentage = fill.attr('data-percentage')
    let resizeTimeout
    let transitionSupport = false
    let transitionPrefix

    /******************************
        Public Methods
        *******************************/

    var methods = {

      init: function () {
        return this.each(function () {
          if (methods.getTransitionSupport()) {
            transitionSupport = true
            transitionPrefix = methods.getTransitionPrefix()
          }

          methods.appendHTML()
          methods.setEventHandlers()
          methods.initializeItems()
        })
      },

      /******************************
            Append HTML
            *******************************/

      appendHTML: function () {
        fill.css('background', settings.barColor)

        if (!settings.tooltip) {
          toolTip.css('display', 'none')
        }
        toolTip.text(fillPercentage + settings.symbol)
      },

      /******************************
            Set Event Handlers
            *******************************/
      setEventHandlers: function () {
        if (settings.animateOnResize) {
          $(window).on('resize', function (event) {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(function () {
              methods.refill()
            }, 300)
          })
        }
      },

      /******************************
            Initialize
            *******************************/

      initializeItems: function () {
        const pctWidth = methods.calculateFill(fillPercentage)
        object.find('.tipWrap').css({ display: 'inline' })

        if (transitionSupport) { methods.transitionFill(pctWidth) } else { methods.animateFill(pctWidth) }
      },

      getTransitionSupport: function () {
        const thisBody = document.body || document.documentElement
        const thisStyle = thisBody.style
        const support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
        return support
      },

      getTransitionPrefix: function () {
        if (/mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase())) {
          return '-moz-transition'
        }
        if (/webkit/.test(navigator.userAgent.toLowerCase())) {
          return '-webkit-transition'
        }
        if (/opera/.test(navigator.userAgent.toLowerCase())) {
          return '-o-transition'
        }
        if (/msie/.test(navigator.userAgent.toLowerCase())) {
          return '-ms-transition'
        } else {
          return 'transition'
        }
      },

      getTransition: function (val, time, type) {
        let CSSObj
        if (type === 'width') {
          CSSObj = { width: val }
        } else if (type === 'left') {
          CSSObj = { left: val }
        }

        time = time / 1000
        CSSObj[transitionPrefix] = type + ' ' + time + 's ease-in-out'
        return CSSObj
      },

      refill: function () {
        fill.css('width', 0)
        toolTip.css('left', 0)
        barWidth = object.width()
        methods.initializeItems()
      },

      calculateFill: function (percentage) {
        percentage = percentage * 0.01
        const finalWidth = barWidth * percentage
        return finalWidth
      },

      transitionFill: function (barWidth) {
        const toolTipOffset = barWidth - toolTip.width()
        fill.css(methods.getTransition(barWidth, settings.duration, 'width'))
        toolTip.css(methods.getTransition(toolTipOffset, settings.duration, 'left'))
      },

      animateFill: function (barWidth) {
        const toolTipOffset = barWidth - toolTip.width()
        fill.stop().animate({ width: '+=' + barWidth }, settings.duration)
        toolTip.stop().animate({ left: '+=' + toolTipOffset }, settings.duration)
      }

    }

    if (methods[options]) { 	// $("#element").pluginName('methodName', 'arg1', 'arg2');
      return methods[options].apply(this, Array.prototype.slice.call(arguments, 1))
    } else if (typeof options === 'object' || !options) { 	// $("#element").pluginName({ option: 1, option:2 });
      return methods.init.apply(this)
    } else {
      $.error('Method "' + method + '" does not exist in barfiller plugin!')
    }
  }
})(jQuery)
