/**
 * jquery.textareaHighlighter.js 0.3.4
 * jQuery plugin for highlighting text in textarea.
 *
 * alexandre.kirillov@gmail.com
 * MIT license. http://opensource.org/licenses/MIT
 */
;(function ( $, window, document, undefined ) {
    "use strict";

    var cloneCSSProperties = [
        'lineHeight', 'textDecoration', 'letterSpacing',
        'fontSize', 'fontFamily', 'fontStyle',
        'fontWeight', 'textTransform', 'textAlign',
        'direction', 'wordSpacing', 'fontSizeAdjust',
        'wordWrap', 'word-break',
        'borderLeftWidth', 'borderRightWidth',
        'borderTopWidth','borderBottomWidth',
        'boxSizing', 'webkitBoxSizing', 'mozBoxSizing', 'msBoxSizing'
    ];

    /**
     *
     * PLUGIN CORE
     *
     */
    var pluginName = "textareaHighlighter",
        defaults = {
            matches: [
                // {'matchClass': '', 'match': []}
            ],
            maxlength: -1,
            maxlengthWarning: '',
            maxlengthElement: null,
            debug: false,
            isAutoExpand: true,
            typingDelay: 30
        };

    // constructor
    function Plugin ( element, options ) {
        this.isInited  = false;
        this.element   = element;
        this.$element  = $(this.element);
        this.settings  = $.extend( {}, defaults, this.$element.data(), options );
        this._defaults = defaults;
        this._name     = pluginName;

        this.style = {};
        this.$wrapDiv       = $(document.createElement('div')).addClass('textarea-highlighter-wrap');
        this.$backgroundDiv = $(document.createElement('div')),
        this.$autoSize = $('<pre><div class="autosize"></div></pre>').hide();

        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var _this          = this,
                $this          = this.$element,
                style          = this.style,
                settings       = this.settings,
                $wrapDiv       = this.$wrapDiv,
                $backgroundDiv = this.$backgroundDiv;

            _this.updateStyle();

            $this
                .data('highlighterTimerId', -1)
                // Bind events
                .on('scroll.textarea.highlighter', function(){
                    $backgroundDiv.scrollTop( $this.scrollTop() );
                })
                // ORIGINAL EVENTS
                .on('textarea.highlighter.destroy', function(){
                    _this.destroy();
                })
                .on('textarea.highlighter.updateStyle', function(){
                    _this.updateStyle();
                })
                .on('textarea.highlighter.change', function(){
                    _this.change({});
                })
                // debug mode toggle
                .on('textarea.highlighter.debug.on', function(){
                    _this.debugModeOn();
                })
                .on('textarea.highlighter.debug.off', function(){
                    _this.debugModeOff();
                });


            if ('onpropertychange' in _this.element) {
                if ('oninput' in _this.element) {
                    // IE 9+
                    $this.on('input.textarea.highlighter keyup.textarea.highlighter', function(e){
                        _this.change(e);
                    });
                    // on backspace key long press
                    var lastUpdate = new Date().getTime();
                    var timeDiff = 0;
                    $this.on('keydown.textarea.highlighter', function(e){
                        timeDiff = Math.abs(lastUpdate - new Date().getTime());
                        if (e.which === 8 && (timeDiff < 10 || 250 < timeDiff)) {
                            _this.change(e);
                            lastUpdate = new Date().getTime();
                        }
                    });
                }
                else {
                    // IE 7/8
                    $this.on('propertychange.textarea.highlighter', function(e){
                        _this.change(e);
                    });
                }
            }
            else {
                // Modern browsers
                $this.on('input.textarea.highlighter', function(e){
                    _this.change(e);
                });
            }

            // insert backgroundDiv
            $this.wrap( $wrapDiv ).before( $backgroundDiv );

            if (settings.isAutoExpand) {
                $this.after( _this.$autoSize );
            }
            // do initial check for input
            _this.change({});
        },
        updateStyle: function(){
            var _this    = this,
                $this    = this.$element,
                settings = this.settings,
                style    = this.style;

            // textarea style
            style = {
                // background   : this.$element.css('background'),
                paddingTop   : parseInt( $this.css('padding-top'), 10 ),
                paddingRight : parseInt( $this.css('padding-right'), 10 ),
                paddingBottom: parseInt( $this.css('padding-bottom'), 10 ),
                paddingLeft  : parseInt( $this.css('padding-left'), 10 ),
            };

            // Hack for firefox, some how width needs to be 2px smallet then the textarea
            // and padding-left needs to be added 1px
            if( browser.firefox ){
                style.paddingRight += 1;
                style.paddingLeft += 1;
            }
            if( browser.iphone ){
                style.paddingRight += 3;
                style.paddingLeft += 3;
            }

            // wrap div
            this.$wrapDiv.css({
                'position': 'relative',
                'margin'  : 0
            });

            // background div
            this.$backgroundDiv.addClass('background-div').addClass( $this.attr('class') ).css({
                'height'    : '100%',
                'color'     : ( settings.debug ) ? '#f00' : 'transparent',
                'background': ( settings.debug ) ? '#fee' : style.background,
                'position'  : 'absolute',
                'margin'    : 0
            });
            _this.cloneCSSToTarget( _this.$backgroundDiv );

            // auto size div
            _this.$autoSize.addClass( $this.attr('class') ).css({
                'position': 'absolute',
                'top'     : 0,
                'left'    : 0
            });
            _this.cloneCSSToTarget( _this.$autoSize );

            // text area element
            $this.css({
                'color'     : ( settings.debug ) ? 'rgba(0,0,0,0.5)' : 'inherit',
                'position'  : 'relative',
                'background': 'transparent'
            });
        },
        change: function(e){
            var _this = this,
                settings = _this.settings;
            // if arrow keys, don't do anything
            if (/(37|38|39|40)/.test(e.keyCode)) { return true; }

            _this.updateHeight();

            // check for last update, this is for performace
            if (_this.$element.data('highlighterTimerId') !== -1) {
                clearTimeout( _this.$element.data('highlighterTimerId') );
                _this.$element.data('highlighterTimerId', -1);
            }

            // id for set timeout
            var changeId = setTimeout(function(){
                var tmpMaxLengthObj = _this.checkMaxLength();
                var tmpMatchedObj = _this.checkMatchWords( tmpMaxLengthObj.notOverMaxText );

                // update background div content
                _this.$backgroundDiv.html( tmpMatchedObj.txt + tmpMaxLengthObj.overMaxText );
                // trigger update event
                _this.$element.trigger('textarea.highlighter.update', {'textList': tmpMatchedObj.matchedList});

                // if not initialize execution the trigger an initialization complete event
                if (!_this.isInited) {
                    _this.isInited = true;
                    _this.$element.trigger('textarea.highlighter.init.complete');
                }
            }, settings.typingDelay);
            // set setTimeout id
            _this.$element.data('highlighterTimerId', changeId);
        },
        // wrap matched text with an HTML element
        getWrapedText: function( text, matchedText, matchClass ){
            return text.replace( new RegExp( helper.escapeRegExp( matchedText ), 'g'), this.getTextInSpan( matchClass, matchedText ) );
        },
        getTextInSpan: function( className, text ){
            return '<span class="'+ className +'">'+ text +'</span>';
        },

        checkMaxLength: function(){
            var _this = this,
                textareaText = _this.$element.val(),
                settings = _this.settings,
                maxSize = 0,
                overMaxText = '',
                notOverMaxText = '';

            if (0 < settings.maxlength) {
                // check for max length
                if ( settings.maxlength < textareaText.length) {
                    // get text that was over max length
                    overMaxText = textareaText.slice( settings.maxlength, settings.maxlength + textareaText.length - 1 );
                    overMaxText = helper.escapeHTML( overMaxText );
                    overMaxText = _this.getTextInSpan(settings.maxlengthWarning, overMaxText);
                }
                // update text max length
                if (settings.maxlengthElement !== null) {
                    maxSize = settings.maxlength - textareaText.length;

                    if (maxSize < 0) {
                        // add max length warning class
                        if (! settings.maxlengthElement.hasClass( settings.maxlengthWarning )) {
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
                    settings.maxlengthElement.text( maxSize );
                }
                // set text that wasn't over max length
                notOverMaxText = textareaText.slice( 0, settings.maxlength );
            }
            else {
                // max length wasn't set so use input text without any extra settings
                notOverMaxText = textareaText;
            }

            return {
                'overMaxText': overMaxText,
                'notOverMaxText': helper.escapeHTML( notOverMaxText )
            };
        },

        checkMatchWords: function( escapedTargetText ){
            var settings = this.settings;
            var i = 0, imax = 0, j = 0, jmax = 0,
                matchesList = [], matchTextList = [],
                matchText = '', matchTextEscape = '', matchClass = '',
                matched = null;

            // check for matching words
            for (i = 0, imax = settings.matches.length; i < imax; i++) {

                // check if match match is a RegExp
                if (settings.matches[i].match instanceof RegExp) {
                    // set matched words array
                    matchesList = helper.getUniqueArray( escapedTargetText.match( settings.matches[i].match ) || [] );
                }
                else {
                    // copy words array
                    matchesList = settings.matches[i].match;
                }

                for (j = 0, jmax = matchesList.length; j < jmax; j++) {
                    // get word to match
                    matchText = matchesList[j];
                    matchTextEscape = helper.escapeHTML( matchText );
                    matchClass = '';

                    matched = escapedTargetText.match(new RegExp( helper.escapeRegExp(matchTextEscape), 'g' ));
                    // check if word exists in input text
                    if (matched && 0 < matched.length){
                        matchTextList.push({
                            text: matchText,
                            matched: matched
                        });

                        // check for match class name
                        if (settings.matches[i].hasOwnProperty('matchClass')) {
                            matchClass = settings.matches[i].matchClass;
                        }
                        // update replaced text
                        escapedTargetText = this.getWrapedText( escapedTargetText, matchTextEscape, matchClass );
                    }
                }
            }

            return {
                'txt': escapedTargetText,
                'matchedList': matchTextList
            };
        },

        updateHeight: function(){
            var _this = this;

            if (_this.settings.isAutoExpand) {

                _this.$autoSize.find('.autosize').html( _this.$element.val().replace(/\r\n/g, "\n") + ' ' );

                var h = _this.$autoSize.height();
                _this.$element.height( h );
                _this.$backgroundDiv.height( h );
            }
        },

        cloneCSSToTarget: function( $t ){
            var $element = this.$element;
            var val = null;
            $.each(cloneCSSProperties, function(i, p) {
                val = $element.css(p);
                // Only set if different to prevent overriding percentage css values.
                if ($t.css(p) !== val) {
                    $t.css(p, val);
                }
            });
        },

        // Destroy plugin in settings & extra elements that were added
        destroy: function(){
            $.data( this.element, "plugin_" + pluginName, false );
            this.$backgroundDiv.remove();
            this.$element
                .off('scroll.textarea.highlighter')
                .off('input.textarea.highlighter keyup.textarea.highlighter')
                .off('textarea.highlighter.destroy')
                .off('textarea.highlighter.update')
                .off('textarea.highlighter.change')
                .css({
                    'color'     : '',
                    'position'  : '',
                    'background': ''
                })
                .unwrap();
        },
        // Turn on debug mode
        debugModeOn: function(){
            this.settings.debug = true;
            this.$backgroundDiv.css({ 'color': '#f00' });
            this.$element.css({ 'color': 'rgba(0,0,0,0.5)' });
        },
        // Turn off debug mode
        debugModeOff: function(){
            this.settings.debug = false;
            this.$backgroundDiv.css({ 'color': 'transparent' });
            this.$element.css({ 'color': 'inherit' });
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function(i) {
            if ( ! $.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

    /**
     *
     * HELPER FUNCTIONS
     *
     */
    var helper = {
        escapeHTML: function(str){
            return $( document.createElement('div') ).text(str).html();
        },
        escapeRegExp: function(str){
            return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        },
        getUniqueArray: function( array ){
            return array.filter(function(elem, pos, self) {
                if ( elem === '' ) {
                    return false;
                }
                return self.indexOf(elem) === pos;
            });
        }
    };
    // get curretn bworser type
    var browser = (function(){
        var userAgent = navigator.userAgent,
            msie    = /(msie|trident)/i.test( userAgent ),
            chrome  = /chrome/i.test( userAgent ),
            firefox = /firefox/i.test( userAgent ),
            safari  = /safari/i.test( userAgent ) && !chrome,
            iphone  = /iphone/i.test( userAgent );

        if( msie ){ return { msie: true }; }
        if( chrome ){ return { chrome: true }; }
        if( firefox ){ return { firefox: true }; }
        if( iphone ){ return { iphone: true }; }
        if( safari ){ return { safari: true }; }

        return {
            msie   : false,
            chrome : false,
            firefox: false,
            safari : false,
            iphone : false
        };
    }());

})( jQuery, window, document );