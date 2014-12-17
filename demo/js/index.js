$(function(){
  'use strict';

  var brackets = ['[[[text here too]]]'];
  var glossary = ['here for', 'for they', 'for me', 'here too'];
  var misspelling = ['for', 'for them', 'here'];

  $('.translation').find('.target')
    .textareaHighlighter({
      matches: [
        {'matchClass': 'matchHighlight', 'match': brackets, 'priority': 2 },
        {'matchClass': 'hogeHighlight', 'match': misspelling, 'priority': 0 },
        {'matchClass': 'fugaHighlight', 'match': glossary, 'priority': 1 }
      ]
    });

  // Example wit hmax character limitation
  var $translationMax = $('.translation-max');
  $translationMax.find('.target')
    .textareaHighlighter({
      matches: [
        {'matchClass': 'matchHighlight', 'match': brackets, 'priority': 2 },
        {'matchClass': 'hogeHighlight', 'match': misspelling, 'priority': 0 },
        {'matchClass': 'fugaHighlight', 'match': glossary, 'priority': 1 }
      ],
      maxlength: 150,
      maxlengthWarning: 'warning',
      maxlengthElement: $translationMax.find('.maxlength')
    });

});
