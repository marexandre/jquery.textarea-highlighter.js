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
                .autosize()
                .textareaHighlighter({
                    // maxlength: 150,
                    matches: [
                        {'className': 'matchHighlight', 'words': getUniqueWordListFromSource( $this.find('.source').find('.match') )},
                        {'className': 'hogeHighlight', 'words': getUniqueWordListFromSource( $this.find('.source').find('.hoge') )}
                    ]
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
                    // maxlength: 150,
                    maxlengthWarning: 'warning',
                    maxlengthElement: $this.find('.maxlength')
                });
        });

    });

});