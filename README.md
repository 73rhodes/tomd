# tomd

A utility to convert HTML to Markdown using the DOM.

## Usage

    var htmlnode = document.getElementById('#htmlcontent');
    var markdown = tomd(htmlnode);

## Background

This is a work-in-progress.

There are a couple of project that convert HTML to markdown.

- Dom Christie's [to-markdown](http://domchristie.github.io/to-markdown/).
- David Bengoa's [gist](https://gist.github.com/YouWoTMA/1762527/).

Unfortunately, the first one only works on well-formed HTML strings, because
it's really a pattern matcher and not a full HTML parser. The second one uses
already-parsed DOM nodes, so it doesn't suffer the same problem, but doesn't
support a number of things like escape sequences, multi-line code blocks, or
inline elements inside header tags.

This module is meant to solve some of those problems.
