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

    $(function(){

        $('.translation').each(function(){
            var $this = $(this);

            $this.find('.target')
                .on('autosize.resize', function(){
                    // $(this).trigger('resize');
                })
                .autosize()
                .textareaHighlighter({
                    // maxLength: 150,
                    matches: [
                        {'className': 'matchHighlight', 'words': getUniqueWordListFromSource( $this.find('.source').find('.match') )},
                        {'className': 'hogeHighlight', 'words': getUniqueWordListFromSource( $this.find('.source').find('.hoge') )}
                    ],
                    isDebug: false
                });
        });


        $('.translation-max').each(function(){
            var $this = $(this);

            $this.find('.target')
                .autosize()
                .textareaHighlighter({
                    matches: [
                        {'className': 'matchHighlight', 'words': getUniqueWordListFromSource( $this.find('.source').find('.match') )},
                        {'className': 'hogeHighlight', 'words': getUniqueWordListFromSource( $this.find('.source').find('.hoge') )}
                    ],
                    maxLength: 150,
                    maxLengthClass: 'over-max',
                    maxLengthElement: $this.find('.max-length'),
                    isDebug: false
                });
        });

    });

});