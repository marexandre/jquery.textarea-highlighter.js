jquery.textarea-highlighter.js
==============================

jQuery plugin for highlighting text in textarea : [DEMO](http://marexandre.github.io/jquery.textarea-highlighter.js/demo/ "DEMO")



## Usage

```javascript

	$('.someElement').textareaHighlighter({
        matches: [
            {'className': 'matchHighlight', 'words': ['this is a test', 'text to match']},
            {'className': 'someClass', 'words': ['some', 'more', 'here']}
        ]
    });

```