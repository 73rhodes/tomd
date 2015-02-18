/**
 * tomd.js - convert DOM to markdown
 * 
 * Inspired by David Bengoa's [gist](https://gist.github.com/YouWoTMA/1762527/)
 * 
 * @example
 *   var markdown = toMarkdown(document.getElementById("content"));
 *
 * @example
 *   // Convert HTML strings with jQuery
 *   var markdown = tomd($("<h1>Hello <small>world!</small></h1>")[0]);
 */

/*global node2md*/


/**
 * expose tomd as a module
 */

(function (global, module) {


  /**
   * Exports.
   */

  var exports = module.exports;
  module.exports = tomd;


  var listLevel = 0;
  var listBullet = "- ";
  var preblock = false;


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

    // nodeName and tagName should be synonymous
    switch (node.nodeName) {

    case 'B':
      markdown += '**' + processChildren(children) + '**';
      break;

    case 'I':
      markdown += '*' + processChildren(children) + '*';
      break;

    case 'DEL':
      markdown += '~~' + processChildren(children) + '~~';
      break;

    case 'HR':
      markdown += '* * *\n\n';
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
      markdown += '\n\n' + hdr + ' ' + processChildren(children) + '\n\n';
      break;

    case 'BLOCKQUOTE':
      markdown += '> ' + processChildren(children) + '\n\n';
      break;

    case 'DIV':
    case 'P':
    case 'SECTION':
      markdown += '\n\n' + processChildren(children) + '\n\n';
      break;

    case 'PRE':
      preblock = true;
      if (children[0] && children[0].nodeName === 'CODE') {
        markdown += '\n\n``' + processChildren(children) + '``\n\n';
      } else {
        markdown += "\n\n&lt;pre&gt;\n" + processChildren(children) + "\n&lt;/pre&gt;\n\n";
      }
      preblock = false;
      break;

    case 'BR':
      markdown += "\n\n";
      break;

    case 'CODE':
      if (preblock) {
        markdown += "`\n" + processChildren(children) + "\n`";
      } else {
        markdown += "`" + processChildren(children) + "`";
      }
      break;

    case 'UL':
      listLevel++;
      listBullet = "- ";
      markdown += "\n\n" + processChildren(children) + "\n\n";
      listLevel--;
      break;

    case 'OL':
      listLevel++;
      listBullet = "1. ";
      markdown += "\n\n" + processChildren(children) + "\n\n";
      listLevel--;
      break;

    case 'LI':
      var listIndent = "";
      var i = listLevel;
      while (i-- && i > 0) {
        listIndent += "  ";
      }
      markdown += listIndent + (listBullet || "- ") + processChildren(children) + "\n";
      break;

    default:
      markdown += "<" + node.nodeName + ">" +
        processChildren(children) + "</" + node.nodeName + ">";
      break;

    }

    return markdown;
  }


  function processText(node) {

    var markdown  = "";
    // node.data & node.nodeValue should be synonymous
    if (node.data.trim() !== "") {
      //markdown += node.data.replace(/^[\n\s\t]+/, "")
      //  .replace(/[\s]+/g, " ")
      //  .replace(/</g, "&amp;lt;")
      //  .replace(/>/g, "&amp;gt;");
      markdown += node.data.replace(/^[\n\t]+/, "").replace(/[\s]+/g, " ").replace(/</g, "&amp;lt;").replace(/>/g, "&amp;gt;");
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
    if (typeof node.nodeType === 'undefined') {
      throw(new Error("Invalid argument; not a Node object"));
    }
    //return node2md(node).trim().replace(/[\n]{2,}/g, "\n\n");
    return node2md(node).replace(/^[\n]+/, "").replace(/[\n]{2,}/g, "\n\n");
  }

  //return tomd;

  if ('undefined' != typeof window) {
    window.tomd = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {exports: {}}
);
