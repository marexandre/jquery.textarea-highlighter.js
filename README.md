jquery.textarea-highlighter.js
==============================

jQuery plugin for highlighting text in textarea : [DEMO](http://marexandre.github.io/jquery.textarea-highlighter.js/demo/ "DEMO")



## Usage

```javascript

	// can be a class too $('.someElement')
	$('#someElement').textareaHighlighter({ 
        matches: [
            {'className': 'match', 'words': ['this is a test', 'text to match']},
            {'className': 'someClass', 'words': ['some', 'more', 'here']},            
        ]
        maxlength: 150,
        maxlengthWarning: 'warning',
        maxlengthElement: $('#someElement').find('.maxlength')

    });

```