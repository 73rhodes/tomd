/*global jQuery, describe, expect, it, tomd*/

function elem(str) {
  return jQuery(str)[0];
}

describe('tomd', function () {

  it('should be a function', function () {
    expect(tomd).to.be.a('function');
  });

  it('should throw err on null arg', function () {
    expect(tomd).withArgs(null).to.throwException();
  });

  it('should throw err on non-object arg', function () {
    expect(tomd).withArgs('some string').to.throwException();
  });

  it('should throw err on non DOM Node object', function () {
    expect(tomd).withArgs({}).to.throwException();
  });

  it('should not throw on DOM Node object', function () {
    expect(tomd).withArgs(elem('<h1>hi</h1>')).to.not.throwException();
  });

  describe('Paragraphs', function() {
    it('One line', function () {
      var dom = elem('<p>one line paragraph</p>');
      var md  = tomd(dom);
      expect(md).to.equal('one line paragraph\n\n');
    });

    /*
    it('Multiline', function () {
      var dom = elem('<p>multi-line<br/>paragraph</p>');
      var md  = tomd(dom);
      expect(md).to.equal('multi-line\nparagraph\n\n');
    });
    // */
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
        expect(md).to.equal(prefix + ' Header ' + i + '\n\n');
        prefix += "#";
      }
    });

    it('H* with inline elements', function () {
      var hdr = elem('<h1>Header <small>small <b>stuff</b></small></h1>');
      var md = tomd(hdr);
      expect(md).to.equal('# Header <SMALL>small **stuff**</SMALL>\n\n');
    });
  });

  describe('Blockquotes', function () {

    it('single line', function () {
      var dom = elem('<blockquote>now is the time</blockquote>');
      var md  = tomd(dom);
      expect(md).to.equal('> now is the time\n\n');
    });

    it('line break');
    /* , function () {
      var dom = elem('<blockquote>now is the time<br/>for all good cats</blockquote>');
      var md  = tomd(dom);
      expect(md).to.equal('> now is the time\n> for all good cats\n\n');
    });
    // */

    it('multiple line breaks');
    /* , function () {
      var dom = elem('<blockquote>now is the time<br/><br/><br/>for all good cats</blockquote>');
      var md  = tomd(dom);
      expect(md).to.equal('> now is the time\n\n> for all good cats\n\n');
    });
    // */

  });

  describe('Text styling', function () {

    it('Bold', function () {
      var bold = elem('<b>bold text</b>');
      var md = tomd(bold);
      expect(md).to.equal('**bold text**');
    });

    // This currently fails
    /*
    it ('should process B inline', function () {
      var dom = elem('<p><b>Bold</b>ness</p>');
      var md  = tomd(dom);
      expect(md).to.equal('**Bold**ness');
    });

    it ('should process B between text nodes', function () {
      var dom = elem('<p>goodbye <b>cruel</b> world!</p>');
      var md  = tomd(dom);
      expect(md).to.equal('goodbye **cruel** world!');
    });
    // */

    it('Italic', function () {
      var dom = elem('<p><i>Never</i> say never</p>');
      var md  = tomd(dom);
      expect(md).to.equal('*Never* say never\n\n');
    });

    it('Bold in Italics', function () {
      var dom = elem('<i>Now hear <b>this</b>!</i>');
      var md  = tomd(dom);
      expect(md).to.equal('*Now hear **this**!*');
      // try <i>Now<b>this</b></i>  :-)
    });

    it('Italics in Bold', function () {
      var dom = elem('<b>Now hear <i>this</i>!</b>');
      var md  = tomd(dom);
      expect(md).to.equal('**Now hear *this*!**');
    });

    it('Code', function () {
      var dom = elem('<code>foo(bar);</code>');
      var md  = tomd(dom);
      expect(md).to.equal('`foo(bar);`');
    });

    it('Strikethrough', function () {
      var dom = elem('<del>strikethrough</del>');
      var md  = tomd(dom);
      expect(md).to.equal('~~strikethrough~~');
    });

  });

  describe('Lists', function () {
    it('Unordered list');
    it('Ordered list');
    it('Nested lists');
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
      expect(md).to.equal('* * *\n\n');
    });
  });

  describe('Newlines');
  describe('Task lists');
  describe('References');
  describe('Fenced code blocks');
  describe('Tables');

});
