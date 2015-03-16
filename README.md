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
- Alasdair Mercer's [html.md](https://github.com/neocotic/html.md)

Unfortunately, I hit some limitations with these, such as only works on well-formed HTML,
missing support for like escape sequences, multi-line code blocks, or certain kinds of nested
elements.

This module is meant to leverage the robust HTML-parsing capabilities of the web
browser, while supporting all the standard features of markdown. It aims for parity
with markd.js, so that fully bi-directional HTML/Markdown is possible.
