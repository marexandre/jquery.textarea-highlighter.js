$(function(){

    var getUniqueArray = function( array ){
        return array.filter(function(elem, pos, self) {
            return self.indexOf(elem) === pos;
        });
    };

    var getUniqueWordListFromSource = function( $target ){
        var tmpArray = [];
        $target.each(function(){
            tmpArray.push( $(this).text() );
        });

        return getUniqueArray( tmpArray );
    };

    var getUniqueElementListFromSource = function( $target ){
        var tmpObj = {}, $this = null;
        $target.each(function(){
            $this = $(this);
            if (! tmpObj.hasOwnProperty($this.text())) {
                tmpObj[ $this.text() ] = [];
            }
            tmpObj[ $this.text() ].push( $this );
        });
        return tmpObj;
    };

    var matchDelayTimerId = -1;
    var checkForMatchInSource = function( $source, elementObj, data ){
        if (matchDelayTimerId !== -1) {
            clearTimeout(matchDelayTimerId);
            matchDelayTimerId = -1;
        }
        matchDelayTimerId = setTimeout(function(){
            matchDelayTimerId = -1;
            var i = 0, j = 0, imax = 0, jmax = 0, tmpList = null, tmpText = null;

            $source.find('.added').removeClass('added');

            imax = data.textList.length;

            for (i = 0; i < imax; i++) {
                tmpText = data.textList[i];

                if (elementObj[ tmpText ]) {
                    tmpList = elementObj[ tmpText ];
                    jmax = tmpList.length;

                    for (j = 0; j < jmax; j++) {
                        tmpList[j].addClass('added');
                    }
                }
            }
        }, 80);
    };


    $(function(){

        $('.translation').each(function(){
            var $this = $(this),
                $source = $this.find('.source'),
                $target = $this.find('.target'),
                elementObj = getUniqueElementListFromSource($this.find('.source').find('.match, .hoge, .fuga'));

            $target
                .autosize()
                .on('textarea.highlighter.update', function(e, data){
                    checkForMatchInSource( $source, elementObj, data);
                })
                .textareaHighlighter({
                    matches: [
                        {'matchClass': 'matchHighlight', 'rule': getUniqueWordListFromSource( $source.find('.match') )},
                        {'matchClass': 'hogeHighlight', 'rule': getUniqueWordListFromSource( $source.find('.hoge') )},
                        {'matchClass': 'fugaHighlight', 'rule': getUniqueWordListFromSource( $source.find('.fuga') )}
                    ]
                });
        });


        $('.translation-max').each(function(){
            var $this = $(this),
                $source = $this.find('.source'),
                $target = $this.find('.target'),
                elementObj = getUniqueElementListFromSource($this.find('.source').find('.match, .hoge, .fuga'));

            $target
                .autosize()
                .on('textarea.highlighter.update', function(e, data){
                    checkForMatchInSource( $source, elementObj, data);
                })
                .textareaHighlighter({
                    matches: [
                        {'matchClass': 'matchHighlight', 'rule': getUniqueWordListFromSource( $source.find('.match') )},
                        {'matchClass': 'hogeHighlight', 'rule': getUniqueWordListFromSource( $source.find('.hoge') )},
                        {'matchClass': 'fugaHighlight', 'rule': getUniqueWordListFromSource( $source.find('.fuga') )}
                    ],
                    // maxlength: 150,
                    maxlengthWarning: 'warning',
                    maxlengthElement: $this.find('.maxlength')
                });
        });

    });

});