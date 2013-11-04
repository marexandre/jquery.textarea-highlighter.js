/**
 * jquery.textareaHighlighter.js 0.1.0
 * Plugin for highlighting text in textarea.
 *
 * alexandre.kirillov@gengo.com
 * MIT license. http://opensource.org/licenses/MIT
 */
;(function ( $, window, document, undefined ) {
    "use strict";

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

    /**
     *
     * PLUGIN CORE
     *
     */
    var pluginName = "textareaHighlighter",
        defaults = {
            matches: [
                {'className': '', 'words': []}
            ],
            isDebug: false
        };

    // constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.$element = $(element);
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

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
        if( browser.msie ){
            this.style.paddingTop += -1;
            this.widthExtra += 1;
        }

        this.init();
    }

    Plugin.prototype = {
        init: function () {

            var _this          = this,
                $this          = $(this.element),
                $wrapDiv       = $(document.createElement('div')).addClass('textarea-wrap'),
                $backgroundDiv = $(document.createElement('div')),
                lastUpdate     = new Date().getTime();

            $wrapDiv.css({
                'position'     : 'relative',
                'word-wrap'    : 'break-word',
                'word-break'   : 'break-all',
                'margin'       : 0,
                'padding-right': _this.style.paddingLeft + _this.style.paddingRight + _this.style.borderLeft + _this.style.borderRight + 'px'
            });
            $backgroundDiv.addClass('background-div').css({
                'height': 0,
                'width' : 0,
                'color'           : ( _this.settings.isDebug ) ? '#f00' : 'transparent',
                'background-color': ( _this.settings.isDebug ) ? '#fee' : _this.style.backgroundColor,
                'line-height'   : _this.style.lineHeight,
                'padding-top'   : _this.style.paddingTop,
                'padding-right' : _this.style.paddingRight,
                'padding-bottom': _this.style.paddingBottom,
                'padding-left'  : _this.style.paddingLeft,
                'position'      : 'absolute',
                'overflow'      : 'auto',
                'white-space'   : 'pre-wrap'
            });
            $this.css({
                'color'     : ( _this.settings.isDebug ) ? 'rgba(0,0,0,0.5)' : 'inherit',
                'position'  : 'relative',
                'background': 'transparent'
            });

            $this
                .on('scroll', function(){
                    $backgroundDiv.scrollTop( $this.scrollTop() );
                })
                .on('change input', function(e){

                    if (new Date().getTime() - lastUpdate < 50) { return; }

                    console.log( "leng    :: "+ $this.val().length );
                    console.log( "caret   :: "+ $this.caret() );
                    console.log( "substr  :: "+ $this.val().substr( $this.caret() - 10, 20 ) );
                    console.log("- - - - - -");

                    var textareaText = $(document.createElement('div')).text( $this.val() ).html(),
                        key, ruleTextList, matchText, spanText, i, imax, j, jmax;

                    for (i = 0, imax = _this.settings.matches.length; i < imax; i++) {
                        for (j = 0, jmax = _this.settings.matches[i].words.length; j < jmax; j++) {
                            // get word to match
                            matchText = _this.settings.matches[i].words[j];
                            // check if word exists in input text
                            if( textareaText.indexOf( matchText ) !== -1 ){
                                spanText = '<span class="'+ _this.settings.matches[i].className +'">'+ matchText +'</span>';
                                textareaText = textareaText.replace( new RegExp( _escapeRegExp( matchText ), 'g'), spanText );
                            }
                        }
                    }

                    $backgroundDiv.html( textareaText );

                    // update size
                    if( $backgroundDiv.height() !== $this.height() || $backgroundDiv.width() !== $this.width() ){
                        $backgroundDiv.css({
                            'width' : $this.outerWidth() - _this.widthExtra,
                            'height': $this.height()
                        });
                    }

                    lastUpdate = new Date().getTime();
                });


            $this.wrap( $wrapDiv ).before( $backgroundDiv );
        }
    };

    /**
     *
     * HELPER FUNCTIONS
     *
     */
    var _escapeRegExp = function(str){
        return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
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

})( jQuery, window, document );