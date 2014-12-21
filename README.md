[![Build Status](https://travis-ci.org/marexandre/jquery.textarea-highlighter.js.svg)](https://travis-ci.org/marexandre/jquery.textarea-highlighter.js)

jquery.textarea-highlighter.js
==============================

jQuery plugin for highlighting text in textarea

- [DEMO](http://marexandre.github.io/jquery.textarea-highlighter.js/demo/)


## Screen Shot
![screen shot](screenshot.png)


## Usage

This is the basic usage in javascript:

```javascript
// can be a class too $('.someElement')
$('#someElement').textareaHighlighter({
    matches: [
        {
            'match': ['this is a test', 'text to match'], // will check for this matches
            'matchClass': 'match'                         // on matched text this class will be added
        },
        {
            'match': ['some', 'more', 'here'],
            'matchClass': 'someClass'
        },
        {
            'match': /\{\/?\d+\}/g,
            'matchClass': 'tags'
        }
    ]
    maxlength: 150,
    maxlengthWarning: 'warning',
    maxlengthElement: $('#someElement').find('.maxlength')
});
```

You also can add setting with data- attribute in HTML:

```html
<textarea data-maxlength="150" data-debug="true"></textarea>
```

## Events

### textarea.highlighter.highlight
This event is triggered when all the highlighting is complete.

```javascript
$('#someElement').on('textarea.highlighter.highlight', function() {
    // do some cool stuff :)
});
```

## Methods

### updateMatches
Update matches that needed to be highlighted

```javascript
var matches = [ 'matchClass': 'match', 'match': ['a','b'] ];
$('#someElement').textareaHighlighter('updateMatches', matches);
```

### updateStyle
Update style added by plugin, use this when the `textarea` layout changes etc...

```javascript
$('#someElement').textareaHighlighter('updateStyle');
```

### updateHeight
Update textarea & plugins extra div's height

```javascript
$('#someElement').textareaHighlighter('updateHeight');
```

### destroy
Remove all added HTML/CSS and plugin related event bindings etc..

```javascript
$('#someElement').textareaHighlighter('destroy');
```

### debugModeOn
Turn debug mode on

```javascript
$('#someElement').textareaHighlighter('debugModeOn');
```

### debugModeOff
Turn debug mode off

```javascript
$('#someElement').textareaHighlighter('debugModeOff');
```

## All options

These are the supported options and their default values:

```javascript
$.textareaHighlighter.defaults = {
    matches: [               // Array of matches with matchClass & word array
    //    {
    //        'matchClass': 'match',
    //        'match': ['a','b'] or RegExp
    //    }
    ],
    word_base: true,         // Word base language is English, German etc. Set to false when it's Japanese, Chinese etc.
    isAutoExpand: true,      // Set to 'false' if you don't want to expand textarea on input
    typingDelay: 30          // Typing delay in milliseconds
    maxlength: -1,           // -1: disable, some int number over 0
    maxlengthWarning: '',    // Class name to add to text when it's over max length
    maxlengthElement: null,  // jQuery element to update letter count in the view
    debug: false,            // Flag to show debug mode
};
```

## Tested

- IE 9+
- Chrome 30+ (OSX & PC)
- FireFox 24+ (OSX & PC)
- Safari 7.0+
- ios 7.0+
    - Safari
    - Chrome
