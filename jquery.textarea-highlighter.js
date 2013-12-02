/**
 * jquery.textareaHighlighter.js 0.2.1
 * jQuery plugin for highlighting text in textarea.
 *
 * alexandre.kirillov@gmail.com
 * MIT license. http://opensource.org/licenses/MIT
 */
;(function ( $, window, document, undefined ) {
    "use strict";

    /**
     *
     * PLUGIN CORE
     *
     */
    var pluginName = "textareaHighlighter",
        defaults = {
            matches: [
                // {'className': '', 'words': []}
            ],
            maxlength: -1,
            maxlengthWarning: '',
            maxlengthElement: null,
            isCustomeCss: false,
            debug: false
        };

    // constructor
    function Plugin ( element, options ) {
        this.element   = element;
        this.$element  = $(this.element);
        this.settings  = $.extend( {}, defaults, this.$element.data(), options );
        this._defaults = defaults;
        this._name     = pluginName;

        // check if plugin was initialized on the element.
        if ( this.$element.data(pluginName) ) { return; }
        this.$element.data(pluginName, true);

        this.style = {};
        this.$wrapDiv       = $(document.createElement('div')).addClass('textarea-highlighter-wrap');
        this.$backgroundDiv = $(document.createElement('div'));

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
                .on('textarea.highlighter.update', function(){
                    _this.updateStyle();
                });

            if (browser.msie) {
                // IE
                $this.on('input.textarea.highlighter keyup.textarea.highlighter', function(e){
                    _this.change(e);
                });
            }
            else {
                // Modern browsers
                $this.on('input.textarea.highlighter', function(e){
                    _this.change(e);
                });
            }

            // insert backgroundDiv
            $this.wrap( $wrapDiv ).before( $backgroundDiv );
            // do initial check for input
            _this.change({});
        },
        updateStyle: function(){
            var _this    = this,
                $this    = this.$element,
                settings = this.settings,
                style    = this.style;

            // textarea style
            this.style = {
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

            this.$wrapDiv.css({
                'position'     : 'relative',
                'word-wrap'    : 'break-word',
                'word-break'   : 'break-all',
                'margin'       : 0
            });
            this.$backgroundDiv.addClass('background-div').addClass( $this.attr('class') ).css({
                'height'        : '100%',
                'color'         : ( settings.debug ) ? '#f00' : 'transparent',
                // 'background'    : ( settings.debug ) ? '#fee' : style.background,
                // 'padding-top'   : style.paddingTop,
                // 'padding-right' : style.paddingRight,
                // 'padding-bottom': style.paddingBottom,
                // 'padding-left'  : style.paddingLeft,
                'position'      : 'absolute',
                'overflow'      : 'auto',
                'margin'        : '0'
            });
            if (! settings.isCustomeCss) {
                this.$backgroundDiv.css({
                    'padding-top'   : style.paddingTop,
                    'padding-right' : style.paddingRight,
                    'padding-bottom': style.paddingBottom,
                    'padding-left'  : style.paddingLeft,
                    'box-sizing'    : 'border-box',
                    'border-color'  : 'transparent'
                });
            }

            $this.css({
                'color'     : ( settings.debug ) ? 'rgba(0,0,0,0.5)' : 'inherit',
                'position'  : 'relative',
                'background': 'transparent'
            });
        },
        change: function(e){
            var _this = this;
            // if arrow keys, don't do anything
            if (/(37|38|39|40)/.test(e.keyCode)) { return true; }

            // check for last update, this is for performace
            if (_this.$element.data('highlighterTimerId') !== -1) {
                clearTimeout( _this.$element.data('highlighterTimerId') );
                _this.$element.data('highlighterTimerId', -1);
            }

            var changeId = setTimeout(function(){
                var textareaText = $(document.createElement('div')).text( _this.$element.val() ).html(),
                    key, ruleTextList, matchText, spanText, matchTextList = [],
                    notOverMaxText = '', overMaxText ='',
                    i, imax, j, jmax, maxSize;

                if (0 < _this.settings.maxlength) {
                    // check for max length
                    if ( _this.settings.maxlength < _this.$element.val().length) {
                        matchText = _this.$element.val().slice( _this.settings.maxlength, _this.settings.maxlength + _this.$element.val().length - 1 );
                        overMaxText = '<span class="'+ _this.settings.maxlengthWarning +'">'+ matchText +'</span>';

                    }
                    // update text max length
                    if (_this.settings.maxlengthElement !== null) {
                        maxSize = _this.settings.maxlength - _this.$element.val().length;
                        if (maxSize < 0) {
                            if (! _this.settings.maxlengthElement.hasClass( _this.settings.maxlengthWarning )) {
                                _this.settings.maxlengthElement.addClass( _this.settings.maxlengthWarning );
                            }
                        }
                        else {
                            if (_this.settings.maxlengthElement.hasClass( _this.settings.maxlengthWarning )) {
                                _this.settings.maxlengthElement.removeClass( _this.settings.maxlengthWarning );
                            }
                        }
                        // update max length
                        _this.settings.maxlengthElement.text( maxSize );
                    }

                    notOverMaxText = _this.$element.val().slice( 0, _this.settings.maxlength );
                }
                else {
                    notOverMaxText = textareaText;
                }

                // check for matching words
                for (i = 0, imax = _this.settings.matches.length; i < imax; i++) {
                    for (j = 0, jmax = _this.settings.matches[i].words.length; j < jmax; j++) {
                        // get word to match
                        matchText = _this.settings.matches[i].words[j];
                        // check if word exists in input text
                        if( notOverMaxText.indexOf( matchText ) !== -1 ){
                            matchTextList.push( matchText );
                            spanText = '<span class="'+ _this.settings.matches[i].className +'">'+ matchText +'</span>';
                            notOverMaxText = notOverMaxText.replace( new RegExp( _escapeRegExp( matchText ), 'g'), spanText );
                        }
                    }
                }

                // update background div content
                _this.$backgroundDiv.html( notOverMaxText + overMaxText );
                // trigger update event
                _this.$element.trigger('textarea.highlighter.update', {'textList': matchTextList});
            }, 30);

            _this.$element.data('highlighterTimerId', changeId);
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
    var _escapeRegExp = function(str){
        return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
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