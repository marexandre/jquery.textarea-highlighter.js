/**
 * jquery.textareaHighlighter.js 0.2.0
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
            paddingTop   : parseInt( this.$element.css('padding-top'), 10 ),
            paddingRight : parseInt( this.$element.css('padding-right'), 10 ),
            paddingBottom: parseInt( this.$element.css('padding-bottom'), 10 ),
            paddingLeft  : parseInt( this.$element.css('padding-left'), 10 ),
        };

        // Hack for firefox, some how width needs to be 2px smallet then the textarea
        // and padding-left needs to be added 1px
        if( browser.firefox ){
            this.style.paddingRight += 1;
            this.style.paddingLeft += 1;
        }
        if( browser.iphone ){
            // this.style.paddingRight += 3;
            this.style.paddingLeft += 3;
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
                'margin'       : 0
            });
            $backgroundDiv.addClass('background-div').addClass( $this.attr('class') ).css({
                'height'          : '100%',
                'color'           : ( settings.debug ) ? '#f00' : 'transparent',
                'background-color': ( settings.debug ) ? '#fee' : style.backgroundColor,
                'padding-top'   : style.paddingTop,
                'padding-right' : style.paddingRight,
                'padding-bottom': style.paddingBottom,
                'padding-left'  : style.paddingLeft,
                'position'      : 'absolute',
                'overflow'      : 'auto'
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
                    if (/(37|38|39|40)/.test(e.keyCode)) { return; }
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
                        // trigger update event
                        $this.trigger('textarea.highlighter.update', {'textList': matchTextList});
                    }, 30);

                    $this.data('changeTimerId', changeId);
                });


            // insert backgroundDiv
            $this.wrap( $wrapDiv ).before( $backgroundDiv );
            // do initial check for input
            $this.trigger('keydown');
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