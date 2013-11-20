jquery.textarea-highlighter.js
==============================

jQuery plugin for highlighting text in textarea : [DEMO](http://marexandre.github.io/jquery.textarea-highlighter.js/demo/ "DEMO")


# Usage

This is the basic usage in javascript:

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

This is the basic using with data- in HTML:

```html
<textarea data-maxlength="150" data-debug="true" data-maxlength-warning="warning"></textarea>
```

# Events

Event triggered when a matching text is found

```javascript
$('#someElement').on('textarea.highlighter.update', function(e, data){
    // data -> {'textList': []}
    // textList is an arry with matched text
});
```

# Options

These are the supported options and their default values:

```javascript
$.textareaHighlighter.defaults = {
    matches: [                          // Array of matches with className & word array
    // {'className': '', 'words': []}   // Match template
    ],
    maxlength: -1,                      // -1: disable, some int number over 0
    maxlengthWarning: '',               // Class name to add to text when it's over max length
    maxlengthElement: null,             // jQuery element to update letter count in the view
    debug: false                        // Flag to show debug mode
};
```

# Tested

- Chrome 30+, FireFox 24+, IE 9+ (OSX & PC)
- Latest Safari & Chrome for ios 7+
