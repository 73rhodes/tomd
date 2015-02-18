/*global jQuery, describe, expect, it, tomd*/

function elem(str) {
  return jQuery(str)[0];
}

describe('tomd', function () {

  it('should be a function', function () {
    expect(tomd).to.be.a('function');
  });

  it('should err on null', function () {
    expect(tomd).withArgs(null).to.throwException();
  });

  it('should err on string', function () {
    expect(tomd).withArgs('some string').to.throwException();
  });

  // Inline Elements

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
      expect(md).to.equal('*Never* say never');
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

  });

  describe('Headings', function () {

    it('<H1>...<H7>', function () {
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

    it('<H*> with inline elements', function () {
      var hdr = elem('<h1>Header <small>small <b>stuff</b></small></h1>');
      var md = tomd(hdr);
      expect(md).to.equal('# Header <SMALL>small **stuff**</SMALL>');
    });
  });

  describe('hr', function () {
    it('should process hr', function () {
      var hr = elem('<hr/>');
      var md = tomd(hr);
      expect(md).to.equal('* * *');
    });
  });

});
