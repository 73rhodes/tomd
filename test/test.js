/*global jQuery, describe, expect, it, tomd*/

function elem(str) {
  return jQuery(str)[0];
}

function h2md(str) {
  return tomd(elem(str));
}

describe('tomd', function () {

  it('is a function', function () {
    expect(tomd).to.be.a('function');
  });

  it('throws err on null arg', function () {
    expect(tomd).withArgs(null).to.throwException();
  });

  it('throws err on non-object arg', function () {
    expect(tomd).withArgs('some string').to.throwException();
  });

  it('throws err on non DOM Node object', function () {
    expect(tomd).withArgs({}).to.throwException();
  });

  it('accepts DOM Node object', function () {
    expect(tomd).withArgs(elem('<h1>hi</h1>')).to.not.throwException();
  });

  describe('Paragraphs', function () {
    it('One line', function () {
      var dom = elem('<p>one line paragraph</p>');
      var md  = tomd(dom);
      expect(md).to.equal('one line paragraph');
    });

    it('Consecutive paragraphs', function () {
      var dom = elem('<div><p>one line</p><p>and another</p></div>');
      var md = tomd(dom);
      expect(md).to.equal('one line\n\nand another\n\n');
    });

    it('GFM Multiline paragraph', function () {
      var dom = elem('<p>roses are red<br/>violets are blue</p>');
      var md  = tomd(dom);
      expect(md).to.equal('roses are red<br/>\nviolets are blue');
    });
  });

  describe('Headings', function () {

    it('H1...H7', function () {
      var i;
      var prefix = "#";
      var hdr;
      var md;
      for (i = 1; i <= 7; i++) {
        hdr = elem('<h' + i + '>Header ' + i + '</h' + i + '>');
        md = tomd(hdr);
        expect(md).to.equal(prefix + ' Header ' + i);
        prefix += "#";
      }
    });

    it('H* with inline elements', function () {
      var hdr = elem('<h1>Header <small>small <b>stuff</b></small></h1>');
      var md = tomd(hdr);
      expect(md).to.equal('# Header <SMALL>small **stuff**</SMALL>');
    });
  });

  describe('Blockquotes', function () {

    it('single line', function () {
      var dom = elem('<blockquote>now is the time</blockquote>');
      var md  = tomd(dom);
      expect(md).to.equal('> now is the time');
    });

    it('paragraphs', function () {
      //var dom = elem('<div><blockquote>Hello.<p>World!</p></blockquote></div>');
      var dom = elem(
        "<blockquote>" +
        "<p>Blockquote</p>" +
        "<p>Second paragraph</p>" +
        "<h2>header</h2>" +
        "</blockquote>"
      );
      var md  = tomd(dom);
      expect(md).to.equal("> Blockquote\n> \n> Second paragraph\n> \n> ## header");
      //expect(md).to.equal("> Blockquote\n> \n> Second paragraph");
    });

    // TODO blockquote containing preformatted text
    // TODO blockquote containing a mix of elements

  });

  describe('Text styling', function () {

    it('Bold', function () {
      var dom = elem('<p>goodbye <b>cruel</b> world!</p>');
      var md  = tomd(dom);
      expect(md).to.equal('goodbye **cruel** world!');
    });

    it('Italic', function () {
      expect(h2md('<p><i>Never</i> say never</p>')).to.equal('*Never* say never');
    });

    it('Bold Italics', function () {
      expect(h2md('<i>Now hear <b>this</b>!</i>')).to.equal('*Now hear **this**!*');
    });

    it('Italicized Bold', function () {
      expect(h2md('<b>Now hear <i>this</i>!</b>')).to.equal('**Now hear *this*!**');
    });

    it('Code', function () {
      expect(h2md('<code>foo(bar);</code>')).to.equal('`foo(bar);`');
    });

    it('Strikethrough', function () {
      expect(h2md('<del>strikethrough</del>')).to.equal('~~strikethrough~~');
    });
  });

  describe('Unordered lists', function () {
    it('Empty list', function () {
      expect(h2md('<ul></ul>')).to.equal('');
    });

    it('List items', function () {
      var dom = elem('<ul><li>John</li><li>Paul</li><li>George</li><li>Ringo</li></ul>');
      var md  = tomd(dom);
      expect(md).to.equal('- John\n- Paul\n- George\n- Ringo\n\n');
    });

    it('Text prefix', function () {
      expect(h2md('<div>List<ul><li>item</li><li>item2</li></ul></div>'))
        .to.equal('List\n- item\n- item2\n\n');
    });
  });

  describe('Ordered lists', function () {
    it('Empty list', function () {
      expect(h2md('<ol></ol>')).to.equal('');
    });

    it('Ordered items', function () {
      expect(h2md('<ol><li>alpha</li><li>beta</li></ol>')).to.equal('1. alpha\n1. beta\n\n');
    });
  });

  describe('Nested lists', function () {
    it('unordered', function () {
      expect(h2md('<ul><li>hello</li><ul><li>world</li></ul></ul>'))
        .to.equal('- hello\n  - world\n\n');
    });

    it('ordered', function () {
      expect(h2md('<ol><li>Uno</li><ol><li>Alpha</li></ol></ol>'))
        .to.equal('1. Uno\n  1. Alpha\n\n');
    });

    it('OL in UL', function () {
      expect(h2md('<ul><li>hello</li><ol><li>one</li></ol></ul>'))
        .to.equal('- hello\n  1. one\n\n');
    });
  });

  describe('Preformatted blocks', function () {
    it('Pass through pre tags', function () {
      expect(h2md('<pre>foobar</pre>')).to.equal('<pre>foobar</pre>\n\n');
    });

    it('In paragraphs', function () {
      expect(h2md('<div><p>hi</p><pre>hello</pre></div>')).to.equal('hi\n\n<pre>hello</pre>\n\n');
    });

  });

  describe('Code formatting', function () {
    it('Inline format');
    it('Multiple lines');
  });

  describe('Links', function () {
    it('hyperlink');
  });

  describe('Horizontal Rule', function () {
    it('Horizontal Rule', function () {
      var hr = elem('<hr/>');
      var md = tomd(hr);
      expect(md).to.equal('* * *');
    });
  });

  // Daring Fireball example
  describe('Daring Fireball', function () {
    it('Example 1', function () {
      var md = h2md(
        "<div><h1>A First Level Header</h1>" +
        "<h2>A Second Level Header</h2>" +
        "<p>Now is the time for all good men to come to " +
        "the aid of their country. This is just a " +
        "regular paragraph.</p>" +
        "<p>The quick brown fox jumped over the " +
        "lazy dog's back.</p>" +
        "<h3>Header 3</h3>" +
        "<blockquote>" +
        "<p>This is a blockquote.</p>" +
        "<p>This is the second paragraph in the blockquote.</p>" +
        //"<h2>This is an H2 in a blockquote</h2>" +
        "</blockquote></div>"
      );
      expect(md).to.equal(
        "# A First Level Header\n" +
        "\n" +
        "## A Second Level Header\n" +
        "\n" +
        "Now is the time for all good men to come to " +
        "the aid of their country. This is just a " +
        "regular paragraph.\n" +
        "\n" +
        "The quick brown fox jumped over the lazy " +
        "dog's back.\n" +
        "\n" +
        "### Header 3\n" +
        "\n" +
        "> This is a blockquote.\n" +
        "> \n" +
        "> This is the second paragraph in the blockquote.\n" +
        //">\n" +
        //"> ## This is an H2 in a blockquote\n"
        "\n"
      );
    });
  });

  /*
  // Extra Github-flavoured Markdown
  describe('Task lists');
  describe('References');
  describe('Fenced code blocks');
  describe('Tables');
  */

});
