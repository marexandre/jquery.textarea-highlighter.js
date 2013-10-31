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
            rules: [
                {'target': '', 'className': ''}
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

        this.init();
    }

    Plugin.prototype = {
        init: function () {

            var _this          = this,
                $this          = $(this.element),
                $source        = $this.closest('.translation').find('.source'),
                $wrapDiv       = $(document.createElement('div')).addClass('textarea-wrap'),
                $backgroundDiv = $(document.createElement('div'));

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

            if( _this.settings.isDebug ){
                var $debug = $(document.createElement('div')).css({
                    'margin-top': '20px',
                    'font-size': '12px',
                    'color': '#999',
                    'padding': '3px 10px',
                    'background-color': '#f8f8f8'
                }).html('debug:');
                $this.after($debug);

                var startTime = 0;
            }


            // TODO: move into a function ▽▽▽▽▽▽
            var sourceHash = {},
                classNameHash = {},
                i = 0,
                imax = _this.settings.rules.length;
            for ( i = 0; i < imax; i++ ) {
                var rule = _this.settings.rules[i],
                    target = rule.target;

                if( ! classNameHash[ target ] ){
                    classNameHash[ target ] = [];
                }
                classNameHash[ target ].push( _this.settings.rules[i].className );

                $source.find( target ).each(function(){
                    if( ! sourceHash[ target ] ){
                        sourceHash[ target ] = [];
                    }
                    sourceHash[ target ].push({'text': $(this).text(), 'className': rule.className });
                });
            }

            var tmpText = {},
                tmpClassName = {},
                key;
            for( key in sourceHash ){
                var s = sourceHash[key];

                for( var ii = 0; ii < s.length; ii++ ){
                    if( ! tmpText.hasOwnProperty( s[ii].text ) ){
                        tmpText[s[ii].text] = key;
                    }
                    if( ! tmpClassName.hasOwnProperty( s[ii].className ) ){
                        tmpClassName[key] = s[ii].className;
                    }
                }
            }

            var uniqueText = {};
            for( key in tmpText ){
                if( ! uniqueText[ tmpText[key] ] ){
                    uniqueText[ tmpText[key] ] = [];
                }
                uniqueText[ tmpText[key] ].push( key );
            }
            // TODO: move into a function △△△△△△


            $this
                .on('scroll', function(){
                    $backgroundDiv.scrollTop( $this.scrollTop() );
                })

                .on('change input', function(e){

                    var textareaText = $(document.createElement('div')).text( $this.val() ).html(),
                        key, ruleTextList, ruleText, spanText, i, imax;

                    // DEBUG
                    if( _this.settings.isDebug ){
                        startTime = new Date().getTime();
                    }
                    // DEBUG

                    for (key in uniqueText) {
                        ruleTextList = uniqueText[key];
                        for( i = 0, imax = ruleTextList.length; i < imax; i++ ){
                            ruleText = ruleTextList[i],
                            spanText = '<span class="'+ tmpClassName[key] +'">'+ ruleText +'</span>';

                            if( textareaText.indexOf( ruleText ) !== -1 ){
                                textareaText = textareaText.replace( new RegExp( _escapeRegExp( ruleText ), 'g'), spanText );
                            }
                        }
                    }
                    // DEBUG
                    if( _this.settings.isDebug ){
                        $debug.html( new Date().getTime() - startTime );
                    }
                    // DEBUG

                    $backgroundDiv.html( textareaText );

                    // update size
                    if( $backgroundDiv.height() !== $this.height() ){
                        $backgroundDiv.css({
                            'width' : $this.outerWidth() - _this.widthExtra,
                            'height': $this.height()
                        });
                    }
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