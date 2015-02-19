/*global jQuery, describe, expect, it, tomd*/

function elem(str) {
  return jQuery(str)[0];
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
      expect(md).to.equal('one line paragraph\n\n');
    });

    it('GFM Multiline paragraph', function () {
      var dom = elem('<p>roses are red<br/>violets are blue</p>');
      var md  = tomd(dom);
      expect(md).to.equal('roses are red\nviolets are blue\n\n');
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

    it('line break', function () {
      var dom = elem('<blockquote>now is the time<br/>for all good cats</blockquote>');
      var md  = tomd(dom);
      expect(md).to.equal('> now is the time\n> for all good cats\n\n');
    });

    it('multiple line breaks', function () {
      var dom = elem('<blockquote>now is the time<br/><br/>for all good cats</blockquote>');
      var md  = tomd(dom);
      expect(md).to.equal('> now is the time\n\n> for all good cats\n\n');
    });
  });

  describe('Text styling', function () {

    it('Bold', function () {
      var bold = elem('<b>bold text</b>');
      var md = tomd(bold);
      expect(md).to.equal('**bold text**');
    });

    it('Inline bold', function () {
      var dom = elem('<p><b>Bold</b>ness</p>');
      var md  = tomd(dom);
      expect(md).to.equal('**Bold**ness\n\n');
    });

    it('Inline bold with space', function () {
      var dom = elem('<p>goodbye <b>cruel</b> world!</p>');
      var md  = tomd(dom);
      expect(md).to.equal('goodbye **cruel** world!\n\n');
    });

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

  describe('Unordered lists', function () {
    it('Empty list', function () {
      var dom = elem('<ul></ul>');
      var md  = tomd(dom);
      expect(md).to.equal('');
    });

    it('List items', function () {
      var dom = elem('<ul><li>John</li><li>Paul</li><li>George</li><li>Ringo</li></ul>');
      var md  = tomd(dom);
      expect(md).to.equal('- John\n- Paul\n- George\n- Ringo\n\n');
    });
  });

  describe('Ordered lists', function () {
    it('Empty list', function () {
      expect(tomd(elem('<ol></ol>'))).to.equal('');
    });

    it('Ordered items', function () {
      expect(tomd(elem('<ol><li>alpha</li><li>beta</li></ol>'))).to.equal('1. alpha\n1. beta\n\n');
    });
  });

  describe('Nested lists', function () {
    it('should work');
    /*, function () {
      expect(tomd(elem('<ul><li>hello</li><ul><li>world</li></ul></ul>')))
        .to.equal('- hello\n  - world\n\n');
    });
    // */
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

  describe('Task lists');
  describe('References');
  describe('Fenced code blocks');
  describe('Tables');

});