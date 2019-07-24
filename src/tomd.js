/**
 * tomd.js - convert DOM to markdown
 * 
 * Inspired by David Bengoa's [gist](https://gist.github.com/YouWoTMA/1762527/)
 * 
 * @example
 *   var markdown = tomd(document.getElementById("content"));
 *
 * @example
 *   // Convert HTML strings with jQuery
 *   var markdown = tomd($("<h1>Hello <small>world!</small></h1>")[0]);
 */

/*jslint unparam: true*/
/*global node2md, tomd, window*/


/**
 * expose tomd as a module
 */

(function (module) {


  /**
   * Exports.
   */

  module.exports = tomd;


  var listLevel = 0;
  var listBullet = "- ";
  // in a preformatted block
  var preblock = false;
  // in a blockquote
  var blockquote = false;
  // block element has been closed
  var blockClosed = false;
  var blockElements = [
    "HR", "H1", "H2", "H3", "H4", "H5", "H6", "H7",
    "BLOCKQUOTE", "DIV", "SECTION", "P", "OL", "UL"
  ];

  /**
   * Convert a nodelist (tree of elements) to markdown.
   * @param  {Object} nodelist The NodeList object to process
   * @return {String}          Markdown string fragment
   */

  function processChildren(nodelist) {
    var markdown = "";
    var i = 0;
    for (i = 0; i < nodelist.length; i++) {
      markdown += node2md(nodelist[i]);
    }
    return markdown;
  }


  /**
   * convert an element node (non text) to markdown
   * @param  {Object} node A DOM Element node
   * @return {String}      Markdown string fragment
   */

  function processElement(node) {

    var markdown = "";
    var children = node.childNodes;

    if (blockClosed) {
      markdown += blockquote ? '\n> \n> ' : '\n\n';
      blockClosed = false;
    }

    // nodeName and tagName should be synonymous
    switch (node.nodeName) {


    // Inline elements
    case 'B':
      markdown += '**' + processChildren(children) + '**';
      break;

    case 'I':
      markdown += '*' + processChildren(children) + '*';
      break;

    case 'DEL':
      markdown += '~~' + processChildren(children) + '~~';
      break;

    case 'CODE':
      if (preblock) {
        markdown += "`\n" + processChildren(children) + "`";
      } else {
        markdown += "`" + processChildren(children) + "`";
      }
      break;


    // Block elements
    case 'HR':
      markdown += '* * *';
      blockClosed = true;
      break;

    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
    case 'H7':
      var size = parseInt(node.nodeName.charAt(1), 10);
      var hdr  = "";
      while (size--) {
        hdr += '#';
      }
      markdown += hdr + ' ' + processChildren(children);
      blockClosed = true;
      break;

    case 'BLOCKQUOTE':
      debugger;
      blockquote = true;
      markdown += "> " + processChildren(children);
      blockClosed = true;
      blockquote = false;
      break;

    case 'DIV':
    case 'SECTION':
      markdown += '\n\n' + processChildren(children) + '\n\n';
      blockClosed = true;
      break;

    case 'P':
      markdown += processChildren(children);
      blockClosed = true;
      break;

    case 'PRE':
      preblock = true;
      if (children[0] && children[0].nodeName === 'CODE') {
        markdown += '\n\n``' + processChildren(children) + '``\n\n';
      } else {
        if (blockquote) {
          blockquote = false;
          markdown += "\n> <pre>" + processChildren(children) + "</pre>\n";
          blockquote = true;
        } else {
          markdown += '\n<pre>' + processChildren(children) + "</pre>\n\n";
        }
      }
      preblock = false;
      blockClosed = true;
      break;

    case 'UL':
      listLevel++;
      listBullet = "- ";
      markdown += processChildren(children) + '\n\n';
      listLevel--;
      blockClosed = true;
      break;

    case 'OL':
      listLevel++;
      listBullet = '1. ';
      markdown += processChildren(children) + '\n\n';
      listLevel--;
      blockClosed = true;
      break;

    // List items
    case 'LI':
      var listIndent = "";
      var i = listLevel;
      while (i-- && i > 0) {
        listIndent += "  ";
      }
      markdown += '\n' + listIndent + (listBullet || "- ") + processChildren(children);
      break;

    // Line breaks
    case 'BR':
      markdown += "<br/>\n";
      if (blockquote) {
        // line breaks in blockquotes translate to blank lines
        markdown += '\n';
      }
      break;

    // Verbatim tags
    default:
      markdown += "<" + node.nodeName + ">" +
        processChildren(children) + "</" + node.nodeName + ">";
      break;
    }

    return markdown;
  }


  function processText(node) {

    var markdown  = "";
    if (node.data.trim() !== "") {
      // Denote blockquotes
      // TODO support nested blockquotes
      /*
      if (blockquote) {
        markdown += "> ";
      }
      // */
      markdown += node.data.replace(/^[\n\t]+/, "");
      // Collapse whitespace outside of <pre> blocks
      if (!preblock) {
        markdown = markdown.replace(/[\s]+/g, " ");
      }
    }
    return markdown;
  }


  /**
   * convert a node to markdown, iterating over children as necessary
   * @param  {Object} node - A DOM Node
   * @return {String} Markdown string
   */

  function node2md(node) {

    var markdown = "";

    switch (node.nodeType) {

    // element node
    case 1:
      markdown += processElement(node);
      break;

    // text node
    case 3:
      markdown += processText(node);
      break;

    default:
      console.log("unknown node type " + node.nodeType);
      break;

    }

    return markdown;
  }

  function tomd(node) {
    var typeofNode = typeof node.nodeType;
    if (typeofNode === 'undefined') {
      throw (new Error("Invalid argument; not a Node object"));
    }
    var markdown = node2md(node);
    // Remove leading newlines
    markdown = markdown.replace(/^[\n]+/, "");
    // Collapse multiple blank lines to single blank lines
    markdown = markdown.replace(/[\n]{2,}/g, "\n\n");
    // Strip whitespace in blank lines
    markdown = markdown.replace(/\n\n[\s]+/g, "\n\n");
    return markdown;
  }

  //return tomd;
  var typeofWindow = typeof window;
  if ('undefined' !== typeofWindow) {
    window.tomd = module.exports;
  }

}(
  'undefined' !== typeof module ? module : {exports: {}}
));
