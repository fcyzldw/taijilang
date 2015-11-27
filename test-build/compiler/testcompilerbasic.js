var Parser, chai, compile, compileNoOptimize, constant, expect, expectCompile, expectParse, head, idescribe, iit, iitCompile, iitParse, isArray, itCompile, itParse, lib, ndescribe, parse, realCode, str, taiji, _ref;

chai = require("chai");

expect = chai.expect;

iit = it.only;

idescribe = describe.only;

ndescribe = function() {};

lib = '../../lib/';

Parser = require(lib + 'parser').Parser;

_ref = require(lib + 'parser/base'), constant = _ref.constant, isArray = _ref.isArray, str = _ref.str;

taiji = require(lib + 'taiji');

realCode = require(lib + 'utils').realCode;

head = 'taiji language 0.1\n';

parse = function(text) {
  var parser, x;
  parser = new Parser();
  x = parser.parse(head + text, parser.module, 0);
  return str(x.body);
};

compile = function(code) {
  head = 'taiji language 0.1\n';
  return realCode(taiji.compile(head + code, taiji.rootModule, taiji.builtins, {}));
};

compileNoOptimize = function(code) {
  head = 'taiji language 0.1\n';
  return realCode(taiji.compileNoOptimize(head + code, taiji.rootModule, taiji.builtins, {}));
};

expectCompile = function(srcCode, result) {
  return expect(compile(srcCode)).to.have.string(result);
};

itCompile = function(srcCode, result) {
  return it('should compile' + srcCode, function() {
    return expectCompile(srcCode, result);
  });
};

iitCompile = function(srcCode, result) {
  return iit('should compile ' + srcCode, function() {
    return expectCompile(srcCode, result);
  });
};

expectParse = function(srcCode, result) {
  return expect(parse(srcCode)).to.have.string(result);
};

itParse = function(srcCode, result) {
  return it('should parse' + srcCode, function() {
    return expectParse(srcCode, result);
  });
};

iitParse = function(srcCode, result) {
  return iit('should parse ' + srcCode, function() {
    return expectParse(srcCode, result);
  });
};

