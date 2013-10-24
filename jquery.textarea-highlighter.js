;(function ( $, window, document, undefined ) {
    "use strict";

    var pluginName = "textareaHighlighter",
        defaults = {
            match: [
                {'name': '.match', 'color': '#09f'},
                {'name': '.hoge', 'color': '#4c9'},
            ]
        };

    // constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {

            var _this          = this,
                $this          = $(this.element),
                $source        = $this.closest('.translation').find('.source'),
                $div           = $(document.createElement('div')).addClass('textarea-wrap').css({ 'position': 'relative' }),
                $backgroundDiv = $(document.createElement('div'));

            $backgroundDiv.addClass('background-div').css({
                'height'  : $this.height(),
                'position': 'absolute',
                'overflow': 'auto'
            });
            $this.css({
                'position': 'relative',
                'background': 'transparent'
            });

            $this
                .on('scroll', function(){
                    $backgroundDiv.scrollTop( $this.scrollTop() );
                })

                .on('change input', function(e){

                    var textareaText = $(document.createElement('div')).text( $this.val() ).html();

                    for ( var i = 0, imax = _this.settings.match.length; i < imax; i++ ) {
                        $source.find( _this.settings.match[i].name ).each(function(){
                            var $_this      = $(this),
                                matchText   = $_this.text(),
                                replaceText = '<span style="background-color: '+ _this.settings.match[i].color +'">'+ matchText +'</span>';

                            var reg = new RegExp( _escapeRegExp( matchText ), 'g');
                            if( reg.test( textareaText) ){
                                textareaText = textareaText.replace( reg, replaceText );
                                $_this.addClass('added');
                            }
                            else{
                                $_this.removeClass('added');
                            }
                        });
                    }
                    $backgroundDiv.html( textareaText );

                    // update size
                    if( $backgroundDiv.height() !== $this.height() ){
                        $backgroundDiv.css({
                            'width' : $this.width(),
                            'height': $this.height()
                        });
                    }
                });


            $this.wrap( $div ).before( $backgroundDiv );
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