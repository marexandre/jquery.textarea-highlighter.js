/**
 * jquery.textareaHighlighter.js 0.1.5
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
            debug: false
        };

    // constructor
    function Plugin ( element, options ) {
        this.element   = element;
        this.$element  = $(this.element);
        this.settings  = $.extend( {}, defaults, this.$element.data(), options );
        this._defaults = defaults;
        this._name     = pluginName;

        // textarea style
        this.style = {
            backgroundColor: this.$element.css('background-color'),
            paddingTop   : parseInt( this.$element.css('padding-top'), 10 ),
            paddingRight : parseInt( this.$element.css('padding-right'), 10 ),
            paddingBottom: parseInt( this.$element.css('padding-bottom'), 10 ),
            paddingLeft  : parseInt( this.$element.css('padding-left'), 10 ),
            borderTop    : parseInt( this.$element.css('border-top-width'), 10 ),
            borderRight  : parseInt( this.$element.css('border-right-width'), 10 ),
            borderBottom : parseInt( this.$element.css('border-bottom-width'), 10 ),
            borderLeft   : parseInt( this.$element.css('border-left-width'), 10 ),
            lineHeight   : this.$element.css('line-height')
        };

        this.widthExtra = this.style.paddingLeft + this.style.paddingRight + this.style.borderLeft + this.style.borderRight;

        this.style.paddingTop += this.style.borderTop;
        this.style.paddingLeft += this.style.borderLeft;

        // Hack for firefox, some how width needs to be 2px smallet then the textarea
        // and padding-left needs to be added 1px
        if( browser.firefox ){
            this.widthExtra += 2;
            this.style.paddingLeft += 1;
        }
        // Hack for iphone, some how in iphone it adds 3px to textarea padding
        if( browser.iphone ){
            this.style.paddingRight += 3;
            this.style.paddingLeft += 3;
            this.widthExtra += 6;
        }

        this.init();
    }

    Plugin.prototype = {
        init: function() {

            var _this          = this,
                $this          = this.$element,
                style          = this.style,
                settings       = this.settings,
                $wrapDiv       = $(document.createElement('div')).addClass('textarea-wrap'),
                $backgroundDiv = $(document.createElement('div'));

            $wrapDiv.css({
                'position'     : 'relative',
                'word-wrap'    : 'break-word',
                'word-break'   : 'break-all',
                'margin'       : 0,
                'padding-right': style.paddingLeft + style.paddingRight + style.borderLeft + style.borderRight + 'px'
            });
            $backgroundDiv.addClass('background-div').css({
                'height': 0,
                'width' : 0,
                'color'           : ( settings.debug ) ? '#f00' : 'transparent',
                'background-color': ( settings.debug ) ? '#fee' : style.backgroundColor,
                'line-height'   : style.lineHeight,
                'padding-top'   : style.paddingTop,
                'padding-right' : style.paddingRight,
                'padding-bottom': style.paddingBottom,
                'padding-left'  : style.paddingLeft,
                'position'      : 'absolute',
                'overflow'      : 'auto',
                'white-space'   : 'pre-wrap'
            });


            $this
                .data('changeTimerId', -1)
                .css({
                    'color'     : ( settings.debug ) ? 'rgba(0,0,0,0.5)' : 'inherit',
                    'position'  : 'relative',
                    'background': 'transparent'
                })
                // Bind events
                .on('scroll', function(){
                    $backgroundDiv.scrollTop( $this.scrollTop() );
                })
                .on('change keydown keyup paste', function(e){
                    // if arrow keys, don't do anything
                    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) { return; }
                    // check for last update, this is for performace
                    if ($this.data('changeTimerId') !== -1) {
                        clearTimeout( $this.data('changeTimerId') );
                        $this.data('changeTimerId', -1);
                    }

                    var changeId = setTimeout(function(){
                        var textareaText = $(document.createElement('div')).text( $this.val() ).html(),
                            key, ruleTextList, matchText, spanText, matchTextList = [],
                            notOverMaxText = '', overMaxText ='',
                            i, imax, j, jmax, maxSize;

                        if (0 < settings.maxlength) {
                            // check for max length
                            if ( settings.maxlength < $this.val().length) {
                                matchText = $this.val().slice( settings.maxlength, settings.maxlength + $this.val().length - 1 );
                                overMaxText = '<span class="'+ settings.maxlengthWarning +'">'+ matchText +'</span>';

                            }
                            // update maxlength
                            if (settings.maxlengthElement !== null) {
                                maxSize = settings.maxlength - $this.val().length;
                                if (maxSize < 0) {
                                    if (! settings.maxlengthElement.hasClass( settings.maxlengthWarning )) {
                                        settings.maxlengthElement.addClass( settings.maxlengthWarning );
                                    }
                                }
                                else {
                                    if (settings.maxlengthElement.hasClass( settings.maxlengthWarning )) {
                                        settings.maxlengthElement.removeClass( settings.maxlengthWarning );
                                    }
                                }
                                // update max length
                                settings.maxlengthElement.text( maxSize );
                            }

                            notOverMaxText = $this.val().slice( 0, settings.maxlength );
                        }
                        else {
                            notOverMaxText = textareaText;
                        }

                        // check for matching words
                        for (i = 0, imax = settings.matches.length; i < imax; i++) {
                            for (j = 0, jmax = settings.matches[i].words.length; j < jmax; j++) {
                                // get word to match
                                matchText = settings.matches[i].words[j];
                                // check if word exists in input text
                                if( notOverMaxText.indexOf( matchText ) !== -1 ){
                                    matchTextList.push( matchText );
                                    spanText = '<span class="'+ settings.matches[i].className +'">'+ matchText +'</span>';
                                    notOverMaxText = notOverMaxText.replace( new RegExp( _escapeRegExp( matchText ), 'g'), spanText );
                                }
                            }
                        }

                        // update background div content
                        $backgroundDiv.html( notOverMaxText + overMaxText );
                        // check if textarea changed size
                        _this.resize( $this, $backgroundDiv );
                        // trigger update event
                        $this.trigger('textarea.highlighter.update', {'textList': matchTextList});
                    }, 30);

                    $this.data('changeTimerId', changeId);
                });


            // insert backgroundDiv
            $this.wrap( $wrapDiv ).before( $backgroundDiv );
            // adjust size
            _this.resize( $this, $backgroundDiv );
            // do initial check for input
            $this.trigger('keydown');
        },
        /**
         * update backgroundDiv size
         * @param  {jQuery} $target
         * @param  {jQuery} $bgDiv
         */
        resize: function( $target, $bgDiv ) {
            var _this = this;

            if ($bgDiv.height() !== $target.height() || $bgDiv.width() !== $target.width()) {
                $bgDiv.css({
                    'width' : $target.outerWidth() - _this.widthExtra,
                    'height': $target.height()
                });
            }
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