describe("compiler basic: ", function() {
  describe("compile number: ", function() {
    it("compile 1", function() {
      return expect(compile('1')).to.have.string('1');
    });
    it("compile 01", function() {
      return expect(compile('01')).to.have.string('1');
    });
    it("compile 0x01", function() {
      return expect(compile('0x01')).to.have.string('1');
    });
    it("compile 0xa", function() {
      expect(compile('0xa')).to.have.string('10');
      return expect(compile('0xa')).to.have.string('10');
    });
    return it("compile 1.", function() {
      return expect(function() {
        return compile('1.');
      }).to["throw"](/fail to look up symbol from environment/);
    });
  });
  describe("compile string: ", function() {
    describe("compile interpolate string: ", function() {
      it("compile a", function() {
        return expect(compile('"a"')).to.have.string("\"a\"");
      });
      it("compile a\\b", function() {
        return expect(compile('"a\\b"')).to.have.string("\"a\\b\"");
      });
      it("compile '''a\"'\\n'''", function() {
        return expect(compile('"""a\\"\'\\n"""')).to.have.string("\"a\\\"'\\n\"");
      });
      it("compile \"a(1)\" ", function() {
        return expect(compile('"a(1)"')).to.have.string("\"a(1)\"");
      });
      it("compile \"a[1]\" ", function() {
        return expect(compile('"a[1]"')).to.have.string("\"a[\" + JSON.stringify([1]) + \"]\"");
      });
      return it("compile \"a[1] = $a[1]\" ", function() {
        return expect(compile('var a; "a[1] = $a[1]"')).to.have.string("var a;\n\"a[\" + JSON.stringify([1]) + \"] = \" + JSON.stringify(a[1])");
      });
    });
    describe("compile raw string without interpolation: ", function() {
      it("compile '''a\\b'''", function() {
        return expect(compile("'''a\\b'''")).to.have.string("\"a\\b\"");
      });
      it("compile '''a\\b\ncd'''", function() {
        return expect(compile("'''a\\b\ncd'''")).to.have.string("\"a\\b\\ncd\"");
      });
      return it("compile '''a\"'\\n'''", function() {
        return expect(compile("'''a\"'\\n'''")).to.have.string("\"a\\\"'\\n\"");
      });
    });
    return describe("compile escape string without interpolation: ", function() {
      it("compile 'a\\b'", function() {
        return expect(compile("'a\\b'")).to.have.string("\"a\\b\"");
      });
      it("compile 'a\\b\ncd'", function() {
        return expect(compile("'a\\b\ncd'")).to.have.string("\"a\\b\\ncd\"");
      });
      it("compile 'a\"\\\"\'\\n'", function() {
        return expect(compile("'a\"\\\"\\'\\n'")).to.have.string("\"a\\\"\\\"\\'\\n\"");
      });
      it("compile 'a\"\\\"\\'\\n\n'", function() {
        return expect(compile("'a\"\\\"\\'\\n\n'")).to.have.string("\"a\\\"\\\"\\'\\n\\n\"");
      });
      return it("compile 'a\"\\\"\n\'\\n'", function() {
        return expect(compile("'a\"\\\"\n\\'\\n\n'")).to.have.string("\"a\\\"\\\"\\n\\'\\n\\n\"");
      });
    });
  });
  describe("parenthesis: ", function() {
    it('should compile ()', function() {
      return expect(compile('()')).to.have.string('');
    });
    it('should compile (a)', function() {
      return expect(compile('var a; (a)')).to.have.string('var a;\na');
    });
    return it('should compile (a,b)', function() {
      return expect(compile('var a, b; (a,b)')).to.have.string('var a, b;\n[a, b]');
    });
  });
  describe("@ as this", function() {
    it('should compile @', function() {
      return expect(compile('@')).to.have.string('this');
    });
    it('should compile @a', function() {
      return expect(compile('@a')).to.have.string("this.a");
    });
    return it('should compile @ a', function() {
      return expect(compile('var a; @ a')).to.have.string("var a;\nthis(a)");
    });
  });
  describe(":: as prototype: ", function() {
    it('should compile @:: ', function() {
      return expect(compile('@::')).to.have.string("this.prototype");
    });
    it('should compile a:: ', function() {
      return expect(compile('var a; a::')).to.have.string("var a;\na.prototype");
    });
    it('should compile a::b ', function() {
      return expect(compile('var a; a::b')).to.have.string("var a;\na.prototype.b");
    });
    return it('should compile ::a', function() {
      return expect(compile('::a')).to.have.string("this.prototype.a");
    });
  });
  describe("quote expression:", function() {
    return describe("quote expression:", function() {
      it('should compile ~ a.b', function() {
        return expect(compile('~ a.b')).to.have.string("[\"attribute!\",\"a\",\"b\"]");
      });
      it('should compile ~ print a b', function() {
        return expect(compile('~ print a b')).to.have.string("[\"print\",\"a\",\"b\"]");
      });
      it('should compile ` print a b', function() {
        return expect(compile('` print a b')).to.have.string("[\"print\", \"a\", \"b\"]");
      });
      it('should compile ~ print : min a \n abs b', function() {
        return expect(compile('~ print : min a \n abs b')).to.have.string("[\"print\",[\"min\",\"a\",[\"abs\",\"b\"]]]");
      });
      return it('should compile ` a.b', function() {
        return expect(compile('` a.b')).to.have.string("[\"attribute!\", \"a\", \"b\"]");
      });
    });
  });
  describe("unquote expression:", function() {
    describe("unquote expression: ", function() {
      it('should compile ` ^ a.b', function() {
        return expect(compile('var a; ` ^ a.b')).to.have.string('var a;\na.b');
      });
      it('should compile ` ^ [print a b]', function() {
        return expect(compile('var a, b; ` ^ [print a b]')).to.have.string("var a, b;\n[console.log(a, b)]");
      });
      it('should compile ` ^ {print a b}', function() {
        return expect(compile('var a, b; ` ^ {print a b}')).to.have.string("var a, b;\nconsole.log(a, b)");
      });
      it('should compile ` ^ print a b', function() {
        return expect(compile('var a, b; ` ^ print a b')).to.have.string("var a, b;\nconsole.log(a, b)");
      });
      return it('should compile ` ^.~print a b', function() {
        return expect(compile('` ^.~print a b')).to.have.string("[\"print\", \"a\", \"b\"]");
      });
    });
    return describe("unquote-splice expression: ", function() {
      it('should compile `  ^& a.b', function() {
        return expect(compile('var a; ` ^& a.b')).to.have.string("var a;\na.b");
      });
      it('should compile `  ^&a.b', function() {
        return expect(compile('var a; ` ^&a.b')).to.have.string("var a;\na.b");
      });
      it('should compile ` ( ^&a).b', function() {
        return expect(compile('var a; ` ( ^&a).b')).to.have.string("var a;\n[\"attribute!\"].concat(a).concat([\"b\"])");
      });
      it('should compile ` ^@ [print a b]', function() {
        return expect(compile('var a, b; ` ^& [print a b]')).to.have.string("var a, b;\n[console.log(a, b)]");
      });
      it('should compile ` ^@ {print a b}', function() {
        return expect(compile('var a, b; ` ^& {print a b}')).to.have.string("var a, b;\nconsole.log(a, b)");
      });
      it('should compile ` ^ print a b', function() {
        return expect(compile('var a, b; ` ^ [print a b]')).to.have.string("var a, b;\n[console.log(a, b)]");
      });
      return it('should compile ` ^ print a b', function() {
        return expect(compile('var a, b; ` ^ {print a b}')).to.have.string("var a, b;\nconsole.log(a, b)");
      });
    });
  });
  describe("hash!: ", function() {
    return describe("hash! expression: ", function() {
      itCompile('{}', "{ }");
      it('should compile {.1:2.}', function() {
        return expect(compile('{.1:2.}')).to.have.string("{ 1: 2}");
      });
      it('should compile {.1:2; 3:4.}', function() {
        return expect(compile('{.1:2; 3:4.}')).to.have.string("{ 1: 2, 3: 4}");
      });
      it('should compile {.1:2; 3:abs\n    5.}', function() {
        return expect(compile('extern! abs; {. 1:2; 3:abs\n    5.}')).to.have.string("{ 1: 2, 3: abs(5)}");
      });
      it('should compile {. 1:2; 3:4;\n 5:6.}', function() {
        return expect(compile('{. 1:2; 3:4;\n 5:6.}')).to.have.string("{ 1: 2, 3: 4, 5: 6}");
      });
      it('should compile {. 1:2; 3:\n 5:6\n.}', function() {
        return expect(compile('{. 1:2; 3:\n 5:6\n.}')).to.have.string("{ 1: 2, 3: { 5: 6}}");
      });
      return it('should compile {. 1:2; 3:\n 5:6;a=>8\n.}', function() {
        return expect(compile('var a; {. 1:2; 3:\n 5:6;a=>8\n.}')).to.have.string("var a, hash = { 5: 6};\nhash[a] = 8;\n{ 1: 2, 3: hash}");
      });
    });
  });
  describe("line comment block", function() {
    it('should compile // line comment\n 1', function() {
      return expect(compile('// line comment\n 1')).to.have.string('1');
    });
    it('should compile // line comment\n 1', function() {
      return expect(compile('// line comment\n 1')).to.have.string('1');
    });
    it('should compile var x; x\n // line comment block\n 1', function() {
      return expect(compile('var x; x\n // line comment block\n 1')).to.have.string("var x;\nx(1)");
    });
    it('should compile // line comment block\n 1 2, 3 4', function() {
      return expect(compile('// line comment block\n 1 2, 3 4')).to.have.string('[1, 2];\n[3, 4]');
    });
    it('should compile // line comment block\n 1 2, 3 4\n 5 6, 7 8', function() {
      return expect(compile('// line comment block\n 1 2; 3 4\n 5 6; 7 8')).to.have.string("[1, 2];\n[3, 4];\n[5, 6];\n[7, 8]");
    });
    it('should compile // \n 1 2, 3 4\n // \n5 6, 7 8', function() {
      return expect(compile('// \n 1 2, 3 4\n // \n  5 6, 7 8')).to.have.string("[1, 2];\n[3, 4];\n[5, 6];\n[7, 8]");
    });
    return it('should compile // \n 1 2, 3 4\n // \n5 6, 7 8', function() {
      return expect(compile('// \n 1 2, 3 4\n // \n  5 6, 7 8\n // \n  9 10, 11 12')).to.have.string("[1, 2];\n[3, 4];\n[5, 6];\n[7, 8];\n[9, 10];\n[11, 12]");
    });
  });
  return describe("block comment ", function() {
    it('should compile /. some comment', function() {
      return expect(compile('/. some comment')).to.have.string('');
    });
    it('should compile /. some \n  embedded \n  comment', function() {
      return expect(compile('/. some \n  embedded \n  comment')).to.have.string('');
    });
    return it('should compile /// line comment\n 1', function() {
      return expect(compile('/// line comment\n 1')).to.equal("/// line comment;\n1");
    });
  });
});
