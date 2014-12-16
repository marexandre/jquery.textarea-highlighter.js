var marexandre;
(function($, window, document, undefined) {
  'use strict';

  var pluginName = 'textareaHighlighter';
  var helper = new marexandre.Helper();

  var TextareaHighlighter = function($el, options) {
    this.$element  = $el;
    this.element   = this.$element[0];
    this.settings  = $.extend( {}, TextareaHighlighter.DEFAULTS, this.$element.data(), options );

    this.style          = {};
    this.$wrapDiv       = $(document.createElement('div')).addClass('textarea-highlighter-wrap');
    this.$backgroundDiv = $(document.createElement('div')).addClass('background-div ' + this.$element.attr('class') );
    this.$autoSize      = $('<pre><div class="autosize"></div></pre>').addClass( this.$element.attr('class') ).hide();
    this.$autoSizeElement = this.$autoSize.find('.autosize');

    this.init();
  };

  TextareaHighlighter.DEFAULTS = {
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

  TextareaHighlighter.prototype.bindEvents = function() {
    var _this = this;
    var $this = this.$element;

    $this
      .data('highlighterTimerId', -1)
      // Bind events
      .on('scroll.textarea.highlighter', function() {
        _this.$backgroundDiv.scrollTop( $this.scrollTop() );
      });

    // Input event's
    // TODO: Check if we need old browser related code
    if ('onpropertychange' in _this.element) {
      if ('oninput' in _this.element) {
        // IE 9+
        $this.on('input.textarea.highlighter keyup.textarea.highlighter', function(e) {
          _this.change(e);
        });
        // on backspace key long press
        var lastUpdate = new Date().getTime(), timeDiff = 0;

        $this.on('keydown.textarea.highlighter', function(e) {
          timeDiff = Math.abs(lastUpdate - new Date().getTime());
          if (e.which === 8 && (timeDiff < 10 || 250 < timeDiff)) {
            _this.change(e);
            lastUpdate = new Date().getTime();
          }
        });
      }
      else {
        // IE 7/8
        $this.on('propertychange.textarea.highlighter', function(e) {
          _this.change(e);
        });
      }
    }
    else {
      // Modern browsers
      $this.on('input.textarea.highlighter', function(e) {
        _this.change(e);
      });
    }
  };

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

  TextareaHighlighter.prototype.highlight = function() {
    var self = this;
    var text = self.$element.val();
    var settings = self.settings;
    var overMaxText = '';
    var notOverMaxText = '';

    if (text.length === 0) {
      self.$backgroundDiv.html('');
      return;
    }

    if (0 < settings.maxlength) {
      // check for max length
      if (settings.maxlength < text.length) {
        // get text that was over max length
        overMaxText = text.slice(settings.maxlength, settings.maxlength + text.length - 1);
        // escape HTML
        overMaxText = helper.escapeHTML(overMaxText);
        // wrap matched text with <span> tags
        overMaxText = helper.getTextInSpan(settings.maxlengthWarning, overMaxText);
      }
      // set text that wasn't over max length
      notOverMaxText = text.slice(0, settings.maxlength);
    }
    else {
      notOverMaxText = text;
    }
    // Escape HTML content
    notOverMaxText = helper.escapeHTML(notOverMaxText);
    notOverMaxText = self.getHighlightedContent(notOverMaxText);

    self.$backgroundDiv.html( notOverMaxText + overMaxText );
  };

  TextareaHighlighter.prototype.getHighlightedContent = function(text) {
    var _this = this;
    var list = _this.settings.matches;
    var indeciesList = [];
    var item, trie, trieIndecies;

    for (var i = 0, imax = list.length; i < imax; i++) {
      item = list[i];

      if (item._trie) {
        trie = item._trie;
      } else {
        trie = new marexandre.Trie(item.match);
        item._trie = trie;
      }

      trieIndecies = trie.getIndecies(text);
      trieIndecies = helper.removeOverlapingIndecies(trieIndecies);

      indeciesList.push({ 'indecies': trieIndecies, 'type': item.matchClass });
    }

    var flattened = helper.flattenIndeciesList(indeciesList);
    flattened = helper.orderBy(flattened, 'start');
    flattened = helper.removeOverlapingIndecies(flattened);

    var tokenized = helper.makeTokenized(text, flattened);

    return helper.createHTML(tokenized);
  };

  TextareaHighlighter.prototype.updateMatches = function(matches) {
    var _this = this;
    _this.settings.matches = matches;
    _this.highlight();
  }

  TextareaHighlighter.prototype.updateStyle = function() {
    var _this    = this;
    var $this    = this.$element;
    var settings = this.settings;
    var style    = this.style;

    // textarea style
    style = {
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

  TextareaHighlighter.prototype.updateHeight = function() {
    var _this = this;

    if (_this.settings.isAutoExpand) {
      _this.$autoSizeElement.html(helper.escapeHTML(_this.$element.val().replace(/\r\n/g, '\n')) + ' ');
      // If the height of textarea changed then update it
      if (_this.$element.height() !== _this.$autoSize.height()) {
        _this.$element.height( _this.$autoSize.height() );
      }
    }
  };

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
      .off('textarea.highlighter.updateStyle')
      .off('textarea.highlighter.change')
      // reset all styles
      .attr('style', '')
      .unwrap();
  };

  TextareaHighlighter.prototype.debugModeOn = function() {
    this.settings.debug = true;
    this.$backgroundDiv.css({ 'color': '#f00' });
    this.$element.css({ 'color': 'rgba(0,0,0,0.5)' });
  };

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

      if (!data) {
        data = new TextareaHighlighter($this, options);
        $this.data(pluginName, data);
      }

      if (typeof option === 'string') {
        data[option].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
  };

})(jQuery, window, document);
