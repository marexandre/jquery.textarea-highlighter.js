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
        var tmpObj = {};
        $target.each(function(){
            if (! tmpObj.hasOwnProperty($(this).text())) {
                tmpObj[ $(this).text() ] = [];
            }
            tmpObj[ $(this).text() ].push( $(this) );
        });
        return tmpObj;
    };

    $(function(){

        $('.translation').each(function(){
            var $this = $(this),
                $source = $this.find('.source'),
                $target = $this.find('.target'),
                elementObj = getUniqueElementListFromSource($this.find('.source').find('.match, .hoge'));

            $target
                .autosize()
                .on('textarea.highlighter.match', function(e, data){

                    $source.find('.added').removeClass('added');

                    var i = 0, j = 0, imax = 0, jmax = 0, tmpList = null, tmpText = null;

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
                })
                .textareaHighlighter({
                    // maxlength: 150,
                    matches: [
                        {'className': 'matchHighlight', 'words': getUniqueWordListFromSource( $source.find('.match') )},
                        {'className': 'hogeHighlight', 'words': getUniqueWordListFromSource( $source.find('.hoge') )}
                    ]
                });
        });


        $('.translation-max').each(function(){
            var $this = $(this),
                $source = $this.find('.source'),
                $target = $this.find('.target');

            $target
                .autosize()
                .textareaHighlighter({
                    matches: [
                        {'className': 'matchHighlight', 'words': getUniqueWordListFromSource( $source.find('.match') )},
                        {'className': 'hogeHighlight', 'words': getUniqueWordListFromSource( $source.find('.hoge') )}
                    ],
                    // maxlength: 150,
                    maxlengthWarning: 'warning',
                    maxlengthElement: $this.find('.maxlength')
                });
        });

    });

});