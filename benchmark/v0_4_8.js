
var marexandre;
var helper = new marexandre.Helper();

var v0_4_8 = function(text, list) {
  var i = 0, imax = 0, j = 0, jmax = 0,
      matchesList = [], matchTextList = [],
      matchText = '', matchTextEscape = '', matchClass = '',
      matched = null;

  // check for matching words
  for (i = 0, imax = list.length; i < imax; i++) {
    // check if match match is a RegExp
    if (list[i].match instanceof RegExp) {
      // set matched words array
      matchesList = helper.getUniqueArray( text.match( list[i].match ) || [] );
    }
    else {
      // copy words array
      matchesList = list[i].match;
    }

    for (j = 0, jmax = matchesList.length; j < jmax; j++) {
      // get word to match
      matchText = matchesList[j];
      matchTextEscape = helper.escapeHTML( matchText );
      matchClass = '';

      matched = text.match(new RegExp( helper.escapeRegExp(matchTextEscape), 'g' ));
      // check if word exists in input text
      if (matched && 0 < matched.length){
        matchTextList.push({
          text: matchText,
          matched: matched
        });

        // check for match class name
        if (list[i].hasOwnProperty('matchClass')) {
          matchClass = list[i].matchClass;
        }
        // update replaced text
        text = getWrapedText( text, matchTextEscape, matchClass );
      }
    }
  }

  return {
    'txt': text,
    'matchedList': matchTextList
  };
};

var getWrapedText = function(text, matchedText, matchClass) {
  var matchTextEscape = helper.escapeRegExp( matchedText );
  return text.replace( new RegExp( '(' + matchTextEscape + '|<(?:(?!\\sclass="|>).)+\\sclass="*"[^>]*>|<\\/[^>]+>)', 'g'), function() {
    if ( matchedText === arguments[0] ) {
      return helper.getTextInSpan( matchClass, matchedText );
    } else {
      return arguments[0];
    }
  });
}
