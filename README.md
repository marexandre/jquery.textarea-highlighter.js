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
            'priority': 1,                                // if there is overlap with other matches it will highlight a match that has a higher priority
            'match': ['this is a test', 'text to match'], // will check for this matches
            'matchClass': 'match'                         // this class will be added to the matching string
        }, {
            'priority': 0,
            'match': ['some', 'more', 'here'],
            'matchClass': 'someClass'
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
var matches = [{ 'matchClass': 'match', 'match': ['a','b'] }];
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
        {
            'priority': 1,                                // if there is overlap with other matches it will highlight a match that has a higher priority
            'match': ['this is a test', 'text to match'], // will highlight text in this array
            'matchClass': 'match'                         // this class will be added to the matching string
        }
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


## Benchmark sample

`v0_4_8` is old version and `v0_6_0` is the latest

PhantomJS 1.9.8 (Mac OS X)
  Test with 5 matches: v0_6_0 at 16158 ops/sec (1.76x faster than v0_4_8)
  Test with 10 matches: v0_6_0 at 3391 ops/sec (1.30x faster than v0_4_8)
  Test with 25 matches: v0_6_0 at 1312 ops/sec (3.82x faster than v0_4_8)
  Test with 50 matches: v0_6_0 at 606 ops/sec (8.40x faster than v0_4_8)
  Test with 75 matches: v0_6_0 at 382 ops/sec (11.49x faster than v0_4_8)
Chrome 39.0.2171 (Mac OS X 10.10.1)
  Test with 5 matches: v0_6_0 at 27113 ops/sec (1.12x faster than v0_4_8)
  Test with 10 matches: v0_4_8 at 8669 ops/sec (1.28x faster than v0_6_0)
  Test with 25 matches: v0_6_0 at 2765 ops/sec (3.01x faster than v0_4_8)
  Test with 50 matches: v0_6_0 at 1354 ops/sec (6.24x faster than v0_4_8)
  Test with 75 matches: v0_6_0 at 916 ops/sec (318.10x faster than v0_4_8)
Firefox 31.0.0 (Mac OS X 10.10)
  Test with 5 matches: v0_6_0 at 31165 ops/sec (2.32x faster than v0_4_8)
  Test with 10 matches: v0_6_0 at 6269 ops/sec (3.09x faster than v0_4_8)
  Test with 25 matches: v0_6_0 at 3111 ops/sec (7.49x faster than v0_4_8)
  Test with 50 matches: v0_6_0 at 1635 ops/sec (31.98x faster than v0_4_8)
  Test with 75 matches: v0_6_0 at 1162 ops/sec (167.81x faster than v0_4_8)
