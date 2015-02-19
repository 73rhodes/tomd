# tomd

A utility to convert HTML to Markdown using the DOM. Work-in-progress.

## Usage

    var htmlnode = document.getElementById('#htmlcontent');
    var markdown = tomd(htmlnode);

## Description

This is a script to convert HTML to Markdown in the browser using
the DOM.

There are a couple of projects to convert HTML to markdown:

- Dom Christie's [to-markdown](http://domchristie.github.io/to-markdown/).
- David Bengoa's [gist](https://gist.github.com/YouWoTMA/1762527/).

Unfortunately, one only works on well-formed HTML and the other is missing
support for a number of things like escape sequences, multi-line code blocks,
or inline elements nested in header tags.

This module is meant to leverage the robust HTML capabilities of the web
browser, while supporting all the standard features of github-flavoured 
markdown.
