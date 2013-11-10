###
    jquery.textareaHighlighter.js 0.1.1
    jQuery plugin for highlighting text in textarea.

    alexandre.kirillov@gengo.com
    MIT license. http://opensource.org/licenses/MIT
###
do ($ = jQuery, window, document) ->
    "use strict"

    # Create the defaults once
    pluginName = "textareaHighlighter"
    defaults =
        maxLength: -1
        maxClass: 'error'
        matches: [
            # {'className': '', 'words': []}
        ]
        isDebug: false

    # The actual plugin constructor
    class Plugin
        constructor: (@element, options) ->
            @$element  = $(@element)
            @settings  = $.extend {}, defaults, options
            @_defaults = defaults
            @_name     = pluginName

            # textarea style
            @style =
                backgroundColor: @$element.css('background-color')
                paddingTop     : parseInt @$element.css('padding-top'), 10
                paddingRight   : parseInt @$element.css('padding-right'), 10
                paddingBottom  : parseInt @$element.css('padding-bottom'), 10
                paddingLeft    : parseInt @$element.css('padding-left'), 10
                borderTop      : parseInt @$element.css('border-top-width'), 10
                borderRight    : parseInt @$element.css('border-right-width'), 10
                borderBottom   : parseInt @$element.css('border-bottom-width'), 10
                borderLeft     : parseInt @$element.css('border-left-width'), 10
                lineHeight     : @$element.css('line-height')

            # calculate width
            @widthExtra = @style.paddingLeft + @style.paddingRight + @style.borderLeft + @style.borderRight
            # update padding
            @style.paddingTop += @style.borderTop
            @style.paddingLeft += @style.borderLeft

            # Hack for firefox, some how width needs to be 2px smallet then the textarea
            # and padding-left needs to be added 1px
            if browser.firefox
                @widthExtra += 2
                @style.paddingLeft += 1

            # Hack for iphone, some how in iphone it adds 3px to textarea padding
            if browser.iphone
                @style.paddingRight += 3
                @style.paddingLeft += 3
                @widthExtra += 6

            # Hack for ie
            if browser.msie
                @style.paddingTop += -1
                @style.paddingLeft += 1
                @style.paddingBottom += 2

            @init()

        init: ->
            _this          = @
            $this          = @$element
            style          = @style
            settings       = @settings
            $wrapDiv       = $(document.createElement('div')).addClass('textarea-wrap')
            $backgroundDiv = $(document.createElement('div'))
            lastUpdate     = new Date().getTime()

            $wrapDiv.css
                'position'     : 'relative'
                'word-wrap'    : 'break-word'
                'word-break'   : 'break-all'
                'margin'       : 0
                'padding-right': style.paddingLeft + style.paddingRight + style.borderLeft + style.borderRight + 'px'

            $backgroundDiv.addClass('background-div').css
                'height'          : 0
                'width'           : 0
                'color'           : if settings.isDebug then '#f00' else 'transparent'
                'background-color': if settings.isDebug then '#fee' else style.backgroundColor
                'line-height'     : style.lineHeight
                'padding-top'     : style.paddingTop
                'padding-right'   : style.paddingRight
                'padding-bottom'  : style.paddingBottom
                'padding-left'    : style.paddingLeft
                'position'        : 'absolute'
                'overflow'        : 'auto'
                'white-space'     : 'pre-wrap'

            $this.css
                'color'     : if settings.isDebug then 'rgba(0,0,0,0.5)' else 'inherit'
                'position'  : 'relative'
                'background': 'transparent'

            $this
                .on 'scroll', ->
                    $backgroundDiv.scrollTop $this.scrollTop()

                .on 'change keyup keydown', (e) ->
                    # if arrow keys, don't do anything
                    return if e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40
                    # check for last update, this is for performace
                    return if new Date().getTime() - lastUpdate < 30

                    textareaText = $(document.createElement('div')).text( $this.val() ).html()
                    notOverMaxText = ""
                    overMaxText = ""
                    # check for max length
                    if 0 < settings.maxLength
                        # check for max length
                        if settings.maxLength < $this.val().length
                            matchText = $this.val().slice( settings.maxLength, settings.maxLength + $this.val().length - 1 )
                            overMaxText = "<span class='#{ settings.maxClass }'>#{ matchText }</span>"

                        notOverMaxText = $this.val().slice( 0, settings.maxLength )
                    else
                        notOverMaxText = textareaText;

                    # check for matching words
                    for matches, i in settings.matches
                        for words, j in matches.words
                            # check if word exists in input text
                            if notOverMaxText.indexOf( words ) != -1
                                spanText = "<span class='#{ matches.className }'>#{ words }</span>"
                                notOverMaxText = notOverMaxText.replace( new RegExp( _escapeRegExp( words ), 'g'), spanText )

                    # update background div content
                    $backgroundDiv.html( notOverMaxText + overMaxText )
                    # check if textarea changed size
                    _this.resize( $this, $backgroundDiv )
                    # save last update time
                    lastUpdate = new Date().getTime()

            $this.wrap( $wrapDiv ).before( $backgroundDiv )
            _this.resize( $this, $backgroundDiv )

        # FUNCTIONS

        # update backgroundDiv size
        # @param  {jQuery} $target
        # @param  {jQuery} $bgDiv
        resize: ( $target, $bgDiv ) ->
            _this = @;

            if $bgDiv.height() != $target.height() || $bgDiv.width() != $target.width()
                $bgDiv.css
                    'width' : $target.outerWidth() - _this.widthExtra
                    'height': $target.height()

    # A really lightweight plugin wrapper around the constructor,
    # preventing against multiple instantiations
    $.fn[pluginName] = (options) ->
        @each ->
            if !$.data(@, "plugin_#{pluginName}")
                $.data(@, "plugin_#{pluginName}", new Plugin(@, options))

    #
    # HELPER FUNCTIONS
    #
    # escape RegExp
    _escapeRegExp = (str) ->
        return str.replace /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"

    # check browser type
    browser = do ->
        userAgent = window.navigator.userAgent
        msie      = /(msie|trident)/i.test( userAgent )
        chrome    = /chrome/i.test( userAgent )
        firefox   = /firefox/i.test( userAgent )
        safari    = /safari/i.test( userAgent ) && !chrome
        iphone    = /iphone/i.test( userAgent )

        return msie:true if msie
        return chrome:true if chrome
        return firefox:true if firefox
        return iphone:true if iphone
        return safari:true if safari
        # if no browser match
        return {
            msie   : false
            chrome : false
            firefox: false
            safari : false
            iphone : false
        }
