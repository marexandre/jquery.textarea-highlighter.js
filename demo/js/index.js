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

  var checkForMatchInSource = function( $source, elementObj, data ){
    if ($source.data('th-delay-timer-id') !== -1) {
      clearTimeout($source.data('th-delay-timer-id'));
      $source.data('th-delay-timer-id', -1);
    }

    var id = setTimeout(function(){
      $source.data('th-delay-timer-id', -1);
      var i = 0, j = 0, imax = 0, jmax = 0, tmpList = null, tmpText = null;

      $source.find('.added').removeClass('added');

      imax = data.textList.length;

      for (i = 0; i < imax; i++) {
        tmpText = data.textList[i].text;
        // check if text exists in source
        if (elementObj[ tmpText ]) {
          tmpList = elementObj[ tmpText ];
          jmax = data.textList[i].matched.length;

          for (j = 0; j < jmax; j++) {
            tmpList[j].addClass('added');
          }
        }
      }
    }, 80);
    $source.data('th-delay-timer-id', id);
  };


  $(function(){

    $('.translation').each(function(){
      var $this = $(this),
        $source = $this.find('.source'),
        $target = $this.find('.target'),
        elementObj = getUniqueElementListFromSource($this.find('.source').find('.match, .hoge, .fuga'));

      $target
        .on('textarea.highlighter.update', function(e, data){
          checkForMatchInSource( $source, elementObj, data);
        })
        .textareaHighlighter({
          matches: [
            {'matchClass': 'matchHighlight', 'match': getUniqueWordListFromSource( $source.find('.match') )},
            {'matchClass': 'hogeHighlight', 'match': getUniqueWordListFromSource( $source.find('.hoge') )},
            {'matchClass': 'fugaHighlight', 'match': getUniqueWordListFromSource( $source.find('.fuga') )}
          ]
        });
        // .expandingTextarea();
    });


    $('.translation-max').each(function(){
      var $this = $(this),
        $source = $this.find('.source'),
        $target = $this.find('.target'),
        elementObj = getUniqueElementListFromSource($this.find('.source').find('.match, .hoge, .fuga'));

      $target
        .on('textarea.highlighter.update', function(e, data){
          checkForMatchInSource( $source, elementObj, data);
        })
        .textareaHighlighter({
          matches: [
            {'matchClass': 'matchHighlight', 'match': getUniqueWordListFromSource( $source.find('.match') )},
            {'matchClass': 'hogeHighlight', 'match': getUniqueWordListFromSource( $source.find('.hoge') )},
            {'matchClass': 'fugaHighlight', 'match': getUniqueWordListFromSource( $source.find('.fuga') )}
          ],
          // maxlength: 150,
          maxlengthWarning: 'warning',
          maxlengthElement: $this.find('.maxlength')
        });
        // .expandingTextarea();
    });

  });

});
