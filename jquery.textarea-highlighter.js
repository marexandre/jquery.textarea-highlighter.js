/**
 * jquery.textarea-highlighter.js - jQuery plugin for highlighting text in textarea.
 * @version v0.6.8
 * @link https://github.com/marexandre/jquery.textarea-highlighter.js
 * @author alexandre.kirillov@gmail.com
 * @license MIT license. http://opensource.org/licenses/MIT
 */
var marexandre;
(function (marexandre) {
  'use strict';

  var Helper = (function() {
    function Helper() {}

    /**
     * orderBy sorts an array by a given object key
     * @param  {Array} list  Array containing objects
     * @param  {String} type Object key
     * @return {Array}
     */
    Helper.prototype.orderBy = function(list, type) {
      return list.sort(function(a, b) {
        return parseInt(a[type], 10) - parseInt(b[type], 10);
      });
    };

    /**
     * removeOverlapingIndecies removes duplicate indecies from an trie indecies array
     * trie indecies array looks somehting like this: [{start: 1, end: 3}, ...]
     * @param  {Array} list Array of trie indecies
     * @return {Array}      Array with out overlaping trie indecies
     */
    Helper.prototype.removeOverlapingIndecies = function(list) {
      var a = [], item, next;

      // Check for overlapping items
      for (var i = 0, imax = list.length; i < imax; i++) {
        item = list[i];

        for (var j = i + 1; j < imax; j++) {
          next = list[j];

          if (this.isOverlap(item, next)) {
            a.push(j);
          }
        }
      }
      // Remove overlapping items from the list
      return list.slice(0).filter(function(elem, pos) {
        if (a.indexOf(pos) !== -1) {
          return false;
        }
        return true;
      });
    };

    /**
     * removeOverlapingIndeciesByPriority removes duplicate indecies from an trie indecies array by priority
     * trie indecies array looks somehting like this: [{start: 1, end: 3}, ...]
     * @param  {Array} list Array of trie indecies
     * @return {Array}      Array with out overlaping trie indecies
     */
    Helper.prototype.removeOverlapingIndeciesByPriority = function(list) {
      list = list || [];
      list = this.orderBy(list, 'priority');

      var a = [], item, next;
      // Remove overlap based on priority
      for (var i = 0, imax = list.length; i < imax; i++) {
        item = list[i];

        for (var j = i + 1; j < imax; j++) {
          next = list[j];
          if (this.isOverlap(item, next)) {
            if (item.priority < next.priority) {
              a.push(i);
              break;
            } else if (item.priority === next.priority) {
              if (item.end > next.end || item.start < next.start) {
                a.push(j);
              } else {
                a.push(i);
                break;
              }
            } else {
              a.push(j);
            }
          }
        }
      }
      // Remove overlapping items from the list
      return list.slice(0).filter(function(elem, pos) {
        if (a.indexOf(pos) !== -1) {
          return false;
        }
        return true;
      });
    };

    /**
     * isOverlap checks if two trie indecies objects overlap
     * @param  {Object} x Trie indecies object A
     * @param  {Object} y Trie indecies object B
     * @return {boolean}   If overlapping or not
     */
    Helper.prototype.isOverlap = function(x, y) {
      return x.start < y.end && y.start < x.end;
    };

    /**
     * flattenIndeciesList
     * @param  {Array} list [description]
     * @return {Array}      [description]
     */
    Helper.prototype.flattenIndeciesList = function(list) {
      var a = [], type, obj;

      for (var i = 0, imax = list.length; i < imax; i++) {
        type = list[i].type;
        for (var j = 0, jmax = list[i].indecies.length; j < jmax; j++) {
          obj = list[i].indecies[j];
          a.push({ 'start': obj.start, 'end': obj.end, 'type': type });
        }
      }

      return a;
    };

    /**
     * cleanupOnWordBoundary
     * @param  {String} text            [description]
     * @param  {Array} list            [description]
     * @param  {boolean} useWordBoundary [description]
     * @return {Array}                 [description]
     */
    Helper.prototype.cleanupOnWordBoundary = function(text, list, useWordBoundary) {
      useWordBoundary = useWordBoundary || true;

      var a = [], o, w, ww, wws;

      for (var i = 0, imax = list.length; i < imax; i++) {
        o = list[i];
        w = text.slice(o.start, o.end);
        wws = o.start - 1 < 0 ? 0 : o.start - 1;
        ww = text.slice(wws, o.end + 1);

        if (useWordBoundary && this.isWrappedByASCII(w) && !this.checkWordBoundary(w, ww)) {
          a.push(i);
        }
      }
      // Remove overlapping items from the list
      return list.slice(0).filter(function(elem, pos) {
        if (a.indexOf(pos) !== -1) {
          return false;
        }
        return true;
      });
    };

    /**
     * makeTokenized
     * @param  {String} text     Some text string
     * @param  {Array} indecies  Array of trie indecies
     * @return {Array}           Array with tokenized content
     */
    Helper.prototype.makeTokenized = function(text, indecies) {
      var a = [], o, s = 0, ss = 0;

      for (var i = 0, imax = indecies.length; i < imax; i++) {
        o = indecies[i];
        ss = o.start;

        if (ss > s) {
          a.push({ 'value': text.slice(s, ss), 'type': 'text' });
        }

        a.push({ 'value': text.slice(ss, o.end), 'type': o.type });

        s = o.end;
      }

      if (s < text.length) {
        a.push({ 'value': text.slice(s, text.length), 'type': 'text' });
      }

      return a;
    };

    Helper.prototype.checkWordBoundary = function(w, ww) {
      return new RegExp('\\b' + this.escapeRegExp(w) + '\\b').test(ww);
    };

    Helper.prototype.isWrappedByASCII = function(str) {
      return /^\w.*\w$|^\w+$/.test(str);
    };

    Helper.prototype.escapeHTML = function(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    Helper.prototype.escapeRegExp = function(str) {
      return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    };

    Helper.prototype.sanitizeBreakLines = function(str) {
      return str
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
    };

    Helper.prototype.getUniqueArray = function(a) {
      return a.filter(function(elem, pos, self) {
        if (elem === '') {
          return false;
        }
        return self.indexOf(elem) === pos;
      });
    };

    /**
     * createHTML returns an string with HTML tags around tokenized.value content
     * @param  {Object} tokenized Tokenized object
     * @return {String}           [description]
     */
    Helper.prototype.createHTML = function(tokenized) {
      var a = [];

      for (var i = 0, imax = tokenized.length; i < imax; i++) {
        if (tokenized[i].type === 'text') {
          a.push(tokenized[i].value);
        } else {
          a.push(this.getTextInSpan(tokenized[i].type, tokenized[i].value));
        }
      }

      return a.join('');
    };

    /**
     * getTextInSpan wraps a given text and class name with <span>'s
     * @param  {String} className
     * @param  {String} text
     * @return {String}
     */
    Helper.prototype.getTextInSpan = function(className, text) {
      return '<span class="' + className + '">' + text + '</span>';
    };

    Helper.prototype.isRegExp = function(v) {
      return v instanceof RegExp;
    };

    /**
     * browser returns an Object containing browser information
     * @return {Object}
     */
    Helper.prototype.browser = function() {
      var userAgent = navigator.userAgent,
          msie    = /(msie|trident)/i.test( userAgent ),
          chrome  = /chrome/i.test( userAgent ),
          firefox = /firefox/i.test( userAgent ),
          safari  = /safari/i.test( userAgent ) && !chrome,
          iphone  = /iphone/i.test( userAgent );

      if ( msie ) { return { msie: true }; }
      if ( chrome ) { return { chrome: true }; }
      if ( firefox ) { return { firefox: true }; }
      if ( iphone ) { return { iphone: true }; }
      if ( safari ) { return { safari: true }; }

      return {
        msie   : false,
        chrome : false,
        firefox: false,
        safari : false,
        iphone : false
      };
    };

    return Helper;
  })();

  marexandre.Helper = Helper;
})(marexandre || (marexandre = {}));

var marexandre;
(function (marexandre) {
  'use strict';

  var Trie = (function() {
    function Trie(_list_) {
      this.list = {
        children: {}
      };
      // Initialize
      this.addFromArray(_list_ || []);
    }

    /**
     * addFromArray adds an givet array of strings to the trie dictionary
     * @param  {Array} _list_ Array of string to add to the dictionary
     */
    Trie.prototype.addFromArray = function(_list_) {
      var self = this;

      for (var i = 0, imax = _list_.length; i < imax; i++) {
        self.add( _list_[i] );
      }
    };


    /**
     * add adds an givet string to the trie dictionary
     * @param  {String} _text_ String to add to the trie dictionary
     */
    Trie.prototype.add = function(_word_) {
      var self = this;
      var obj = self.list;

      for (var j = 0, jmax = _word_.length; j < jmax; j++) {
        var c = _word_[j];

        if (obj.children[c] == null) {
          obj.children[c] = {
            children: {},
            value: c,
            is_end: j === jmax - 1 // Check if at the last letter
          };
        }

        obj = obj.children[c];
      }
    };

    /**
     * hasWord returns an Boolean if a given string exists in the trie dictionary
     * @param  {String} _text_ String to search for in the trie dictionary
     * @type {Boolean}
     */
    Trie.prototype.hasWord = function(_text_) {
      var self = this;
      var children = self.list.children;
      var flg = false;

      for (var i = 0, imax = _text_.length; i < imax; i++) {
        var c = _text_[i];
        var exists = children.hasOwnProperty(c.toString());

        if (exists) {
          if (children[c].is_end && i === imax - 1) {
            flg = true;
            break;
          }
          children = children[c].children;
        } else {
          break;
        }
      }
      return flg;
    };

    /**
     * getIndecies returns an Array of indecies that matched from a give string
     * @param  {String} _text_ String from which to get indecies
     * @type {Array} [{start: 1, end: 3}, ...]
     */
    Trie.prototype.getIndecies = function(_text_) {
      var self = this;
      var result = [];
      var copy = '';
      var tmpTrie = self.list;
      var start = -1, end = -1;

      for (var i = 0, imax = _text_.length; i < imax; i++) {
        copy = _text_.slice(i);

        // TODO: Need to refactor this loop :(
        for (var j = 0, jmax = copy.length; j < jmax; j++) {
          var c = copy[j];
          var exists = tmpTrie.children.hasOwnProperty(c.toString());

          if (exists) {
            tmpTrie = tmpTrie.children[c];
            start = i;
            // Check if next character exists in children, and if does dive deeper
            if (copy[j + 1]) {
              var exists2 = tmpTrie.children.hasOwnProperty(copy[j + 1].toString());
              if (tmpTrie.is_end && !exists2) {
                end = start + j;
                break;
              }
            } else {
              if (tmpTrie.is_end) {
                end = start + j;
                break;
              }
              break;
            }
          } else {
            break;
          }
        }
        // If there was a match save it.
        if (start !== -1 && end !== -1) {
          result.push({
            start: start,
            end: end + 1
          });
          i = end;
        }
        // Reset for next round
        start = -1;
        end = -1;
        tmpTrie = self.list;
      }

      return result;
    };

    return Trie;
  })();

  marexandre.Trie = Trie;
})(marexandre || (marexandre = {}));

var marexandre;
(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'textareaHighlighter';
  var helper = new marexandre.Helper();

  var TextareaHighlighter = function($el, options) {
    this.$element  = $el;
    this.element   = this.$element[0];
    this.settings  = $.extend( {}, TextareaHighlighter.DEFAULTS, this.$element.data(), options );

    this.$wrapDiv       = $(document.createElement('div')).addClass('textarea-highlighter-wrap');
    this.$backgroundDiv = $(document.createElement('div')).addClass('background-div ' + this.$element.attr('class') );
    this.$autoSize      = $('<pre><div class="autosize"></div></pre>').addClass( this.$element.attr('class') ).hide();
    this.$autoSizeElement = this.$autoSize.find('.autosize');

    this.init();
  };

  TextareaHighlighter.DEFAULTS = {
    wordBase: true,
    caseSensitive: true,
    matches: [
      // {'matchClass': '', 'match': []}
    ],
    maxlength        : -1,
    maxlengthWarning : '',
    maxlengthElement : null,
    isAutoExpand     : true,
    typingDelay      : 30,
    debug            : false
  };

  TextareaHighlighter.prototype.init = function() {
    var _this          = this,
        $this          = this.$element,
        settings       = this.settings,
        $wrapDiv       = this.$wrapDiv,
        $backgroundDiv = this.$backgroundDiv;

    // Remove duplicates from 'match'
    for (var i = 0, imax = settings.matches.length; i < imax; i++) {
      if (settings.matches[i].match instanceof RegExp) {
        continue;
      }
      settings.matches[i].match = helper.getUniqueArray(settings.matches[i].match);
    }

    _this.updateStyle();

    // insert backgroundDiv
    $this.wrap( $wrapDiv ).before( $backgroundDiv );
    // Insert auto resize div
    if (settings.isAutoExpand) {
      $this.after( _this.$autoSize );
    }

    _this.updateHeight();
    _this.bindEvents();
    _this.highlight();
  };

  /**
   * bindEvents binds all events related to the plugin
   */
  TextareaHighlighter.prototype.bindEvents = function() {
    var _this = this;
    var $this = this.$element;

    $this
      .data('highlighterTimerId', -1)
      // Watch on scroll event
      .on('scroll.textarea.highlighter', function() {
        _this.$backgroundDiv.scrollTop( $this.scrollTop() );
      });

    if ('onpropertychange' in _this.element) {
      var lastUpdate = new Date().getTime();
      var timeDiff = 0;
      var abs = Math.abs;
      // IE 9+
      $this.on('input.textarea.highlighter keyup.textarea.highlighter', function(e) {
        timeDiff = abs(lastUpdate - new Date().getTime());

        if (timeDiff > 10) {
          _this.change(e);
          lastUpdate = new Date().getTime();
        }
      });
      // For backspace long press
      $this.on('keydown.textarea.highlighter', function(e) {
        timeDiff = abs(lastUpdate - new Date().getTime());

        if (e.which === 8 && (timeDiff < 10 || 250 < timeDiff)) {
          _this.change(e);
          lastUpdate = new Date().getTime();
        }
      });
    } else {
      // Modern browsers
      $this.on('input.textarea.highlighter', function(e) {
        _this.change(e);
      });
    }
  };

  /**
   * change is triggered every time the use changes the text in the textarea
   * @param  {Object} e jQuery event
   */
  TextareaHighlighter.prototype.change = function(e) {
    var _this = this;

    // if arrow keys, don't do anything
    if (/(37|38|39|40)/.test(e.keyCode)) {
      return true;
    }

    _this.updateHeight();

    // TODO: replace this stupid thing with proper 'throttle'
    // check for last update, this is for performace
    if (_this.$element.data('highlighterTimerId') !== -1) {
      clearTimeout( _this.$element.data('highlighterTimerId') );
      _this.$element.data('highlighterTimerId', -1);
    }

    // id for set timeout
    var changeId = setTimeout(function() {
      _this.highlight();
    }, _this.settings.typingDelay);
    // set setTimeout id
    _this.$element.data('highlighterTimerId', changeId);
  };

  /**
   * highlight actually highlights the content
   */
  TextareaHighlighter.prototype.highlight = function() {
    var _this = this;
    var text = _this.$element.val();
    var settings = _this.settings;
    var overMaxText = '';
    var notOverMaxText = '';

    // check for max length
    if (0 < settings.maxlength) {
      if (settings.maxlength < text.length) {
        // get text that was over max length
        overMaxText = text.slice(settings.maxlength, settings.maxlength + text.length - 1);
        // escape HTML
        overMaxText = helper.escapeHTML(overMaxText);
        // wrap matched text with <span> tags
        overMaxText = helper.getTextInSpan(settings.maxlengthWarning, overMaxText);
      }

      _this.updateCharLimitElement(text);
      // set text that wasn't over max length
      notOverMaxText = text.slice(0, settings.maxlength);
    }
    else {
      notOverMaxText = text;
    }
    // Escape HTML content
    notOverMaxText = helper.escapeHTML(notOverMaxText);
    notOverMaxText = _this.getHighlightedContent(notOverMaxText);

    _this.$backgroundDiv.html( notOverMaxText + overMaxText );
    _this.updateHeight();
    _this.$element.trigger('textarea.highlighter.highlight');
  };

  /**
   * getHighlightedContent return a string with HTML tags wrapping the words that need to be highlighted
   * @param  {Atring} text
   * @return {String}
   */
  TextareaHighlighter.prototype.getHighlightedContent = function(text) {
    var _this = this;
    var list = _this.settings.matches;
    var indeciesList = [];
    var item, trieIndecies;
    var matches = [];

    for (var i = 0, imax = list.length; i < imax; i++) {
      item = list[i];

      if (!item._trie) {
        item._trie = new marexandre.Trie();

        // Add none RegExp matches once, when the trie is initialized
        if (!helper.isRegExp(item.match)) {
          matches = item.match;
          _this.addMatchesToTrie(item._trie, matches);
        }
      }

      // For RegExp matches we need to add them to the trie object
      if (helper.isRegExp(item.match)) {
        matches = helper.getUniqueArray(text.match(item.match) || []);
        _this.addMatchesToTrie(item._trie, matches);
      }

      var t = _this.settings.caseSensitive ? text : text.toLowerCase();
      trieIndecies = item._trie.getIndecies(t);
      trieIndecies = helper.removeOverlapingIndecies(trieIndecies);

      indeciesList.push({ 'indecies': trieIndecies, 'type': item.matchClass });
    }

    var flattened = helper.flattenIndeciesList(indeciesList);
    flattened = helper.orderBy(flattened, 'start');
    flattened = helper.removeOverlapingIndecies(flattened);
    flattened = helper.cleanupOnWordBoundary(text, flattened, _this.settings.wordBase);

    return helper.createHTML( helper.makeTokenized(text, flattened) );
  };

  /**
   * addMatchesToTrie addes given matches to a given trie
   * @param  {Trie} trie      Trie object
   * @param  {Array} matches  Array of string mathces
   */
  TextareaHighlighter.prototype.addMatchesToTrie = function(trie, matches) {
    var _this = this;
    for (var j = 0, jmax = matches.length; j < jmax; j++) {
      var m = _this.settings.caseSensitive ? matches[j] : matches[j].toLowerCase();
      trie.add(helper.escapeHTML(m));
    }
  };

  /**
   * updateCharLimitElement updates the max chars element with the latest data
   * @param  {String} text
   */
  TextareaHighlighter.prototype.updateCharLimitElement = function(text) {
    var _this = this;
    var settings = _this.settings;
    // update text max length
    if (settings.maxlengthElement !== null) {
      var maxSize = settings.maxlength - text.length;

      if (maxSize < 0) {
        // add max length warning class
        if (!settings.maxlengthElement.hasClass( settings.maxlengthWarning )) {
          settings.maxlengthElement.addClass( settings.maxlengthWarning );
        }
      }
      else {
        // remove max length warning class
        if (settings.maxlengthElement.hasClass( settings.maxlengthWarning )) {
          settings.maxlengthElement.removeClass( settings.maxlengthWarning );
        }
      }
      // update max length
      settings.maxlengthElement.text(maxSize);
    }
  };

  /**
   * updateMatches will replace the matches object
   * @param  {Object} matches
   */
  TextareaHighlighter.prototype.updateMatches = function(matches) {
    var _this = this;
    _this.settings.matches = matches;
    _this.highlight();
  };

  /**
   * updateStyle will update CSS styling related to the plugin
   * @return {[type]} [description]
   */
  TextareaHighlighter.prototype.updateStyle = function() {
    var _this    = this;
    var $this    = this.$element;
    var settings = this.settings;
    var style = {
      paddingTop   : parseInt( $this.css('padding-top'), 10 ),
      paddingRight : parseInt( $this.css('padding-right'), 10 ),
      paddingBottom: parseInt( $this.css('padding-bottom'), 10 ),
      paddingLeft  : parseInt( $this.css('padding-left'), 10 )
    };

    // Hack for iPhone
    if (helper.browser().iphone) {
      style.paddingRight += 3;
      style.paddingLeft += 3;
    }

    // wrap div
    this.$wrapDiv.css({
      'position': 'relative'
    });

    // background div
    this.$backgroundDiv.css({
      'position'      : 'absolute',
      'height'        : '100%',
      'font-family'   : 'inherit',
      'color'         : ( settings.debug ) ? '#f00' : 'transparent',
      'padding-top'   : style.paddingTop,
      'padding-right' : style.paddingRight,
      'padding-bottom': style.paddingBottom,
      'padding-left'  : style.paddingLeft
    });
    _this.cloneCSSToTarget( _this.$backgroundDiv );

    if (settings.isAutoExpand) {
      // auto size div
      _this.$autoSize.css({
        'top'           : 0,
        'left'          : 0,
        'font-family'   : 'inherit',
        'position'      : 'absolute',
        'padding-top'   : style.paddingTop,
        'padding-right' : style.paddingRight,
        'padding-bottom': style.paddingBottom,
        'padding-left'  : style.paddingLeft
      });
      _this.cloneCSSToTarget( _this.$autoSize );
    }

    // text area element
    $this.css({
      'color'     : ( settings.debug ) ? 'rgba(0,0,0,0.5)' : 'inherit',
      'position'  : 'relative',
      'background': 'none'
    });
  };

  /**
   * updateHeight will update textareas height depending on the text amount in the textarea
   */
  TextareaHighlighter.prototype.updateHeight = function() {
    var _this = this;

    if (_this.settings.isAutoExpand) {
      _this.$autoSizeElement.html(helper.escapeHTML( helper.sanitizeBreakLines(_this.$element.val()) ) + ' ');
      var h = _this.$autoSize.height();

      if (helper.browser().firefox) {
        h += 1;
      }

      // If the height of textarea changed then update it
      if (_this.$element.height() !== h) {
        _this.$element.height(h);
        _this.$backgroundDiv.height(h);
      }
    }
  };

  /**
   * cloneCSSToTarget will clone CSS properties from the textarea to a given jQuery item
   * @param  {jQuery} $t
   */
  TextareaHighlighter.prototype.cloneCSSToTarget = function($t) {
    var $element = this.$element;
    var cloneCSSProperties = [
      'lineHeight', 'textDecoration', 'letterSpacing',
      'fontSize', 'fontStyle',
      'fontWeight', 'textTransform', 'textAlign',
      'direction', 'wordSpacing', 'fontSizeAdjust',
      'wordWrap', 'word-break',
      'marginLeft', 'marginRight',
      'marginTop','marginBottom',
      'borderLeftWidth', 'borderRightWidth',
      'borderTopWidth','borderBottomWidth',
      'boxSizing', 'webkitBoxSizing', 'mozBoxSizing', 'msBoxSizing'
    ];
    var val = null;

    $.each(cloneCSSProperties, function(i, p) {
      val = $element.css(p);
      // Only set if different to prevent overriding percentage css values.
      if ($t.css(p) !== val) {
        $t.css(p, val);
      }
    });
  };

  /**
   * destroy removes all the content that was added by the plugin
   */
  TextareaHighlighter.prototype.destroy = function() {
    $.data( this.element, 'plugin_' + pluginName, false );
    this.$backgroundDiv.remove();
    this.$autoSize.remove();
    this.$element
      .data('highlighterTimerId', -1)
      // unbind all events
      .off('scroll.textarea.highlighter')
      .off('input.textarea.highlighter')
      .off('keyup.textarea.highlighter')
      .off('propertychange.textarea.highlighter')
      // reset all styles
      .attr('style', '')
      .unwrap();
  };

  /**
   * debugModeOn terns the debug mode on
   */
  TextareaHighlighter.prototype.debugModeOn = function() {
    this.settings.debug = true;
    this.$backgroundDiv.css({ 'color': '#f00' });
    this.$element.css({ 'color': 'rgba(0,0,0,0.5)' });
  };

  /**
   * debugModeOn terns the debug mode off
   */
  TextareaHighlighter.prototype.debugModeOff = function() {
    this.settings.debug = false;
    this.$backgroundDiv.css({ 'color': 'transparent' });
    this.$element.css({ 'color': 'inherit' });
  };

  $.fn.textareaHighlighter = function(option) {
    var args = arguments;

    return this.each(function() {
      var $this = $(this);
      var data = $this.data(pluginName);
      var options = typeof option === 'object' && option;

      // If no options or plugin was NOT initialized yet, do NOT do anything.
      if (!option || (!data && typeof option === 'string')) {
        return;
      }

      if (!data) {
        data = new TextareaHighlighter($this, options);
        $this.data(pluginName, data);
      }

      if (typeof option === 'string') {
        if (!data[option]) {
          throw 'Unknown method: ' + option;
        }

        data[option].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
  };

})(jQuery, window, document);
