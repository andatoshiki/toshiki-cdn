(function(e) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = e()
    } else if (typeof define === "function" && define.amd) {
        define([], e)
    } else {
        var t;
        if (typeof window !== "undefined") {
            t = window
        } else if (typeof global !== "undefined") {
            t = global
        } else if (typeof self !== "undefined") {
            t = self
        } else {
            t = this
        }
        t.katex = e()
    }
})(function() {
    var e, t, i;
    return function h(e, t, i) {
        function a(l, s) {
            if (!t[l]) {
                if (!e[l]) {
                    var p = typeof require == "function" && require;
                    if (!s && p) return p(l, !0);
                    if (r) return r(l, !0);
                    var c = new Error("Cannot find module '" + l + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var n = t[l] = {
                    exports: {}
                };
                e[l][0].call(n.exports, function(t) {
                    var i = e[l][1][t];
                    return a(i ? i : t)
                }, n, n.exports, h, e, t, i)
            }
            return t[l].exports
        }
        var r = typeof require == "function" && require;
        for (var l = 0; l < i.length; l++) a(i[l]);
        return a
    }({
        1: [function(e, t, i) {
            var h = e("./katexsrc/ParseError");
            var a = e("./katexsrc/Settings");
            var r = e("./katexsrc/buildTree");
            var l = e("./katexsrc/parseTree");
            var s = e("./katexsrc/utils");
            var p = function(e, t, i) {
                s.clearNode(t);
                var h = new a(i);
                var p = l(e, h);
                var c = r(p, e, h).toNode();
                t.appendChild(c)
            };
            if (typeof document !== "undefined") {
                if (document.compatMode !== "CSS1Compat") {
                    typeof console !== "undefined" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your " + "website has a suitable doctype.");
                    p = function() {
                        throw new h("KaTeX doesn't work in quirks mode.")
                    }
                }
            }
            var c = function(e, t) {
                var i = new a(t);
                var h = l(e, i);
                return r(h, e, i).toMarkup()
            };
            var n = function(e, t) {
                var i = new a(t);
                return l(e, i)
            };
            t.exports = {
                render: p,
                renderToString: c,
                __parse: n,
                ParseError: h
            }
        }, {
            "./katexsrc/ParseError": 5,
            "./katexsrc/Settings": 7,
            "./katexsrc/buildTree": 12,
            "./katexsrc/parseTree": 21,
            "./katexsrc/utils": 23
        }],
        2: [function(e, t, i) {
            "use strict";

            function h(e) {
                if (!e.__matchAtRelocatable) {
                    var t = e.source + "|()";
                    var i = "g" + (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.unicode ? "u" : "");
                    e.__matchAtRelocatable = new RegExp(t, i)
                }
                return e.__matchAtRelocatable
            }

            function a(e, t, i) {
                if (e.global || e.sticky) {
                    throw new Error("matchAt(...): Only non-global regexes are supported")
                }
                var a = h(e);
                a.lastIndex = i;
                var r = a.exec(t);
                if (r[r.length - 1] == null) {
                    r.length = r.length - 1;
                    return r
                } else {
                    return null
                }
            }
            t.exports = a
        }, {}],
        3: [function(e, t, i) {
            var h = e("match-at");
            var a = e("./ParseError");

            function r(e) {
                this._input = e
            }

            function l(e, t, i) {
                this.text = e;
                this.data = t;
                this.position = i
            }
            var s = [/[/|@.""`0-9a-zA-Z]/, /[*+-]/, /[=<>:]/, /[,;]/, /['\^_{}]/, /[(\[]/, /[)\]?!]/, /~/, /&/, /\\\\/];
            var p = [/[a-zA-Z0-9`!@*()-=+\[\]'";:?\/.,]/, /[{}]/, /~/, /&/, /\\\\/];
            var c = /\s*/;
            var n = / +|\\  +/;
            var o = /\\(?:[a-zA-Z]+|.)/;
            r.prototype._innerLex = function(e, t, i) {
                var r = this._input;
                var s;
                if (i) {
                    s = h(c, r, e)[0];
                    e += s.length
                } else {
                    s = h(n, r, e);
                    if (s !== null) {
                        return new l(" ", null, e + s[0].length)
                    }
                }
                if (e === r.length) {
                    return new l("EOF", null, e)
                }
                var p;
                if (p = h(o, r, e)) {
                    return new l(p[0], null, e + p[0].length)
                } else {
                    for (var g = 0; g < t.length; g++) {
                        var d = t[g];
                        if (p = h(d, r, e)) {
                            return new l(p[0], null, e + p[0].length)
                        }
                    }
                }
                throw new a("Unexpected character: '" + r[e] + "'", this, e)
            };
            var g = /#[a-z0-9]+|[a-z]+/i;
            r.prototype._innerLexColor = function(e) {
                var t = this._input;
                var i = h(c, t, e)[0];
                e += i.length;
                var r;
                if (r = h(g, t, e)) {
                    return new l(r[0], null, e + r[0].length)
                } else {
                    throw new a("Invalid color", this, e)
                }
            };
            var d = /(-?)\s*(\d+(?:\.\d*)?|\.\d+)\s*([a-z]{2})/;
            r.prototype._innerLexSize = function(e) {
                var t = this._input;
                var i = h(c, t, e)[0];
                e += i.length;
                var r;
                if (r = h(d, t, e)) {
                    var s = r[3];
                    if (s !== "em" && s !== "ex") {
                        throw new a("Invalid unit: '" + s + "'", this, e)
                    }
                    return new l(r[0], {
                        number: +(r[1] + r[2]),
                        unit: s
                    }, e + r[0].length)
                }
                throw new a("Invalid size", this, e)
            };
            r.prototype._innerLexWhitespace = function(e) {
                var t = this._input;
                var i = h(c, t, e)[0];
                e += i.length;
                return new l(i[0], null, e)
            };
            r.prototype.lex = function(e, t) {
                if (t === "math") {
                    return this._innerLex(e, s, true)
                } else if (t === "text") {
                    return this._innerLex(e, p, false)
                } else if (t === "color") {
                    return this._innerLexColor(e)
                } else if (t === "size") {
                    return this._innerLexSize(e)
                } else if (t === "whitespace") {
                    return this._innerLexWhitespace(e)
                }
            };
            t.exports = r
        }, {
            "./ParseError": 5,
            "match-at": 2
        }],
        4: [function(e, t, i) {
            function h(e) {
                this.style = e.style;
                this.color = e.color;
                this.size = e.size;
                this.phantom = e.phantom;
                this.font = e.font;
                if (e.parentStyle === undefined) {
                    this.parentStyle = e.style
                } else {
                    this.parentStyle = e.parentStyle
                }
                if (e.parentSize === undefined) {
                    this.parentSize = e.size
                } else {
                    this.parentSize = e.parentSize
                }
            }
            h.prototype.extend = function(e) {
                var t = {
                    style: this.style,
                    size: this.size,
                    color: this.color,
                    parentStyle: this.style,
                    parentSize: this.size,
                    phantom: this.phantom,
                    font: this.font
                };
                for (var i in e) {
                    if (e.hasOwnProperty(i)) {
                        t[i] = e[i]
                    }
                }
                return new h(t)
            };
            h.prototype.withStyle = function(e) {
                return this.extend({
                    style: e
                })
            };
            h.prototype.withSize = function(e) {
                return this.extend({
                    size: e
                })
            };
            h.prototype.withColor = function(e) {
                return this.extend({
                    color: e
                })
            };
            h.prototype.withPhantom = function() {
                return this.extend({
                    phantom: true
                })
            };
            h.prototype.withFont = function(e) {
                return this.extend({
                    font: e
                })
            };
            h.prototype.reset = function() {
                return this.extend({})
            };
            var a = {
                "katex-blue": "#6495ed",
                "katex-orange": "#ffa500",
                "katex-pink": "#ff00af",
                "katex-red": "#df0030",
                "katex-green": "#28ae7b",
                "katex-gray": "gray",
                "katex-purple": "#9d38bd",
                "katex-blueA": "#c7e9f1",
                "katex-blueB": "#9cdceb",
                "katex-blueC": "#58c4dd",
                "katex-blueD": "#29abca",
                "katex-blueE": "#1c758a",
                "katex-tealA": "#acead7",
                "katex-tealB": "#76ddc0",
                "katex-tealC": "#5cd0b3",
                "katex-tealD": "#55c1a7",
                "katex-tealE": "#49a88f",
                "katex-greenA": "#c9e2ae",
                "katex-greenB": "#a6cf8c",
                "katex-greenC": "#83c167",
                "katex-greenD": "#77b05d",
                "katex-greenE": "#699c52",
                "katex-goldA": "#f7c797",
                "katex-goldB": "#f9b775",
                "katex-goldC": "#f0ac5f",
                "katex-goldD": "#e1a158",
                "katex-goldE": "#c78d46",
                "katex-redA": "#f7a1a3",
                "katex-redB": "#ff8080",
                "katex-redC": "#fc6255",
                "katex-redD": "#e65a4c",
                "katex-redE": "#cf5044",
                "katex-maroonA": "#ecabc1",
                "katex-maroonB": "#ec92ab",
                "katex-maroonC": "#c55f73",
                "katex-maroonD": "#a24d61",
                "katex-maroonE": "#94424f",
                "katex-purpleA": "#caa3e8",
                "katex-purpleB": "#b189c6",
                "katex-purpleC": "#9a72ac",
                "katex-purpleD": "#715582",
                "katex-purpleE": "#644172",
                "katex-mintA": "#f5f9e8",
                "katex-mintB": "#edf2df",
                "katex-mintC": "#e0e5cc",
                "katex-grayA": "#fdfdfd",
                "katex-grayB": "#f7f7f7",
                "katex-grayC": "#eeeeee",
                "katex-grayD": "#dddddd",
                "katex-grayE": "#cccccc",
                "katex-grayF": "#aaaaaa",
                "katex-grayG": "#999999",
                "katex-grayH": "#555555",
                "katex-grayI": "#333333",
                "katex-kaBlue": "#314453",
                "katex-kaGreen": "#639b24"
            };
            h.prototype.getColor = function() {
                if (this.phantom) {
                    return "transparent"
                } else {
                    return a[this.color] || this.color
                }
            };
            t.exports = h
        }, {}],
        5: [function(e, t, i) {
            function h(e, t, i) {
                var a = "KaTeX parse error: " + e;
                if (t !== undefined && i !== undefined) {
                    a += " at position " + i + ": ";
                    var r = t._input;
                    r = r.slice(0, i) + "\u0332" + r.slice(i);
                    var l = Math.max(0, i - 15);
                    var s = i + 15;
                    a += r.slice(l, s)
                }
                var p = new Error(a);
                p.name = "ParseError";
                p.__proto__ = h.prototype;
                p.position = i;
                return p
            }
            h.prototype.__proto__ = Error.prototype;
            t.exports = h
        }, {}],
        6: [function(e, t, i) {
            var h = e("./functions");
            var a = e("./environments");
            var r = e("./Lexer");
            var l = e("./symbols");
            var s = e("./utils");
            var p = e("./parseData");
            var c = e("./ParseError");

            function n(e, t) {
                this.lexer = new r(e);
                this.settings = t
            }
            var o = p.ParseNode;
            var g = p.ParseResult;

            function d(e, t) {
                this.result = e;
                this.isFunction = t
            }
            n.prototype.expect = function(e, t) {
                if (e.text !== t) {
                    throw new c("Expected '" + t + "', got '" + e.text + "'", this.lexer, e.position)
                }
            };
            n.prototype.parse = function(e) {
                var t = this.parseInput(0, "math");
                return t.result
            };
            n.prototype.parseInput = function(e, t) {
                var i = this.parseExpression(e, t, false);
                this.expect(i.peek, "EOF");
                return i
            };
            var w = ["}", "\\end", "\\right", "&", "\\\\", "\\cr"];
            n.prototype.parseExpression = function(e, t, i, h) {
                var a = [];
                var r = null;
                while (true) {
                    r = this.lexer.lex(e, t);
                    if (w.indexOf(r.text) !== -1) {
                        break
                    }
                    if (h && r.text === h) {
                        break
                    }
                    var l = this.parseAtom(e, t);
                    if (!l) {
                        if (!this.settings.throwOnError && r.text[0] === "\\") {
                            var s = this.handleUnsupportedCmd(r.text, t);
                            a.push(s);
                            e = r.position;
                            continue
                        }
                        break
                    }
                    if (i && l.result.type === "infix") {
                        break
                    }
                    a.push(l.result);
                    e = l.position
                }
                var p = new g(this.handleInfixNodes(a, t), e);
                p.peek = r;
                return p
            };
            n.prototype.handleInfixNodes = function(e, t) {
                var i = -1;
                var a;
                var r;
                for (var l = 0; l < e.length; l++) {
                    var s = e[l];
                    if (s.type === "infix") {
                        if (i !== -1) {
                            throw new c("only one infix operator per group", this.lexer, -1)
                        }
                        i = l;
                        r = s.value.replaceWith;
                        a = h.funcs[r]
                    }
                }
                if (i !== -1) {
                    var p, n;
                    var g = e.slice(0, i);
                    var d = e.slice(i + 1);
                    if (g.length === 1 && g[0].type === "ordgroup") {
                        p = g[0]
                    } else {
                        p = new o("ordgroup", g, t)
                    }
                    if (d.length === 1 && d[0].type === "ordgroup") {
                        n = d[0]
                    } else {
                        n = new o("ordgroup", d, t)
                    }
                    var w = a.handler(r, p, n);
                    return [new o(w.type, w, t)]
                } else {
                    return e
                }
            };
            var u = 1;
            n.prototype.handleSupSubscript = function(e, t, i, a) {
                var r = this.parseGroup(e, t);
                if (!r) {
                    var l = this.lexer.lex(e, t);
                    if (!this.settings.throwOnError && l.text[0] === "\\") {
                        return new g(this.handleUnsupportedCmd(l.text, t), l.position)
                    } else {
                        throw new c("Expected group after '" + i + "'", this.lexer, e)
                    }
                } else if (r.isFunction) {
                    var s = h.funcs[r.result.result].greediness;
                    if (s > u) {
                        return this.parseFunction(e, t)
                    } else {
                        throw new c("Got function '" + r.result.result + "' with no arguments " + "as " + a, this.lexer, e)
                    }
                } else {
                    return r.result
                }
            };
            n.prototype.handleUnsupportedCmd = function(e, t) {
                var i = [];
                for (var h = 0; h < e.length; h++) {
                    i.push(new o("textord", e[h], "text"))
                }
                var a = new o("text", {
                    body: i,
                    type: "text"
                }, t);
                var r = new o("color", {
                    color: this.settings.errorColor,
                    value: [a],
                    type: "color"
                }, t);
                return r
            };
            n.prototype.parseAtom = function(e, t) {
                var i = this.parseImplicitGroup(e, t);
                if (t === "text") {
                    return i
                }
                var h;
                if (!i) {
                    h = e;
                    i = undefined
                } else {
                    h = i.position
                }
                var a;
                var r;
                var l;
                while (true) {
                    var s = this.lexer.lex(h, t);
                    if (s.text === "\\limits" || s.text === "\\nolimits") {
                        if (!i || i.result.type !== "op") {
                            throw new c("Limit controls must follow a math operator", this.lexer, h)
                        } else {
                            var p = s.text === "\\limits";
                            i.result.value.limits = p;
                            i.result.value.alwaysHandleSupSub = true;
                            h = s.position
                        }
                    } else if (s.text === "^") {
                        if (a) {
                            throw new c("Double superscript", this.lexer, h)
                        }
                        l = this.handleSupSubscript(s.position, t, s.text, "superscript");
                        h = l.position;
                        a = l.result
                    } else if (s.text === "_") {
                        if (r) {
                            throw new c("Double subscript", this.lexer, h)
                        }
                        l = this.handleSupSubscript(s.position, t, s.text, "subscript");
                        h = l.position;
                        r = l.result
                    } else if (s.text === "'") {
                        var n = new o("textord", "\\prime", t);
                        var d = [n];
                        h = s.position;
                        while ((s = this.lexer.lex(h, t)).text === "'") {
                            d.push(n);
                            h = s.position
                        }
                        a = new o("ordgroup", d, t)
                    } else {
                        break
                    }
                }
                if (a || r) {
                    return new g(new o("supsub", {
                        base: i && i.result,
                        sup: a,
                        sub: r
                    }, t), h)
                } else {
                    return i
                }
            };
            var k = ["\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"];
            var m = ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"];
            n.prototype.parseImplicitGroup = function(e, t) {
                var i = this.parseSymbol(e, t);
                if (!i || !i.result) {
                    return this.parseFunction(e, t)
                }
                var h = i.result.result;
                var r;
                if (h === "\\left") {
                    var l = this.parseFunction(e, t);
                    r = this.parseExpression(l.position, t, false);
                    this.expect(r.peek, "\\right");
                    var p = this.parseFunction(r.position, t);
                    return new g(new o("leftright", {
                        body: r.result,
                        left: l.result.value.value,
                        right: p.result.value.value
                    }, t), p.position)
                } else if (h === "\\begin") {
                    var n = this.parseFunction(e, t);
                    var d = n.result.value.name;
                    if (!a.hasOwnProperty(d)) {
                        throw new c("No such environment: " + d, this.lexer, n.result.value.namepos)
                    }
                    var w = a[d];
                    var u = [null, t, d];
                    var f = this.parseArguments(n.position, t, "\\begin{" + d + "}", w, u);
                    u[0] = f;
                    var v = w.handler.apply(this, u);
                    var y = this.lexer.lex(v.position, t);
                    this.expect(y, "\\end");
                    var x = this.parseFunction(v.position, t);
                    if (x.result.value.name !== d) {
                        throw new c("Mismatch: \\begin{" + d + "} matched " + "by \\end{" + x.result.value.name + "}", this.lexer, x.namepos)
                    }
                    v.position = x.position;
                    return v
                } else if (s.contains(k, h)) {
                    r = this.parseExpression(i.result.position, t, false);
                    return new g(new o("sizing", {
                        size: "size" + (s.indexOf(k, h) + 1),
                        value: r.result
                    }, t), r.position)
                } else if (s.contains(m, h)) {
                    r = this.parseExpression(i.result.position, t, true);
                    return new g(new o("styling", {
                        style: h.slice(1, h.length - 5),
                        value: r.result
                    }, t), r.position)
                } else {
                    return this.parseFunction(e, t)
                }
            };
            n.prototype.parseFunction = function(e, t) {
                var i = this.parseGroup(e, t);
                if (i) {
                    if (i.isFunction) {
                        var a = i.result.result;
                        var r = h.funcs[a];
                        if (t === "text" && !r.allowedInText) {
                            throw new c("Can't use function '" + a + "' in text mode", this.lexer, i.position)
                        }
                        var l = [a];
                        var s = this.parseArguments(i.result.position, t, a, r, l);
                        var p = h.funcs[a].handler.apply(this, l);
                        return new g(new o(p.type, p, t), s)
                    } else {
                        return i.result
                    }
                } else {
                    return null
                }
            };
            n.prototype.parseArguments = function(e, t, i, a, r) {
                var l = a.numArgs + a.numOptionalArgs;
                if (l === 0) {
                    return e
                }
                var s = e;
                var p = a.greediness;
                var n = [s];
                for (var o = 0; o < l; o++) {
                    var w = a.argTypes && a.argTypes[o];
                    var u;
                    if (o < a.numOptionalArgs) {
                        if (w) {
                            u = this.parseSpecialGroup(s, w, t, true)
                        } else {
                            u = this.parseOptionalGroup(s, t)
                        }
                        if (!u) {
                            r.push(null);
                            n.push(s);
                            continue
                        }
                    } else {
                        if (w) {
                            u = this.parseSpecialGroup(s, w, t)
                        } else {
                            u = this.parseGroup(s, t)
                        }
                        if (!u) {
                            var k = this.lexer.lex(s, t);
                            if (!this.settings.throwOnError && k.text[0] === "\\") {
                                u = new d(new g(this.handleUnsupportedCmd(k.text, t), k.position), false)
                            } else {
                                throw new c("Expected group after '" + i + "'", this.lexer, e)
                            }
                        }
                    }
                    var m;
                    if (u.isFunction) {
                        var f = h.funcs[u.result.result].greediness;
                        if (f > p) {
                            m = this.parseFunction(s, t)
                        } else {
                            throw new c("Got function '" + u.result.result + "' as " + "argument to '" + i + "'", this.lexer, u.result.position - 1)
                        }
                    } else {
                        m = u.result
                    }
                    r.push(m.result);
                    n.push(m.position);
                    s = m.position
                }
                r.push(n);
                return s
            };
            n.prototype.parseSpecialGroup = function(e, t, i, h) {
                if (t === "original") {
                    t = i
                }
                if (t === "color" || t === "size") {
                    var a = this.lexer.lex(e, i);
                    if (h && a.text !== "[") {
                        return null
                    }
                    this.expect(a, h ? "[" : "{");
                    var r = this.lexer.lex(a.position, t);
                    var l;
                    if (t === "color") {
                        l = r.text
                    } else {
                        l = r.data
                    }
                    var s = this.lexer.lex(r.position, i);
                    this.expect(s, h ? "]" : "}");
                    return new d(new g(new o(t, l, i), s.position), false)
                } else if (t === "text") {
                    var p = this.lexer.lex(e, "whitespace");
                    e = p.position
                }
                if (h) {
                    return this.parseOptionalGroup(e, t)
                } else {
                    return this.parseGroup(e, t)
                }
            };
            n.prototype.parseGroup = function(e, t) {
                var i = this.lexer.lex(e, t);
                if (i.text === "{") {
                    var h = this.parseExpression(i.position, t, false);
                    var a = this.lexer.lex(h.position, t);
                    this.expect(a, "}");
                    return new d(new g(new o("ordgroup", h.result, t), a.position), false)
                } else {
                    return this.parseSymbol(e, t)
                }
            };
            n.prototype.parseOptionalGroup = function(e, t) {
                var i = this.lexer.lex(e, t);
                if (i.text === "[") {
                    var h = this.parseExpression(i.position, t, false, "]");
                    var a = this.lexer.lex(h.position, t);
                    this.expect(a, "]");
                    return new d(new g(new o("ordgroup", h.result, t), a.position), false)
                } else {
                    return null
                }
            };
            n.prototype.parseSymbol = function(e, t) {
                var i = this.lexer.lex(e, t);
                if (h.funcs[i.text]) {
                    return new d(new g(i.text, i.position), true)
                } else if (l[t][i.text]) {
                    return new d(new g(new o(l[t][i.text].group, i.text, t), i.position), false)
                } else {
                    return null
                }
            };
            n.prototype.ParseNode = o;
            t.exports = n
        }, {
            "./Lexer": 3,
            "./ParseError": 5,
            "./environments": 15,
            "./functions": 18,
            "./parseData": 20,
            "./symbols": 22,
            "./utils": 23
        }],
        7: [function(e, t, i) {
            function h(e, t) {
                return e === undefined ? t : e
            }

            function a(e) {
                e = e || {};
                this.displayMode = h(e.displayMode, false);
                this.throwOnError = h(e.throwOnError, true);
                this.errorColor = h(e.errorColor, "#cc0000")
            }
            t.exports = a
        }, {}],
        8: [function(e, t, i) {
            function h(e, t, i, h) {
                this.id = e;
                this.size = t;
                this.cramped = h;
                this.sizeMultiplier = i
            }
            h.prototype.sup = function() {
                return w[u[this.id]]
            };
            h.prototype.sub = function() {
                return w[k[this.id]]
            };
            h.prototype.fracNum = function() {
                return w[m[this.id]]
            };
            h.prototype.fracDen = function() {
                return w[f[this.id]]
            };
            h.prototype.cramp = function() {
                return w[v[this.id]]
            };
            h.prototype.cls = function() {
                return g[this.size] + (this.cramped ? " cramped" : " uncramped")
            };
            h.prototype.reset = function() {
                return d[this.size]
            };
            var a = 0;
            var r = 1;
            var l = 2;
            var s = 3;
            var p = 4;
            var c = 5;
            var n = 6;
            var o = 7;
            var g = ["displaystyle textstyle", "textstyle", "scriptstyle", "scriptscriptstyle"];
            var d = ["reset-textstyle", "reset-textstyle", "reset-scriptstyle", "reset-scriptscriptstyle"];
            var w = [new h(a, 0, 1, false), new h(r, 0, 1, true), new h(l, 1, 1, false), new h(s, 1, 1, true), new h(p, 2, .7, false), new h(c, 2, .7, true), new h(n, 3, .5, false), new h(o, 3, .5, true)];
            var u = [p, c, p, c, n, o, n, o];
            var k = [c, c, c, c, o, o, o, o];
            var m = [l, s, p, c, n, o, n, o];
            var f = [s, s, c, c, o, o, o, o];
            var v = [r, r, s, s, c, c, o, o];
            t.exports = {
                DISPLAY: w[a],
                TEXT: w[l],
                SCRIPT: w[p],
                SCRIPTSCRIPT: w[n]
            }
        }, {}],
        9: [function(e, t, i) {
            var h = e("./domTree");
            var a = e("./fontMetrics");
            var r = e("./symbols");
            var l = e("./utils");
            var s = ["\\Gamma", "\\Delta", "\\Theta", "\\Lambda", "\\Xi", "\\Pi", "\\Sigma", "\\Upsilon", "\\Phi", "\\Psi", "\\Omega"];
            var p = ["\u0131", "\u0237"];
            var c = function(e, t, i, l, s) {
                if (r[i][e] && r[i][e].replace) {
                    e = r[i][e].replace
                }
                var p = a.getCharacterMetrics(e, t);
                var c;
                if (p) {
                    c = new h.symbolNode(e, p.height, p.depth, p.italic, p.skew, s)
                } else {
                    typeof console !== "undefined" && console.warn("No character metrics for '" + e + "' in style '" + t + "'");
                    c = new h.symbolNode(e, 0, 0, 0, 0, s)
                }
                if (l) {
                    c.style.color = l
                }
                return c
            };
            var n = function(e, t, i, h) {
                if (e === "\\" || r[t][e].font === "main") {
                    return c(e, "Main-Regular", t, i, h)
                } else {
                    return c(e, "AMS-Regular", t, i, h.concat(["amsrm"]))
                }
            };
            var o = function(e, t, i, h, a) {
                if (a === "mathord") {
                    return g(e, t, i, h)
                } else if (a === "textord") {
                    return c(e, "Main-Regular", t, i, h.concat(["mathrm"]))
                } else {
                    throw new Error("unexpected type: " + a + " in mathDefault")
                }
            };
            var g = function(e, t, i, h) {
                if (/[0-9]/.test(e.charAt(0)) || l.contains(p, e) || l.contains(s, e)) {
                    return c(e, "Main-Italic", t, i, h.concat(["mainit"]))
                } else {
                    return c(e, "Math-Italic", t, i, h.concat(["mathit"]))
                }
            };
            var d = function(e, t, i) {
                var h = e.mode;
                var s = e.value;
                if (r[h][s] && r[h][s].replace) {
                    s = r[h][s].replace
                }
                var n = ["mord"];
                var d = t.getColor();
                var w = t.font;
                if (w) {
                    if (w === "mathit" || l.contains(p, s)) {
                        return g(s, h, d, n)
                    } else {
                        var u = x[w].fontName;
                        if (a.getCharacterMetrics(s, u)) {
                            return c(s, u, h, d, n.concat([w]))
                        } else {
                            return o(s, h, d, n, i)
                        }
                    }
                } else {
                    return o(s, h, d, n, i)
                }
            };
            var w = function(e) {
                var t = 0;
                var i = 0;
                var h = 0;
                if (e.children) {
                    for (var a = 0; a < e.children.length; a++) {
                        if (e.children[a].height > t) {
                            t = e.children[a].height
                        }
                        if (e.children[a].depth > i) {
                            i = e.children[a].depth
                        }
                        if (e.children[a].maxFontSize > h) {
                            h = e.children[a].maxFontSize
                        }
                    }
                }
                e.height = t;
                e.depth = i;
                e.maxFontSize = h
            };
            var u = function(e, t, i) {
                var a = new h.span(e, t);
                w(a);
                if (i) {
                    a.style.color = i
                }
                return a
            };
            var k = function(e) {
                var t = new h.documentFragment(e);
                w(t);
                return t
            };
            var m = function(e, t) {
                var i = u([], [new h.symbolNode("\u200b")]);
                i.style.fontSize = t / e.style.sizeMultiplier + "em";
                var a = u(["fontsize-ensurer", "reset-" + e.size, "size5"], [i]);
                return a
            };
            var f = function(e, t, i, a) {
                var r;
                var l;
                var s;
                if (t === "individualShift") {
                    var p = e;
                    e = [p[0]];
                    r = -p[0].shift - p[0].elem.depth;
                    l = r;
                    for (s = 1; s < p.length; s++) {
                        var c = -p[s].shift - l - p[s].elem.depth;
                        var n = c - (p[s - 1].elem.height + p[s - 1].elem.depth);
                        l = l + c;
                        e.push({
                            type: "kern",
                            size: n
                        });
                        e.push(p[s])
                    }
                } else if (t === "top") {
                    var o = i;
                    for (s = 0; s < e.length; s++) {
                        if (e[s].type === "kern") {
                            o -= e[s].size
                        } else {
                            o -= e[s].elem.height + e[s].elem.depth
                        }
                    }
                    r = o
                } else if (t === "bottom") {
                    r = -i
                } else if (t === "shift") {
                    r = -e[0].elem.depth - i
                } else if (t === "firstBaseline") {
                    r = -e[0].elem.depth
                } else {
                    r = 0
                }
                var g = 0;
                for (s = 0; s < e.length; s++) {
                    if (e[s].type === "elem") {
                        g = Math.max(g, e[s].elem.maxFontSize)
                    }
                }
                var d = m(a, g);
                var w = [];
                l = r;
                for (s = 0; s < e.length; s++) {
                    if (e[s].type === "kern") {
                        l += e[s].size
                    } else {
                        var k = e[s].elem;
                        var f = -k.depth - l;
                        l += k.height + k.depth;
                        var v = u([], [d, k]);
                        v.height -= f;
                        v.depth += f;
                        v.style.top = f + "em";
                        w.push(v)
                    }
                }
                var y = u(["baseline-fix"], [d, new h.symbolNode("\u200b")]);
                w.push(y);
                var x = u(["vlist"], w);
                x.height = Math.max(l, x.height);
                x.depth = Math.max(-r, x.depth);
                return x
            };
            var v = {
                size1: .5,
                size2: .7,
                size3: .8,
                size4: .9,
                size5: 1,
                size6: 1.2,
                size7: 1.44,
                size8: 1.73,
                size9: 2.07,
                size10: 2.49
            };
            var y = {
                "\\qquad": {
                    size: "2em",
                    className: "qquad"
                },
                "\\quad": {
                    size: "1em",
                    className: "quad"
                },
                "\\enspace": {
                    size: "0.5em",
                    className: "enspace"
                },
                "\\;": {
                    size: "0.277778em",
                    className: "thickspace"
                },
                "\\:": {
                    size: "0.22222em",
                    className: "mediumspace"
                },
                "\\,": {
                    size: "0.16667em",
                    className: "thinspace"
                },
                "\\!": {
                    size: "-0.16667em",
                    className: "negativethinspace"
                }
            };
            var x = {
                mathbf: {
                    variant: "bold",
                    fontName: "Main-Bold"
                },
                mathrm: {
                    variant: "normal",
                    fontName: "Main-Regular"
                },
                mathbb: {
                    variant: "double-struck",
                    fontName: "AMS-Regular"
                },
                mathcal: {
                    variant: "script",
                    fontName: "Caligraphic-Regular"
                },
                mathfrak: {
                    variant: "fraktur",
                    fontName: "Fraktur-Regular"
                },
                mathscr: {
                    variant: "script",
                    fontName: "Script-Regular"
                },
                mathsf: {
                    variant: "sans-serif",
                    fontName: "SansSerif-Regular"
                },
                mathtt: {
                    variant: "monospace",
                    fontName: "Typewriter-Regular"
                }
            };
            t.exports = {
                fontMap: x,
                makeSymbol: c,
                mathsym: n,
                makeSpan: u,
                makeFragment: k,
                makeVList: f,
                makeOrd: d,
                sizingMultiplier: v,
                spacingFunctions: y
            }
        }, {
            "./domTree": 14,
            "./fontMetrics": 16,
            "./symbols": 22,
            "./utils": 23
        }],
        10: [function(e, t, i) {
            var h = e("./ParseError");
            var a = e("./Style");
            var r = e("./buildCommon");
            var l = e("./delimiter");
            var s = e("./domTree");
            var p = e("./fontMetrics");
            var c = e("./utils");
            var n = r.makeSpan;
            var o = function(e, t, i) {
                var h = [];
                for (var a = 0; a < e.length; a++) {
                    var r = e[a];
                    h.push(v(r, t, i));
                    i = r
                }
                return h
            };
            var g = {
                mathord: "mord",
                textord: "mord",
                bin: "mbin",
                rel: "mrel",
                text: "mord",
                open: "mopen",
                close: "mclose",
                inner: "minner",
                genfrac: "mord",
                array: "mord",
                spacing: "mord",
                punct: "mpunct",
                ordgroup: "mord",
                op: "mop",
                katex: "mord",
                overline: "mord",
                rule: "mord",
                leftright: "minner",
                sqrt: "mord",
                accent: "mord"
            };
            var d = function(e) {
                if (e == null) {
                    return g.mathord
                } else if (e.type === "supsub") {
                    return d(e.value.base)
                } else if (e.type === "llap" || e.type === "rlap") {
                    return d(e.value)
                } else if (e.type === "color") {
                    return d(e.value.value)
                } else if (e.type === "sizing") {
                    return d(e.value.value)
                } else if (e.type === "styling") {
                    return d(e.value.value)
                } else if (e.type === "delimsizing") {
                    return g[e.value.delimType]
                } else {
                    return g[e.type]
                }
            };
            var w = function(e, t) {
                if (!e) {
                    return false
                } else if (e.type === "op") {
                    return e.value.limits && (t.style.size === a.DISPLAY.size || e.value.alwaysHandleSupSub)
                } else if (e.type === "accent") {
                    return k(e.value.base)
                } else {
                    return null
                }
            };
            var u = function(e) {
                if (!e) {
                    return false
                } else if (e.type === "ordgroup") {
                    if (e.value.length === 1) {
                        return u(e.value[0])
                    } else {
                        return e
                    }
                } else if (e.type === "color") {
                    if (e.value.value.length === 1) {
                        return u(e.value.value[0])
                    } else {
                        return e
                    }
                } else {
                    return e
                }
            };
            var k = function(e) {
                var t = u(e);
                return t.type === "mathord" || t.type === "textord" || t.type === "bin" || t.type === "rel" || t.type === "inner" || t.type === "open" || t.type === "close" || t.type === "punct"
            };
            var m = function(e) {
                return n(["sizing", "reset-" + e.size, "size5", e.style.reset(), a.TEXT.cls(), "nulldelimiter"])
            };
            var f = {
                mathord: function(e, t, i) {
                    return r.makeOrd(e, t, "mathord")
                },
                textord: function(e, t, i) {
                    return r.makeOrd(e, t, "textord")
                },
                bin: function(e, t, i) {
                    var h = "mbin";
                    var a = i;
                    while (a && a.type === "color") {
                        var l = a.value.value;
                        a = l[l.length - 1]
                    }
                    if (!i || c.contains(["mbin", "mopen", "mrel", "mop", "mpunct"], d(a))) {
                        e.type = "textord";
                        h = "mord"
                    }
                    return r.mathsym(e.value, e.mode, t.getColor(), [h])
                },
                rel: function(e, t, i) {
                    return r.mathsym(e.value, e.mode, t.getColor(), ["mrel"])
                },
                open: function(e, t, i) {
                    return r.mathsym(e.value, e.mode, t.getColor(), ["mopen"])
                },
                close: function(e, t, i) {
                    return r.mathsym(e.value, e.mode, t.getColor(), ["mclose"])
                },
                inner: function(e, t, i) {
                    return r.mathsym(e.value, e.mode, t.getColor(), ["minner"])
                },
                punct: function(e, t, i) {
                    return r.mathsym(e.value, e.mode, t.getColor(), ["mpunct"])
                },
                ordgroup: function(e, t, i) {
                    return n(["mord", t.style.cls()], o(e.value, t.reset()))
                },
                text: function(e, t, i) {
                    return n(["text", "mord", t.style.cls()], o(e.value.body, t.reset()))
                },
                color: function(e, t, i) {
                    var h = o(e.value.value, t.withColor(e.value.color), i);
                    return new r.makeFragment(h)
                },
                supsub: function(e, t, i) {
                    if (w(e.value.base, t)) {
                        return f[e.value.base.type](e, t, i)
                    }
                    var h = v(e.value.base, t.reset());
                    var l, c, o, g;
                    if (e.value.sup) {
                        o = v(e.value.sup, t.withStyle(t.style.sup()));
                        l = n([t.style.reset(), t.style.sup().cls()], [o])
                    }
                    if (e.value.sub) {
                        g = v(e.value.sub, t.withStyle(t.style.sub()));
                        c = n([t.style.reset(), t.style.sub().cls()], [g])
                    }
                    var u, m;
                    if (k(e.value.base)) {
                        u = 0;
                        m = 0
                    } else {
                        u = h.height - p.metrics.supDrop;
                        m = h.depth + p.metrics.subDrop
                    }
                    var y;
                    if (t.style === a.DISPLAY) {
                        y = p.metrics.sup1
                    } else if (t.style.cramped) {
                        y = p.metrics.sup3
                    } else {
                        y = p.metrics.sup2
                    }
                    var x = a.TEXT.sizeMultiplier * t.style.sizeMultiplier;
                    var b = .5 / p.metrics.ptPerEm / x + "em";
                    var z;
                    if (!e.value.sup) {
                        m = Math.max(m, p.metrics.sub1, g.height - .8 * p.metrics.xHeight);
                        z = r.makeVList([{
                            type: "elem",
                            elem: c
                        }], "shift", m, t);
                        z.children[0].style.marginRight = b;
                        if (h instanceof s.symbolNode) {
                            z.children[0].style.marginLeft = -h.italic + "em"
                        }
                    } else if (!e.value.sub) {
                        u = Math.max(u, y, o.depth + .25 * p.metrics.xHeight);
                        z = r.makeVList([{
                            type: "elem",
                            elem: l
                        }], "shift", -u, t);
                        z.children[0].style.marginRight = b
                    } else {
                        u = Math.max(u, y, o.depth + .25 * p.metrics.xHeight);
                        m = Math.max(m, p.metrics.sub2);
                        var S = p.metrics.defaultRuleThickness;
                        if (u - o.depth - (g.height - m) < 4 * S) {
                            m = 4 * S - (u - o.depth) + g.height;
                            var M = .8 * p.metrics.xHeight - (u - o.depth);
                            if (M > 0) {
                                u += M;
                                m -= M
                            }
                        }
                        z = r.makeVList([{
                            type: "elem",
                            elem: c,
                            shift: m
                        }, {
                            type: "elem",
                            elem: l,
                            shift: -u
                        }], "individualShift", null, t);
                        if (h instanceof s.symbolNode) {
                            z.children[0].style.marginLeft = -h.italic + "em"
                        }
                        z.children[0].style.marginRight = b;
                        z.children[1].style.marginRight = b
                    }
                    return n([d(e.value.base)], [h, z])
                },
                genfrac: function(e, t, i) {
                    var h = t.style;
                    if (e.value.size === "display") {
                        h = a.DISPLAY
                    } else if (e.value.size === "text") {
                        h = a.TEXT
                    }
                    var s = h.fracNum();
                    var c = h.fracDen();
                    var o = v(e.value.numer, t.withStyle(s));
                    var g = n([h.reset(), s.cls()], [o]);
                    var d = v(e.value.denom, t.withStyle(c));
                    var w = n([h.reset(), c.cls()], [d]);
                    var u;
                    if (e.value.hasBarLine) {
                        u = p.metrics.defaultRuleThickness / t.style.sizeMultiplier
                    } else {
                        u = 0
                    }
                    var k;
                    var f;
                    var y;
                    if (h.size === a.DISPLAY.size) {
                        k = p.metrics.num1;
                        if (u > 0) {
                            f = 3 * u
                        } else {
                            f = 7 * p.metrics.defaultRuleThickness
                        }
                        y = p.metrics.denom1
                    } else {
                        if (u > 0) {
                            k = p.metrics.num2;
                            f = u
                        } else {
                            k = p.metrics.num3;
                            f = 3 * p.metrics.defaultRuleThickness
                        }
                        y = p.metrics.denom2
                    }
                    var x;
                    if (u === 0) {
                        var b = k - o.depth - (d.height - y);
                        if (b < f) {
                            k += .5 * (f - b);
                            y += .5 * (f - b)
                        }
                        x = r.makeVList([{
                            type: "elem",
                            elem: w,
                            shift: y
                        }, {
                            type: "elem",
                            elem: g,
                            shift: -k
                        }], "individualShift", null, t)
                    } else {
                        var z = p.metrics.axisHeight;
                        if (k - o.depth - (z + .5 * u) < f) {
                            k += f - (k - o.depth - (z + .5 * u))
                        }
                        if (z - .5 * u - (d.height - y) < f) {
                            y += f - (z - .5 * u - (d.height - y))
                        }
                        var S = n([t.style.reset(), a.TEXT.cls(), "frac-line"]);
                        S.height = u;
                        var M = -(z - .5 * u);
                        x = r.makeVList([{
                            type: "elem",
                            elem: w,
                            shift: y
                        }, {
                            type: "elem",
                            elem: S,
                            shift: M
                        }, {
                            type: "elem",
                            elem: g,
                            shift: -k
                        }], "individualShift", null, t)
                    }
                    x.height *= h.sizeMultiplier / t.style.sizeMultiplier;
                    x.depth *= h.sizeMultiplier / t.style.sizeMultiplier;
                    var q;
                    if (h.size === a.DISPLAY.size) {
                        q = p.metrics.delim1
                    } else {
                        q = p.metrics.getDelim2(h)
                    }
                    var A, T;
                    if (e.value.leftDelim == null) {
                        A = m(t)
                    } else {
                        A = l.customSizedDelim(e.value.leftDelim, q, true, t.withStyle(h), e.mode)
                    }
                    if (e.value.rightDelim == null) {
                        T = m(t)
                    } else {
                        T = l.customSizedDelim(e.value.rightDelim, q, true, t.withStyle(h), e.mode)
                    }
                    return n(["mord", t.style.reset(), h.cls()], [A, n(["mfrac"], [x]), T], t.getColor())
                },
                array: function(e, t, i) {
                    var a, l;
                    var s = e.value.body.length;
                    var o = 0;
                    var g = new Array(s);
                    var d = 1 / p.metrics.ptPerEm;
                    var w = 5 * d;
                    var u = 12 * d;
                    var k = c.deflt(e.value.arraystretch, 1);
                    var m = k * u;
                    var f = .7 * m;
                    var y = .3 * m;
                    var x = 0;
                    for (a = 0; a < e.value.body.length; ++a) {
                        var b = e.value.body[a];
                        var z = f;
                        var S = y;
                        if (o < b.length) {
                            o = b.length
                        }
                        var M = new Array(b.length);
                        for (l = 0; l < b.length; ++l) {
                            var q = v(b[l], t);
                            if (S < q.depth) {
                                S = q.depth
                            }
                            if (z < q.height) {
                                z = q.height
                            }
                            M[l] = q
                        }
                        var A = 0;
                        if (e.value.rowGaps[a]) {
                            A = e.value.rowGaps[a].value;
                            switch (A.unit) {
                                case "em":
                                    A = A.number;
                                    break;
                                case "ex":
                                    A = A.number * p.metrics.emPerEx;
                                    break;
                                default:
                                    console.error("Can't handle unit " + A.unit);
                                    A = 0
                            }
                            if (A > 0) {
                                A += y;
                                if (S < A) {
                                    S = A
                                }
                                A = 0
                            }
                        }
                        M.height = z;
                        M.depth = S;
                        x += z;
                        M.pos = x;
                        x += S + A;
                        g[a] = M
                    }
                    var T = x / 2 + p.metrics.axisHeight;
                    var N = e.value.cols || [];
                    var C = [];
                    var R;
                    var E;
                    for (l = 0, E = 0; l < o || E < N.length; ++l, ++E) {
                        var P = N[E] || {};
                        var D = true;
                        while (P.type === "separator") {
                            if (!D) {
                                R = n(["arraycolsep"], []);
                                R.style.width = p.metrics.doubleRuleSep + "em";
                                C.push(R)
                            }
                            if (P.separator === "|") {
                                var L = n(["vertical-separator"], []);
                                L.style.height = x + "em";
                                L.style.verticalAlign = -(x - T) + "em";
                                C.push(L)
                            } else {
                                throw new h("Invalid separator type: " + P.separator)
                            }
                            E++;
                            P = N[E] || {};
                            D = false
                        }
                        if (l >= o) {
                            continue
                        }
                        var O;
                        if (l > 0 || e.value.hskipBeforeAndAfter) {
                            O = c.deflt(P.pregap, w);
                            if (O !== 0) {
                                R = n(["arraycolsep"], []);
                                R.style.width = O + "em";
                                C.push(R)
                            }
                        }
                        var I = [];
                        for (a = 0; a < s; ++a) {
                            var B = g[a];
                            var F = B[l];
                            if (!F) {
                                continue
                            }
                            var _ = B.pos - T;
                            F.depth = B.depth;
                            F.height = B.height;
                            I.push({
                                type: "elem",
                                elem: F,
                                shift: _
                            })
                        }
                        I = r.makeVList(I, "individualShift", null, t);
                        I = n(["col-align-" + (P.align || "c")], [I]);
                        C.push(I);
                        if (l < o - 1 || e.value.hskipBeforeAndAfter) {
                            O = c.deflt(P.postgap, w);
                            if (O !== 0) {
                                R = n(["arraycolsep"], []);
                                R.style.width = O + "em";
                                C.push(R)
                            }
                        }
                    }
                    g = n(["mtable"], C);
                    return n(["mord"], [g], t.getColor())
                },
                spacing: function(e, t, i) {
                    if (e.value === "\\ " || e.value === "\\space" || e.value === " " || e.value === "~") {
                        return n(["mord", "mspace"], [r.mathsym(e.value, e.mode)])
                    } else {
                        return n(["mord", "mspace", r.spacingFunctions[e.value].className])
                    }
                },
                llap: function(e, t, i) {
                    var h = n(["inner"], [v(e.value.body, t.reset())]);
                    var a = n(["fix"], []);
                    return n(["llap", t.style.cls()], [h, a])
                },
                rlap: function(e, t, i) {
                    var h = n(["inner"], [v(e.value.body, t.reset())]);
                    var a = n(["fix"], []);
                    return n(["rlap", t.style.cls()], [h, a])
                },
                op: function(e, t, i) {
                    var h;
                    var l;
                    var s = false;
                    if (e.type === "supsub") {
                        h = e.value.sup;
                        l = e.value.sub;
                        e = e.value.base;
                        s = true
                    }
                    var o = ["\\smallint"];
                    var g = false;
                    if (t.style.size === a.DISPLAY.size && e.value.symbol && !c.contains(o, e.value.body)) {
                        g = true
                    }
                    var d;
                    var w = 0;
                    var u = 0;
                    if (e.value.symbol) {
                        var k = g ? "Size2-Regular" : "Size1-Regular";
                        d = r.makeSymbol(e.value.body, k, "math", t.getColor(), ["op-symbol", g ? "large-op" : "small-op", "mop"]);
                        w = (d.height - d.depth) / 2 - p.metrics.axisHeight * t.style.sizeMultiplier;
                        u = d.italic
                    } else {
                        var m = [];
                        for (var f = 1; f < e.value.body.length; f++) {
                            m.push(r.mathsym(e.value.body[f], e.mode))
                        }
                        d = n(["mop"], m, t.getColor())
                    }
                    if (s) {
                        d = n([], [d]);
                        var y, x, b, z;
                        if (h) {
                            var S = v(h, t.withStyle(t.style.sup()));
                            y = n([t.style.reset(), t.style.sup().cls()], [S]);
                            x = Math.max(p.metrics.bigOpSpacing1, p.metrics.bigOpSpacing3 - S.depth)
                        }
                        if (l) {
                            var M = v(l, t.withStyle(t.style.sub()));
                            b = n([t.style.reset(), t.style.sub().cls()], [M]);
                            z = Math.max(p.metrics.bigOpSpacing2, p.metrics.bigOpSpacing4 - M.height)
                        }
                        var q, A, T;
                        if (!h) {
                            A = d.height - w;
                            q = r.makeVList([{
                                type: "kern",
                                size: p.metrics.bigOpSpacing5
                            }, {
                                type: "elem",
                                elem: b
                            }, {
                                type: "kern",
                                size: z
                            }, {
                                type: "elem",
                                elem: d
                            }], "top", A, t);
                            q.children[0].style.marginLeft = -u + "em"
                        } else if (!l) {
                            T = d.depth + w;
                            q = r.makeVList([{
                                type: "elem",
                                elem: d
                            }, {
                                type: "kern",
                                size: x
                            }, {
                                type: "elem",
                                elem: y
                            }, {
                                type: "kern",
                                size: p.metrics.bigOpSpacing5
                            }], "bottom", T, t);
                            q.children[1].style.marginLeft = u + "em"
                        } else if (!h && !l) {
                            return d
                        } else {
                            T = p.metrics.bigOpSpacing5 + b.height + b.depth + z + d.depth + w;
                            q = r.makeVList([{
                                type: "kern",
                                size: p.metrics.bigOpSpacing5
                            }, {
                                type: "elem",
                                elem: b
                            }, {
                                type: "kern",
                                size: z
                            }, {
                                type: "elem",
                                elem: d
                            }, {
                                type: "kern",
                                size: x
                            }, {
                                type: "elem",
                                elem: y
                            }, {
                                type: "kern",
                                size: p.metrics.bigOpSpacing5
                            }], "bottom", T, t);
                            q.children[0].style.marginLeft = -u + "em";
                            q.children[2].style.marginLeft = u + "em"
                        }
                        return n(["mop", "op-limits"], [q])
                    } else {
                        if (e.value.symbol) {
                            d.style.top = w + "em"
                        }
                        return d
                    }
                },
                katex: function(e, t, i) {
                    var h = n(["k"], [r.mathsym("K", e.mode)]);
                    var a = n(["a"], [r.mathsym("A", e.mode)]);
                    a.height = (a.height + .2) * .75;
                    a.depth = (a.height - .2) * .75;
                    var l = n(["t"], [r.mathsym("T", e.mode)]);
                    var s = n(["e"], [r.mathsym("E", e.mode)]);
                    s.height = s.height - .2155;
                    s.depth = s.depth + .2155;
                    var p = n(["x"], [r.mathsym("X", e.mode)]);
                    return n(["katex-logo", "mord"], [h, a, l, s, p], t.getColor())
                },
                overline: function(e, t, i) {
                    var h = v(e.value.body, t.withStyle(t.style.cramp()));
                    var l = p.metrics.defaultRuleThickness / t.style.sizeMultiplier;
                    var s = n([t.style.reset(), a.TEXT.cls(), "overline-line"]);
                    s.height = l;
                    s.maxFontSize = 1;
                    var c = r.makeVList([{
                        type: "elem",
                        elem: h
                    }, {
                        type: "kern",
                        size: 3 * l
                    }, {
                        type: "elem",
                        elem: s
                    }, {
                        type: "kern",
                        size: l
                    }], "firstBaseline", null, t);
                    return n(["overline", "mord"], [c], t.getColor())
                },
                sqrt: function(e, t, i) {
                    var h = v(e.value.body, t.withStyle(t.style.cramp()));
                    var s = p.metrics.defaultRuleThickness / t.style.sizeMultiplier;
                    var c = n([t.style.reset(), a.TEXT.cls(), "sqrt-line"], [], t.getColor());
                    c.height = s;
                    c.maxFontSize = 1;
                    var o = s;
                    if (t.style.id < a.TEXT.id) {
                        o = p.metrics.xHeight
                    }
                    var g = s + o / 4;
                    var d = (h.height + h.depth) * t.style.sizeMultiplier;
                    var w = d + g + s;
                    var u = n(["sqrt-sign"], [l.customSizedDelim("\\surd", w, false, t, e.mode)], t.getColor());
                    var k = u.height + u.depth - s;
                    if (k > h.height + h.depth + g) {
                        g = (g + k - h.height - h.depth) / 2
                    }
                    var m = -(h.height + g + s) + u.height;
                    u.style.top = m + "em";
                    u.height -= m;
                    u.depth += m;
                    var f;
                    if (h.height === 0 && h.depth === 0) {
                        f = n()
                    } else {
                        f = r.makeVList([{
                            type: "elem",
                            elem: h
                        }, {
                            type: "kern",
                            size: g
                        }, {
                            type: "elem",
                            elem: c
                        }, {
                            type: "kern",
                            size: s
                        }], "firstBaseline", null, t)
                    }
                    if (!e.value.index) {
                        return n(["sqrt", "mord"], [u, f])
                    } else {
                        var y = v(e.value.index, t.withStyle(a.SCRIPTSCRIPT));
                        var x = n([t.style.reset(), a.SCRIPTSCRIPT.cls()], [y]);
                        var b = Math.max(u.height, f.height);
                        var z = Math.max(u.depth, f.depth);
                        var S = .6 * (b - z);
                        var M = r.makeVList([{
                            type: "elem",
                            elem: x
                        }], "shift", -S, t);
                        var q = n(["root"], [M]);
                        return n(["sqrt", "mord"], [q, u, f])
                    }
                },
                sizing: function(e, t, i) {
                    var h = o(e.value.value, t.withSize(e.value.size), i);
                    var a = n(["mord"], [n(["sizing", "reset-" + t.size, e.value.size, t.style.cls()], h)]);
                    var l = r.sizingMultiplier[e.value.size];
                    a.maxFontSize = l * t.style.sizeMultiplier;
                    return a
                },
                styling: function(e, t, i) {
                    var h = {
                        display: a.DISPLAY,
                        text: a.TEXT,
                        script: a.SCRIPT,
                        scriptscript: a.SCRIPTSCRIPT
                    };
                    var r = h[e.value.style];
                    var l = o(e.value.value, t.withStyle(r), i);
                    return n([t.style.reset(), r.cls()], l)
                },
                font: function(e, t, i) {
                    var h = e.value.font;
                    return v(e.value.body, t.withFont(h), i)
                },
                delimsizing: function(e, t, i) {
                    var h = e.value.value;
                    if (h === ".") {
                        return n([g[e.value.delimType]])
                    }
                    return n([g[e.value.delimType]], [l.sizedDelim(h, e.value.size, t, e.mode)])
                },
                leftright: function(e, t, i) {
                    var h = o(e.value.body, t.reset());
                    var a = 0;
                    var r = 0;
                    for (var s = 0; s < h.length; s++) {
                        a = Math.max(h[s].height, a);
                        r = Math.max(h[s].depth, r)
                    }
                    a *= t.style.sizeMultiplier;
                    r *= t.style.sizeMultiplier;
                    var p;
                    if (e.value.left === ".") {
                        p = m(t)
                    } else {
                        p = l.leftRightDelim(e.value.left, a, r, t, e.mode)
                    }
                    h.unshift(p);
                    var c;
                    if (e.value.right === ".") {
                        c = m(t)
                    } else {
                        c = l.leftRightDelim(e.value.right, a, r, t, e.mode)
                    }
                    h.push(c);
                    return n(["minner", t.style.cls()], h, t.getColor())
                },
                rule: function(e, t, i) {
                    var h = n(["mord", "rule"], [], t.getColor());
                    var a = 0;
                    if (e.value.shift) {
                        a = e.value.shift.number;
                        if (e.value.shift.unit === "ex") {
                            a *= p.metrics.xHeight
                        }
                    }
                    var r = e.value.width.number;
                    if (e.value.width.unit === "ex") {
                        r *= p.metrics.xHeight
                    }
                    var l = e.value.height.number;
                    if (e.value.height.unit === "ex") {
                        l *= p.metrics.xHeight
                    }
                    a /= t.style.sizeMultiplier;
                    r /= t.style.sizeMultiplier;
                    l /= t.style.sizeMultiplier;
                    h.style.borderRightWidth = r + "em";
                    h.style.borderTopWidth = l + "em";
                    h.style.bottom = a + "em";
                    h.width = r;
                    h.height = l + a;
                    h.depth = -a;
                    return h
                },
                accent: function(e, t, i) {
                    var h = e.value.base;
                    var a;
                    if (e.type === "supsub") {
                        var l = e;
                        e = l.value.base;
                        h = e.value.base;
                        l.value.base = h;
                        a = v(l, t.reset(), i)
                    }
                    var s = v(h, t.withStyle(t.style.cramp()));
                    var c;
                    if (k(h)) {
                        var o = u(h);
                        var g = v(o, t.withStyle(t.style.cramp()));
                        c = g.skew
                    } else {
                        c = 0
                    }
                    var d = Math.min(s.height, p.metrics.xHeight);
                    var w = r.makeSymbol(e.value.accent, "Main-Regular", "math", t.getColor());
                    w.italic = 0;
                    var m = e.value.accent === "\\vec" ? "accent-vec" : null;
                    var f = n(["accent-body", m], [n([], [w])]);
                    f = r.makeVList([{
                        type: "elem",
                        elem: s
                    }, {
                        type: "kern",
                        size: -d
                    }, {
                        type: "elem",
                        elem: f
                    }], "firstBaseline", null, t);
                    f.children[1].style.marginLeft = 2 * c + "em";
                    var y = n(["mord", "accent"], [f]);
                    if (a) {
                        a.children[0] = y;
                        a.height = Math.max(y.height, a.height);
                        a.classes[0] = "mord";
                        return a
                    } else {
                        return y
                    }
                },
                phantom: function(e, t, i) {
                    var h = o(e.value.value, t.withPhantom(), i);
                    return new r.makeFragment(h)
                }
            };
            var v = function(e, t, i) {
                if (!e) {
                    return n()
                }
                if (f[e.type]) {
                    var a = f[e.type](e, t, i);
                    var l;
                    if (t.style !== t.parentStyle) {
                        l = t.style.sizeMultiplier / t.parentStyle.sizeMultiplier;
                        a.height *= l;
                        a.depth *= l
                    }
                    if (t.size !== t.parentSize) {
                        l = r.sizingMultiplier[t.size] / r.sizingMultiplier[t.parentSize];
                        a.height *= l;
                        a.depth *= l
                    }
                    return a
                } else {
                    throw new h("Got group of unknown type: '" + e.type + "'")
                }
            };
            var y = function(e, t) {
                e = JSON.parse(JSON.stringify(e));
                var i = o(e, t);
                var h = n(["base", t.style.cls()], i);
                var a = n(["strut"]);
                var r = n(["strut", "bottom"]);
                a.style.height = h.height + "em";
                r.style.height = h.height + h.depth + "em";
                r.style.verticalAlign = -h.depth + "em";
                var l = n(["katex-html"], [a, r, h]);
                l.setAttribute("aria-hidden", "true");
                return l
            };
            t.exports = y
        }, {
            "./ParseError": 5,
            "./Style": 8,
            "./buildCommon": 9,
            "./delimiter": 13,
            "./domTree": 14,
            "./fontMetrics": 16,
            "./utils": 23
        }],
        11: [function(e, t, i) {
            var h = e("./buildCommon");
            var a = e("./fontMetrics");
            var r = e("./mathMLTree");
            var l = e("./ParseError");
            var s = e("./symbols");
            var p = e("./utils");
            var c = h.makeSpan;
            var n = h.fontMap;
            var o = function(e, t) {
                if (s[t][e] && s[t][e].replace) {
                    e = s[t][e].replace
                }
                return new r.TextNode(e)
            };
            var g = function(e, t) {
                var i = t.font;
                if (!i) {
                    return null
                }
                var h = e.mode;
                if (i === "mathit") {
                    return "italic"
                }
                var r = e.value;
                if (p.contains(["\\imath", "\\jmath"], r)) {
                    return null
                }
                if (s[h][r] && s[h][r].replace) {
                    r = s[h][r].replace
                }
                var l = n[i].fontName;
                if (a.getCharacterMetrics(r, l)) {
                    return n[t.font].variant
                }
                return null
            };
            var d = {
                mathord: function(e, t) {
                    var i = new r.MathNode("mi", [o(e.value, e.mode)]);
                    var h = g(e, t);
                    if (h) {
                        i.setAttribute("mathvariant", h)
                    }
                    return i
                },
                textord: function(e, t) {
                    var i = o(e.value, e.mode);
                    var h = g(e, t) || "normal";
                    var a;
                    if (/[0-9]/.test(e.value)) {
                        a = new r.MathNode("mn", [i]);
                        if (t.font) {
                            a.setAttribute("mathvariant", h)
                        }
                    } else {
                        a = new r.MathNode("mi", [i]);
                        a.setAttribute("mathvariant", h)
                    }
                    return a
                },
                bin: function(e) {
                    var t = new r.MathNode("mo", [o(e.value, e.mode)]);
                    return t
                },
                rel: function(e) {
                    var t = new r.MathNode("mo", [o(e.value, e.mode)]);
                    return t
                },
                open: function(e) {
                    var t = new r.MathNode("mo", [o(e.value, e.mode)]);
                    return t
                },
                close: function(e) {
                    var t = new r.MathNode("mo", [o(e.value, e.mode)]);
                    return t
                },
                inner: function(e) {
                    var t = new r.MathNode("mo", [o(e.value, e.mode)]);
                    return t
                },
                punct: function(e) {
                    var t = new r.MathNode("mo", [o(e.value, e.mode)]);
                    t.setAttribute("separator", "true");
                    return t
                },
                ordgroup: function(e, t) {
                    var i = w(e.value, t);
                    var h = new r.MathNode("mrow", i);
                    return h
                },
                text: function(e, t) {
                    var i = w(e.value.body, t);
                    var h = new r.MathNode("mtext", i);
                    return h
                },
                color: function(e, t) {
                    var i = w(e.value.value, t);
                    var h = new r.MathNode("mstyle", i);
                    h.setAttribute("mathcolor", e.value.color);
                    return h
                },
                supsub: function(e, t) {
                    var i = [u(e.value.base, t)];
                    if (e.value.sub) {
                        i.push(u(e.value.sub, t))
                    }
                    if (e.value.sup) {
                        i.push(u(e.value.sup, t))
                    }
                    var h;
                    if (!e.value.sub) {
                        h = "msup"
                    } else if (!e.value.sup) {
                        h = "msub"
                    } else {
                        h = "msubsup"
                    }
                    var a = new r.MathNode(h, i);
                    return a
                },
                genfrac: function(e, t) {
                    var i = new r.MathNode("mfrac", [u(e.value.numer, t), u(e.value.denom, t)]);
                    if (!e.value.hasBarLine) {
                        i.setAttribute("linethickness", "0px")
                    }
                    if (e.value.leftDelim != null || e.value.rightDelim != null) {
                        var h = [];
                        if (e.value.leftDelim != null) {
                            var a = new r.MathNode("mo", [new r.TextNode(e.value.leftDelim)]);
                            a.setAttribute("fence", "true");
                            h.push(a)
                        }
                        h.push(i);
                        if (e.value.rightDelim != null) {
                            var l = new r.MathNode("mo", [new r.TextNode(e.value.rightDelim)]);
                            l.setAttribute("fence", "true");
                            h.push(l)
                        }
                        var s = new r.MathNode("mrow", h);
                        return s
                    }
                    return i
                },
                array: function(e, t) {
                    return new r.MathNode("mtable", e.value.body.map(function(e) {
                        return new r.MathNode("mtr", e.map(function(e) {
                            return new r.MathNode("mtd", [u(e, t)])
                        }))
                    }))
                },
                sqrt: function(e, t) {
                    var i;
                    if (e.value.index) {
                        i = new r.MathNode("mroot", [u(e.value.body, t), u(e.value.index, t)])
                    } else {
                        i = new r.MathNode("msqrt", [u(e.value.body, t)])
                    }
                    return i
                },
                leftright: function(e, t) {
                    var i = w(e.value.body, t);
                    if (e.value.left !== ".") {
                        var h = new r.MathNode("mo", [o(e.value.left, e.mode)]);
                        h.setAttribute("fence", "true");
                        i.unshift(h)
                    }
                    if (e.value.right !== ".") {
                        var a = new r.MathNode("mo", [o(e.value.right, e.mode)]);
                        a.setAttribute("fence", "true");
                        i.push(a)
                    }
                    var l = new r.MathNode("mrow", i);
                    return l
                },
                accent: function(e, t) {
                    var i = new r.MathNode("mo", [o(e.value.accent, e.mode)]);
                    var h = new r.MathNode("mover", [u(e.value.base, t), i]);
                    h.setAttribute("accent", "true");
                    return h
                },
                spacing: function(e) {
                    var t;
                    if (e.value === "\\ " || e.value === "\\space" || e.value === " " || e.value === "~") {
                        t = new r.MathNode("mtext", [new r.TextNode("\xa0")])
                    } else {
                        t = new r.MathNode("mspace");
                        t.setAttribute("width", h.spacingFunctions[e.value].size)
                    }
                    return t
                },
                op: function(e) {
                    var t;
                    if (e.value.symbol) {
                        t = new r.MathNode("mo", [o(e.value.body, e.mode)])
                    } else {
                        t = new r.MathNode("mi", [new r.TextNode(e.value.body.slice(1))])
                    }
                    return t
                },
                katex: function(e) {
                    var t = new r.MathNode("mtext", [new r.TextNode("KaTeX")]);
                    return t
                },
                font: function(e, t) {
                    var i = e.value.font;
                    return u(e.value.body, t.withFont(i))
                },
                delimsizing: function(e) {
                    var t = [];
                    if (e.value.value !== ".") {
                        t.push(o(e.value.value, e.mode))
                    }
                    var i = new r.MathNode("mo", t);
                    if (e.value.delimType === "open" || e.value.delimType === "close") {
                        i.setAttribute("fence", "true")
                    } else {
                        i.setAttribute("fence", "false")
                    }
                    return i
                },
                styling: function(e, t) {
                    var i = w(e.value.value, t);
                    var h = new r.MathNode("mstyle", i);
                    var a = {
                        display: ["0", "true"],
                        text: ["0", "false"],
                        script: ["1", "false"],
                        scriptscript: ["2", "false"]
                    };
                    var l = a[e.value.style];
                    h.setAttribute("scriptlevel", l[0]);
                    h.setAttribute("displaystyle", l[1]);
                    return h
                },
                sizing: function(e, t) {
                    var i = w(e.value.value, t);
                    var a = new r.MathNode("mstyle", i);
                    a.setAttribute("mathsize", h.sizingMultiplier[e.value.size] + "em");
                    return a
                },
                overline: function(e, t) {
                    var i = new r.MathNode("mo", [new r.TextNode("\u203e")]);
                    i.setAttribute("stretchy", "true");
                    var h = new r.MathNode("mover", [u(e.value.body, t), i]);
                    h.setAttribute("accent", "true");
                    return h
                },
                rule: function(e) {
                    var t = new r.MathNode("mrow");
                    return t
                },
                llap: function(e, t) {
                    var i = new r.MathNode("mpadded", [u(e.value.body, t)]);
                    i.setAttribute("lspace", "-1width");
                    i.setAttribute("width", "0px");
                    return i
                },
                rlap: function(e, t) {
                    var i = new r.MathNode("mpadded", [u(e.value.body, t)]);
                    i.setAttribute("width", "0px");
                    return i
                },
                phantom: function(e, t, i) {
                    var h = w(e.value.value, t);
                    return new r.MathNode("mphantom", h)
                }
            };
            var w = function(e, t) {
                var i = [];
                for (var h = 0; h < e.length; h++) {
                    var a = e[h];
                    i.push(u(a, t))
                }
                return i
            };
            var u = function(e, t) {
                if (!e) {
                    return new r.MathNode("mrow")
                }
                if (d[e.type]) {
                    return d[e.type](e, t)
                } else {
                    throw new l("Got group of unknown type: '" + e.type + "'")
                }
            };
            var k = function(e, t, i) {
                var h = w(e, i);
                var a = new r.MathNode("mrow", h);
                var l = new r.MathNode("annotation", [new r.TextNode(t)]);
                l.setAttribute("encoding", "application/x-tex");
                var s = new r.MathNode("semantics", [a, l]);
                var p = new r.MathNode("math", [s]);
                return c(["katex-mathml"], [p])
            };
            t.exports = k
        }, {
            "./ParseError": 5,
            "./buildCommon": 9,
            "./fontMetrics": 16,
            "./mathMLTree": 19,
            "./symbols": 22,
            "./utils": 23
        }],
        12: [function(e, t, i) {
            var h = e("./buildHTML");
            var a = e("./buildMathML");
            var r = e("./buildCommon");
            var l = e("./Options");
            var s = e("./Settings");
            var p = e("./Style");
            var c = r.makeSpan;
            var n = function(e, t, i) {
                i = i || new s({});
                var r = p.TEXT;
                if (i.displayMode) {
                    r = p.DISPLAY
                }
                var n = new l({
                    style: r,
                    size: "size5"
                });
                var o = a(e, t, n);
                var g = h(e, n);
                var d = c(["katex"], [o, g]);
                if (i.displayMode) {
                    return c(["katex-display"], [d])
                } else {
                    return d
                }
            };
            t.exports = n
        }, {
            "./Options": 4,
            "./Settings": 7,
            "./Style": 8,
            "./buildCommon": 9,
            "./buildHTML": 10,
            "./buildMathML": 11
        }],
        13: [function(e, t, i) {
            var h = e("./ParseError");
            var a = e("./Style");
            var r = e("./buildCommon");
            var l = e("./fontMetrics");
            var s = e("./symbols");
            var p = e("./utils");
            var c = r.makeSpan;
            var n = function(e, t) {
                if (s.math[e] && s.math[e].replace) {
                    return l.getCharacterMetrics(s.math[e].replace, t)
                } else {
                    return l.getCharacterMetrics(e, t)
                }
            };
            var o = function(e, t, i) {
                return r.makeSymbol(e, "Size" + t + "-Regular", i)
            };
            var g = function(e, t, i) {
                var h = c(["style-wrap", i.style.reset(), t.cls()], [e]);
                var a = t.sizeMultiplier / i.style.sizeMultiplier;
                h.height *= a;
                h.depth *= a;
                h.maxFontSize = t.sizeMultiplier;
                return h
            };
            var d = function(e, t, i, h, a) {
                var s = r.makeSymbol(e, "Main-Regular", a);
                var p = g(s, t, h);
                if (i) {
                    var c = (1 - h.style.sizeMultiplier / t.sizeMultiplier) * l.metrics.axisHeight;
                    p.style.top = c + "em";
                    p.height -= c;
                    p.depth += c
                }
                return p
            };
            var w = function(e, t, i, h, r) {
                var s = o(e, t, r);
                var p = g(c(["delimsizing", "size" + t], [s], h.getColor()), a.TEXT, h);
                if (i) {
                    var n = (1 - h.style.sizeMultiplier) * l.metrics.axisHeight;
                    p.style.top = n + "em";
                    p.height -= n;
                    p.depth += n
                }
                return p
            };
            var u = function(e, t, i) {
                var h;
                if (t === "Size1-Regular") {
                    h = "delim-size1"
                } else if (t === "Size4-Regular") {
                    h = "delim-size4"
                }
                var a = c(["delimsizinginner", h], [c([], [r.makeSymbol(e, t, i)])]);
                return {
                    type: "elem",
                    elem: a
                }
            };
            var k = function(e, t, i, h, s) {
                var p, o, d, w;
                p = d = w = e;
                o = null;
                var k = "Size1-Regular";
                if (e === "\\uparrow") {
                    d = w = "\u23d0"
                } else if (e === "\\Uparrow") {
                    d = w = "\u2016"
                } else if (e === "\\downarrow") {
                    p = d = "\u23d0"
                } else if (e === "\\Downarrow") {
                    p = d = "\u2016"
                } else if (e === "\\updownarrow") {
                    p = "\\uparrow";
                    d = "\u23d0";
                    w = "\\downarrow"
                } else if (e === "\\Updownarrow") {
                    p = "\\Uparrow";
                    d = "\u2016";
                    w = "\\Downarrow"
                } else if (e === "[" || e === "\\lbrack") {
                    p = "\u23a1";
                    d = "\u23a2";
                    w = "\u23a3";
                    k = "Size4-Regular"
                } else if (e === "]" || e === "\\rbrack") {
                    p = "\u23a4";
                    d = "\u23a5";
                    w = "\u23a6";
                    k = "Size4-Regular"
                } else if (e === "\\lfloor") {
                    d = p = "\u23a2";
                    w = "\u23a3";
                    k = "Size4-Regular"
                } else if (e === "\\lceil") {
                    p = "\u23a1";
                    d = w = "\u23a2";
                    k = "Size4-Regular"
                } else if (e === "\\rfloor") {
                    d = p = "\u23a5";
                    w = "\u23a6";
                    k = "Size4-Regular"
                } else if (e === "\\rceil") {
                    p = "\u23a4";
                    d = w = "\u23a5";
                    k = "Size4-Regular"
                } else if (e === "(") {
                    p = "\u239b";
                    d = "\u239c";
                    w = "\u239d";
                    k = "Size4-Regular"
                } else if (e === ")") {
                    p = "\u239e";
                    d = "\u239f";
                    w = "\u23a0";
                    k = "Size4-Regular"
                } else if (e === "\\{" || e === "\\lbrace") {
                    p = "\u23a7";
                    o = "\u23a8";
                    w = "\u23a9";
                    d = "\u23aa";
                    k = "Size4-Regular"
                } else if (e === "\\}" || e === "\\rbrace") {
                    p = "\u23ab";
                    o = "\u23ac";
                    w = "\u23ad";
                    d = "\u23aa";
                    k = "Size4-Regular"
                } else if (e === "\\lgroup") {
                    p = "\u23a7";
                    w = "\u23a9";
                    d = "\u23aa";
                    k = "Size4-Regular"
                } else if (e === "\\rgroup") {
                    p = "\u23ab";
                    w = "\u23ad";
                    d = "\u23aa";
                    k = "Size4-Regular"
                } else if (e === "\\lmoustache") {
                    p = "\u23a7";
                    w = "\u23ad";
                    d = "\u23aa";
                    k = "Size4-Regular"
                } else if (e === "\\rmoustache") {
                    p = "\u23ab";
                    w = "\u23a9";
                    d = "\u23aa";
                    k = "Size4-Regular"
                } else if (e === "\\surd") {
                    p = "\ue001";
                    w = "\u23b7";
                    d = "\ue000";
                    k = "Size4-Regular"
                }
                var m = n(p, k);
                var f = m.height + m.depth;
                var v = n(d, k);
                var y = v.height + v.depth;
                var x = n(w, k);
                var b = x.height + x.depth;
                var z = 0;
                var S = 1;
                if (o !== null) {
                    var M = n(o, k);
                    z = M.height + M.depth;
                    S = 2
                }
                var q = f + b + z;
                var A = Math.ceil((t - q) / (S * y));
                var T = q + A * S * y;
                var N = l.metrics.axisHeight;
                if (i) {
                    N *= h.style.sizeMultiplier
                }
                var C = T / 2 - N;
                var R = [];
                R.push(u(w, k, s));
                var E;
                if (o === null) {
                    for (E = 0; E < A; E++) {
                        R.push(u(d, k, s))
                    }
                } else {
                    for (E = 0; E < A; E++) {
                        R.push(u(d, k, s))
                    }
                    R.push(u(o, k, s));
                    for (E = 0; E < A; E++) {
                        R.push(u(d, k, s))
                    }
                }
                R.push(u(p, k, s));
                var P = r.makeVList(R, "bottom", C, h);
                return g(c(["delimsizing", "mult"], [P], h.getColor()), a.TEXT, h)
            };
            var m = ["(", ")", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\\lceil", "\\rceil", "\\surd"];
            var f = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache"];
            var v = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash"];
            var y = [0, 1.2, 1.8, 2.4, 3];
            var x = function(e, t, i, a) {
                if (e === "<") {
                    e = "\\langle"
                } else if (e === ">") {
                    e = "\\rangle"
                }
                if (p.contains(m, e) || p.contains(v, e)) {
                    return w(e, t, false, i, a)
                } else if (p.contains(f, e)) {
                    return k(e, y[t], false, i, a)
                } else {
                    throw new h("Illegal delimiter: '" + e + "'")
                }
            };
            var b = [{
                type: "small",
                style: a.SCRIPTSCRIPT
            }, {
                type: "small",
                style: a.SCRIPT
            }, {
                type: "small",
                style: a.TEXT
            }, {
                type: "large",
                size: 1
            }, {
                type: "large",
                size: 2
            }, {
                type: "large",
                size: 3
            }, {
                type: "large",
                size: 4
            }];
            var z = [{
                type: "small",
                style: a.SCRIPTSCRIPT
            }, {
                type: "small",
                style: a.SCRIPT
            }, {
                type: "small",
                style: a.TEXT
            }, {
                type: "stack"
            }];
            var S = [{
                type: "small",
                style: a.SCRIPTSCRIPT
            }, {
                type: "small",
                style: a.SCRIPT
            }, {
                type: "small",
                style: a.TEXT
            }, {
                type: "large",
                size: 1
            }, {
                type: "large",
                size: 2
            }, {
                type: "large",
                size: 3
            }, {
                type: "large",
                size: 4
            }, {
                type: "stack"
            }];
            var M = function(e) {
                if (e.type === "small") {
                    return "Main-Regular"
                } else if (e.type === "large") {
                    return "Size" + e.size + "-Regular"
                } else if (e.type === "stack") {
                    return "Size4-Regular"
                }
            };
            var q = function(e, t, i, h) {
                var a = Math.min(2, 3 - h.style.size);
                for (var r = a; r < i.length; r++) {
                    if (i[r].type === "stack") {
                        break
                    }
                    var l = n(e, M(i[r]));
                    var s = l.height + l.depth;
                    if (i[r].type === "small") {
                        s *= i[r].style.sizeMultiplier
                    }
                    if (s > t) {
                        return i[r]
                    }
                }
                return i[i.length - 1]
            };
            var A = function(e, t, i, h, a) {
                if (e === "<") {
                    e = "\\langle"
                } else if (e === ">") {
                    e = "\\rangle"
                }
                var r;
                if (p.contains(v, e)) {
                    r = b
                } else if (p.contains(m, e)) {
                    r = S
                } else {
                    r = z
                }
                var l = q(e, t, r, h);
                if (l.type === "small") {
                    return d(e, l.style, i, h, a)
                } else if (l.type === "large") {
                    return w(e, l.size, i, h, a)
                } else if (l.type === "stack") {
                    return k(e, t, i, h, a)
                }
            };
            var T = function(e, t, i, h, a) {
                var r = l.metrics.axisHeight * h.style.sizeMultiplier;
                var s = 901;
                var p = 5 / l.metrics.ptPerEm;
                var c = Math.max(t - r, i + r);
                var n = Math.max(c / 500 * s, 2 * c - p);
                return A(e, n, true, h, a)
            };
            t.exports = {
                sizedDelim: x,
                customSizedDelim: A,
                leftRightDelim: T
            }
        }, {
            "./ParseError": 5,
            "./Style": 8,
            "./buildCommon": 9,
            "./fontMetrics": 16,
            "./symbols": 22,
            "./utils": 23
        }],
        14: [function(e, t, i) {
            var h = e("./utils");
            var a = function(e) {
                e = e.slice();
                for (var t = e.length - 1; t >= 0; t--) {
                    if (!e[t]) {
                        e.splice(t, 1)
                    }
                }
                return e.join(" ")
            };

            function r(e, t, i, h, a, r) {
                this.classes = e || [];
                this.children = t || [];
                this.height = i || 0;
                this.depth = h || 0;
                this.maxFontSize = a || 0;
                this.style = r || {};
                this.attributes = {}
            }
            r.prototype.setAttribute = function(e, t) {
                this.attributes[e] = t
            };
            r.prototype.toNode = function() {
                var e = document.createElement("span");
                e.className = a(this.classes);
                for (var t in this.style) {
                    if (Object.prototype.hasOwnProperty.call(this.style, t)) {
                        e.style[t] = this.style[t]
                    }
                }
                for (var i in this.attributes) {
                    if (Object.prototype.hasOwnProperty.call(this.attributes, i)) {
                        e.setAttribute(i, this.attributes[i])
                    }
                }
                for (var h = 0; h < this.children.length; h++) {
                    e.appendChild(this.children[h].toNode())
                }
                return e
            };
            r.prototype.toMarkup = function() {
                var e = "<span";
                if (this.classes.length) {
                    e += ' class="';
                    e += h.escape(a(this.classes));
                    e += '"'
                }
                var t = "";
                for (var i in this.style) {
                    if (this.style.hasOwnProperty(i)) {
                        t += h.hyphenate(i) + ":" + this.style[i] + ";"
                    }
                }
                if (t) {
                    e += ' style="' + h.escape(t) + '"'
                }
                for (var r in this.attributes) {
                    if (Object.prototype.hasOwnProperty.call(this.attributes, r)) {
                        e += " " + r + '="';
                        e += h.escape(this.attributes[r]);
                        e += '"'
                    }
                }
                e += ">";
                for (var l = 0; l < this.children.length; l++) {
                    e += this.children[l].toMarkup()
                }
                e += "</span>";
                return e
            };

            function l(e, t, i, h) {
                this.children = e || [];
                this.height = t || 0;
                this.depth = i || 0;
                this.maxFontSize = h || 0
            }
            l.prototype.toNode = function() {
                var e = document.createDocumentFragment();
                for (var t = 0; t < this.children.length; t++) {
                    e.appendChild(this.children[t].toNode())
                }
                return e
            };
            l.prototype.toMarkup = function() {
                var e = "";
                for (var t = 0; t < this.children.length; t++) {
                    e += this.children[t].toMarkup()
                }
                return e
            };

            function s(e, t, i, h, a, r, l) {
                this.value = e || "";
                this.height = t || 0;
                this.depth = i || 0;
                this.italic = h || 0;
                this.skew = a || 0;
                this.classes = r || [];
                this.style = l || {};
                this.maxFontSize = 0
            }
            s.prototype.toNode = function() {
                var e = document.createTextNode(this.value);
                var t = null;
                if (this.italic > 0) {
                    t = document.createElement("span");
                    t.style.marginRight = this.italic + "em"
                }
                if (this.classes.length > 0) {
                    t = t || document.createElement("span");
                    t.className = a(this.classes)
                }
                for (var i in this.style) {
                    if (this.style.hasOwnProperty(i)) {
                        t = t || document.createElement("span");
                        t.style[i] = this.style[i]
                    }
                }
                if (t) {
                    t.appendChild(e);
                    return t
                } else {
                    return e
                }
            };
            s.prototype.toMarkup = function() {
                var e = false;
                var t = "<span";
                if (this.classes.length) {
                    e = true;
                    t += ' class="';
                    t += h.escape(a(this.classes));
                    t += '"'
                }
                var i = "";
                if (this.italic > 0) {
                    i += "margin-right:" + this.italic + "em;"
                }
                for (var r in this.style) {
                    if (this.style.hasOwnProperty(r)) {
                        i += h.hyphenate(r) + ":" + this.style[r] + ";"
                    }
                }
                if (i) {
                    e = true;
                    t += ' style="' + h.escape(i) + '"'
                }
                var l = h.escape(this.value);
                if (e) {
                    t += ">";
                    t += l;
                    t += "</span>";
                    return t
                } else {
                    return l
                }
            };
            t.exports = {
                span: r,
                documentFragment: l,
                symbolNode: s
            }
        }, {
            "./utils": 23
        }],
        15: [function(e, t, i) {
            var h = e("./fontMetrics");
            var a = e("./parseData");
            var r = e("./ParseError");
            var l = a.ParseNode;
            var s = a.ParseResult;

            function p(e, t, i, h) {
                var a = [],
                    p = [a],
                    c = [];
                while (true) {
                    var n = e.parseExpression(t, i, false, null);
                    a.push(new l("ordgroup", n.result, i));
                    t = n.position;
                    var o = n.peek.text;
                    if (o === "&") {
                        t = n.peek.position
                    } else if (o === "\\end") {
                        break
                    } else if (o === "\\\\" || o === "\\cr") {
                        var g = e.parseFunction(t, i);
                        c.push(g.result.value.size);
                        t = g.position;
                        a = [];
                        p.push(a)
                    } else {
                        throw new r("Expected & or \\\\ or \\end", e.lexer, n.peek.position)
                    }
                }
                h.body = p;
                h.rowGaps = c;
                return new s(new l(h.type, h, i), t)
            }
            var c = [{
                names: ["array"],
                numArgs: 1,
                handler: function(e, t, i, h, a) {
                    var l = this;
                    h = h.value.map ? h.value : [h];
                    var s = h.map(function(e) {
                        var t = e.value;
                        if ("lcr".indexOf(t) !== -1) {
                            return {
                                type: "align",
                                align: t
                            }
                        } else if (t === "|") {
                            return {
                                type: "separator",
                                separator: "|"
                            }
                        }
                        throw new r("Unknown column alignment: " + e.value, l.lexer, a[1])
                    });
                    var c = {
                        type: "array",
                        cols: s,
                        hskipBeforeAndAfter: true
                    };
                    c = p(l, e, t, c);
                    return c
                }
            }, {
                names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix"],
                handler: function(e, t, i) {
                    var h = {
                        matrix: null,
                        pmatrix: ["(", ")"],
                        bmatrix: ["[", "]"],
                        Bmatrix: ["\\{", "\\}"],
                        vmatrix: ["|", "|"],
                        Vmatrix: ["\\Vert", "\\Vert"]
                    } [i];
                    var a = {
                        type: "array",
                        hskipBeforeAndAfter: false
                    };
                    a = p(this, e, t, a);
                    if (h) {
                        a.result = new l("leftright", {
                            body: [a.result],
                            left: h[0],
                            right: h[1]
                        }, t)
                    }
                    return a
                }
            }, {
                names: ["cases"],
                handler: function(e, t, i) {
                    var a = {
                        type: "array",
                        arraystretch: 1.2,
                        cols: [{
                            type: "align",
                            align: "l",
                            pregap: 0,
                            postgap: h.metrics.quad
                        }, {
                            type: "align",
                            align: "l",
                            pregap: 0,
                            postgap: 0
                        }]
                    };
                    a = p(this, e, t, a);
                    a.result = new l("leftright", {
                        body: [a.result],
                        left: "\\{",
                        right: "."
                    }, t);
                    return a
                }
            }];
            t.exports = function() {
                var e = {};
                for (var t = 0; t < c.length; ++t) {
                    var i = c[t];
                    i.greediness = 1;
                    i.allowedInText = !!i.allowedInText;
                    i.numArgs = i.numArgs || 0;
                    i.numOptionalArgs = i.numOptionalArgs || 0;
                    for (var h = 0; h < i.names.length; ++h) {
                        e[i.names[h]] = i
                    }
                }
                return e
            }()
        }, {
            "./ParseError": 5,
            "./fontMetrics": 16,
            "./parseData": 20
        }],
        16: [function(e, t, i) {
            var h = e("./Style");
            var a = .025;
            var r = 0;
            var l = 0;
            var s = 0;
            var p = .431;
            var c = 1;
            var n = 0;
            var o = .677;
            var g = .394;
            var d = .444;
            var w = .686;
            var u = .345;
            var k = .413;
            var m = .363;
            var f = .289;
            var v = .15;
            var y = .247;
            var x = .386;
            var b = .05;
            var z = 2.39;
            var S = 1.01;
            var M = .81;
            var q = .71;
            var A = .25;
            var T = 0;
            var N = 0;
            var C = 0;
            var R = 0;
            var E = .431;
            var P = 1;
            var D = 0;
            var L = .04;
            var O = .111;
            var I = .166;
            var B = .2;
            var F = .6;
            var _ = .1;
            var V = 10;
            var G = 2 / V;
            var H = {
                xHeight: p,
                quad: c,
                num1: o,
                num2: g,
                num3: d,
                denom1: w,
                denom2: u,
                sup1: k,
                sup2: m,
                sup3: f,
                sub1: v,
                sub2: y,
                supDrop: x,
                subDrop: b,
                axisHeight: A,
                defaultRuleThickness: L,
                bigOpSpacing1: O,
                bigOpSpacing2: I,
                bigOpSpacing3: B,
                bigOpSpacing4: F,
                bigOpSpacing5: _,
                ptPerEm: V,
                emPerEx: p / c,
                doubleRuleSep: G,
                delim1: z,
                getDelim2: function(e) {
                    if (e.size === h.TEXT.size) {
                        return S
                    } else if (e.size === h.SCRIPT.size) {
                        return M
                    } else if (e.size === h.SCRIPTSCRIPT.size) {
                        return q
                    }
                    throw new Error("Unexpected style size: " + e.size)
                }
            };
            var X = e("./fontMetricsData");
            var U = function(e, t) {
                return X[t][e.charCodeAt(0)]
            };
            t.exports = {
                metrics: H,
                getCharacterMetrics: U
            }
        }, {
            "./Style": 8,
            "./fontMetricsData": 17
        }],
        17: [function(e, t, i) {
            t.exports = {
                "AMS-Regular": {
                    65: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .16667,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    165: {
                        depth: 0,
                        height: .675,
                        italic: .025,
                        skew: 0
                    },
                    174: {
                        depth: .15559,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    240: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    295: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    989: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    1008: {
                        depth: 0,
                        height: .43056,
                        italic: .04028,
                        skew: 0
                    },
                    8245: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8487: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8498: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8502: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8503: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8504: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8513: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8602: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8603: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8606: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8608: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8610: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8611: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8619: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8620: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8621: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8622: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8624: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8625: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8630: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8631: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8634: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8635: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8638: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8639: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8642: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8643: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8644: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8646: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8647: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8648: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8649: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8650: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8651: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8652: {
                        depth: .01354,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8653: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8654: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8655: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8666: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8667: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8669: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8672: {
                        depth: -.064,
                        height: .437,
                        italic: 0,
                        skew: 0
                    },
                    8674: {
                        depth: -.064,
                        height: .437,
                        italic: 0,
                        skew: 0
                    },
                    8705: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    8708: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8717: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8724: {
                        depth: .08198,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8737: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8738: {
                        depth: .03517,
                        height: .52239,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8740: {
                        depth: .25142,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8742: {
                        depth: .25142,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8756: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8757: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8764: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8765: {
                        depth: -.13313,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    8769: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8770: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8774: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: -.01688,
                        height: .48312,
                        italic: 0,
                        skew: 0
                    },
                    8778: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8782: {
                        depth: .06062,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8783: {
                        depth: .06062,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8785: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8786: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8787: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8790: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8791: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8796: {
                        depth: .08198,
                        height: .91667,
                        italic: 0,
                        skew: 0
                    },
                    8806: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8807: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8808: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    8809: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    8812: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    8814: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8815: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8816: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8817: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8818: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8819: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8822: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8823: {
                        depth: .1808,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8828: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8829: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8830: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8831: {
                        depth: .22958,
                        height: .72958,
                        italic: 0,
                        skew: 0
                    },
                    8832: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8833: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8840: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8841: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8842: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8843: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8847: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8848: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8858: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8859: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8861: {
                        depth: .08198,
                        height: .58198,
                        italic: 0,
                        skew: 0
                    },
                    8862: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8863: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8864: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8865: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    8872: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8873: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8874: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8876: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8877: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8878: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8879: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8882: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8883: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8884: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8885: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8888: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8890: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8891: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8892: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8903: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8905: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8906: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    8907: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8908: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8909: {
                        depth: -.03598,
                        height: .46402,
                        italic: 0,
                        skew: 0
                    },
                    8910: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8911: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8912: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8913: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8914: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8915: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8916: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8918: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8919: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8920: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8921: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    8922: {
                        depth: .38569,
                        height: .88569,
                        italic: 0,
                        skew: 0
                    },
                    8923: {
                        depth: .38569,
                        height: .88569,
                        italic: 0,
                        skew: 0
                    },
                    8926: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8927: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    8928: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8929: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8934: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8935: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8936: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8937: {
                        depth: .23222,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    8938: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8939: {
                        depth: .20576,
                        height: .70576,
                        italic: 0,
                        skew: 0
                    },
                    8940: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8941: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9416: {
                        depth: .15559,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9484: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9488: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9492: {
                        depth: 0,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    9496: {
                        depth: 0,
                        height: .37788,
                        italic: 0,
                        skew: 0
                    },
                    9585: {
                        depth: .19444,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    9586: {
                        depth: .19444,
                        height: .74111,
                        italic: 0,
                        skew: 0
                    },
                    9632: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    9633: {
                        depth: 0,
                        height: .675,
                        italic: 0,
                        skew: 0
                    },
                    9650: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9654: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9660: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: 0,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9664: {
                        depth: .03517,
                        height: .54986,
                        italic: 0,
                        skew: 0
                    },
                    9674: {
                        depth: .11111,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    9733: {
                        depth: .19444,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10003: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10016: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10731: {
                        depth: .11111,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    10846: {
                        depth: .19444,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10877: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10878: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10885: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10886: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10887: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10888: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10889: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10890: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10891: {
                        depth: .48256,
                        height: .98256,
                        italic: 0,
                        skew: 0
                    },
                    10892: {
                        depth: .48256,
                        height: .98256,
                        italic: 0,
                        skew: 0
                    },
                    10901: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10902: {
                        depth: .13667,
                        height: .63667,
                        italic: 0,
                        skew: 0
                    },
                    10933: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10934: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10935: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10936: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10937: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10938: {
                        depth: .26167,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    10949: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10950: {
                        depth: .25583,
                        height: .75583,
                        italic: 0,
                        skew: 0
                    },
                    10955: {
                        depth: .28481,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    10956: {
                        depth: .28481,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57350: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57351: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57352: {
                        depth: .08167,
                        height: .58167,
                        italic: 0,
                        skew: 0
                    },
                    57353: {
                        depth: 0,
                        height: .43056,
                        italic: .04028,
                        skew: 0
                    },
                    57356: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57357: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57358: {
                        depth: .41951,
                        height: .91951,
                        italic: 0,
                        skew: 0
                    },
                    57359: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57360: {
                        depth: .30274,
                        height: .79383,
                        italic: 0,
                        skew: 0
                    },
                    57361: {
                        depth: .41951,
                        height: .91951,
                        italic: 0,
                        skew: 0
                    },
                    57366: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57367: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57368: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57369: {
                        depth: .25142,
                        height: .75726,
                        italic: 0,
                        skew: 0
                    },
                    57370: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    57371: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    }
                },
                "Caligraphic-Regular": {
                    48: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .19445
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .03041,
                        skew: .13889
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .05834,
                        skew: .13889
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .08944,
                        skew: .11111
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .09931,
                        skew: .11111
                    },
                    71: {
                        depth: .09722,
                        height: .68333,
                        italic: .0593,
                        skew: .11111
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .00965,
                        skew: .11111
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07382,
                        skew: 0
                    },
                    74: {
                        depth: .09722,
                        height: .68333,
                        italic: .18472,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .01445,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .14736,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .11111
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .08222,
                        skew: .08334
                    },
                    81: {
                        depth: .09722,
                        height: .68333,
                        italic: 0,
                        skew: .11111
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .075,
                        skew: .13889
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .25417,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .09931,
                        skew: .08334
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .08222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .08222,
                        skew: .08334
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .14643,
                        skew: .13889
                    },
                    89: {
                        depth: .09722,
                        height: .68333,
                        italic: .08222,
                        skew: .08334
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07944,
                        skew: .13889
                    }
                },
                "Fraktur-Regular": {
                    33: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .08319,
                        height: .58283,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: 0,
                        height: .10803,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: .08319,
                        height: .58283,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10803,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .12604,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.13099,
                        height: .36866,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: .12604,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: .06302,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: .12604,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .03781,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: .12604,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .24982,
                        height: .74947,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    103: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    104: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .18906,
                        height: .52396,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .52396,
                        italic: 0,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .52396,
                        italic: 0,
                        skew: 0
                    },
                    120: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    122: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58112: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    58113: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    58114: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58115: {
                        depth: .18906,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58116: {
                        depth: .18906,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    },
                    58117: {
                        depth: 0,
                        height: .69141,
                        italic: 0,
                        skew: 0
                    },
                    58118: {
                        depth: 0,
                        height: .62119,
                        italic: 0,
                        skew: 0
                    },
                    58119: {
                        depth: 0,
                        height: .47534,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Bold": {
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .15556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .15556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68611,
                        italic: .01597,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68611,
                        italic: .01597,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68611,
                        italic: .02875,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .13444,
                        italic: .03194,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .10903,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .63492,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .01597,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .34444,
                        italic: 0,
                        skew: 0
                    },
                    168: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    172: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    175: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    176: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    177: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    180: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    215: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    247: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    711: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    713: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    714: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    715: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    728: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    729: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    730: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .59611,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    824: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8224: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8225: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8407: {
                        depth: 0,
                        height: .72444,
                        italic: .15486,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8465: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8467: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8472: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8476: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8501: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8596: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8597: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8598: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8599: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8600: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8601: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8636: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8637: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8640: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8641: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8656: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8658: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8660: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8661: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8704: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8706: {
                        depth: 0,
                        height: .69444,
                        italic: .06389,
                        skew: 0
                    },
                    8707: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8711: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    8712: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8715: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8723: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8725: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8727: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    8728: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8729: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .18,
                        height: .82,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8734: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8743: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8744: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8745: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8746: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .19444,
                        height: .69444,
                        italic: .12778,
                        skew: 0
                    },
                    8764: {
                        depth: -.10889,
                        height: .39111,
                        italic: 0,
                        skew: 0
                    },
                    8768: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8771: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: .02444,
                        height: .52444,
                        italic: 0,
                        skew: 0
                    },
                    8781: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8801: {
                        depth: .00222,
                        height: .50222,
                        italic: 0,
                        skew: 0
                    },
                    8804: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8805: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8810: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8811: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8826: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8827: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8834: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8835: {
                        depth: .08556,
                        height: .58556,
                        italic: 0,
                        skew: 0
                    },
                    8838: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8839: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8846: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8849: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8850: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    8851: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8852: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8853: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8854: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8855: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8856: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8857: {
                        depth: .13333,
                        height: .63333,
                        italic: 0,
                        skew: 0
                    },
                    8866: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8867: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8868: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8869: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8900: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: -.02639,
                        height: .47361,
                        italic: 0,
                        skew: 0
                    },
                    8902: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: -.13889,
                        height: .36111,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: -.13889,
                        height: .36111,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9657: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9667: {
                        depth: -.02778,
                        height: .47222,
                        italic: 0,
                        skew: 0
                    },
                    9711: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9824: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9825: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9826: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9827: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9837: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    9838: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9839: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10815: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    10927: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    },
                    10928: {
                        depth: .19667,
                        height: .69667,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Italic": {
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: .06961,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: .06616,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: .13639,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: .09694,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: .16194,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: .03694,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: .14917,
                        skew: 0
                    },
                    43: {
                        depth: .05667,
                        height: .56167,
                        italic: .03694,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .43056,
                        italic: .02826,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: .16194,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    52: {
                        depth: .19444,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    55: {
                        depth: .19444,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: .13556,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: .0582,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .43056,
                        italic: .0582,
                        skew: 0
                    },
                    61: {
                        depth: -.13313,
                        height: .36687,
                        italic: .06616,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: .1225,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: .09597,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .12028,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: .08722,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .15806,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .14028,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .03868,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .11972,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .18361,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .18361,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .15806,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .19383,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .14528,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: .1875,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: .10528,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: .06646,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .12056,
                        italic: .09208,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: .06312,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: .05653,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: .10333,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: .07514,
                        skew: 0
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .21194,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: .07671,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65536,
                        italic: .1019,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65536,
                        italic: .14467,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .10764,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .10333,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: .06312,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: .06312,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: .08208,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: .09486,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: .07671,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .10764,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: .12042,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .08847,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .12292,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .31786,
                        italic: .11585,
                        skew: 0
                    },
                    163: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    567: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: .09694,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: .06646,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .66786,
                        italic: .11585,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56167,
                        italic: .10333,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: .10806,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .66786,
                        italic: .11752,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .66786,
                        italic: .10474,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: .1225,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .62847,
                        italic: .08295,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13305,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .09403,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .15294,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .16389,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .12028,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .11111,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: .05986,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11111,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .10257,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .43056,
                        italic: .09208,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .43056,
                        italic: .09208,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: .12417,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: .1685,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: .06961,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    }
                },
                "Main-Regular": {
                    32: {
                        depth: 0,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .19444,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .10556,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .64444,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .01389,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .01389,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .025,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .31,
                        height: .12056,
                        italic: .02778,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .07778,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .01389,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .31786,
                        italic: 0,
                        skew: 0
                    },
                    160: {
                        depth: 0,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    168: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    172: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    175: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    176: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    177: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    180: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    215: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    247: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    711: {
                        depth: 0,
                        height: .62847,
                        italic: 0,
                        skew: 0
                    },
                    713: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    714: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    715: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    728: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    729: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    730: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56778,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .66786,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .62847,
                        italic: 0,
                        skew: 0
                    },
                    824: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8224: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8225: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8230: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8407: {
                        depth: 0,
                        height: .71444,
                        italic: .15382,
                        skew: 0
                    },
                    8463: {
                        depth: 0,
                        height: .68889,
                        italic: 0,
                        skew: 0
                    },
                    8465: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8467: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .11111
                    },
                    8472: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .11111
                    },
                    8476: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8501: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8592: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8594: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8596: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8597: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8598: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8599: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8600: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8601: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8614: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    8617: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    8618: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    8636: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8637: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8640: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8641: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8652: {
                        depth: .011,
                        height: .671,
                        italic: 0,
                        skew: 0
                    },
                    8656: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8658: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8660: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8661: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8704: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8706: {
                        depth: 0,
                        height: .69444,
                        italic: .05556,
                        skew: .08334
                    },
                    8707: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8709: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8711: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    8712: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8715: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8722: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8723: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8725: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8726: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8727: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    8728: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8729: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .2,
                        height: .8,
                        italic: 0,
                        skew: 0
                    },
                    8733: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8734: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    8736: {
                        depth: 0,
                        height: .69224,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8743: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8744: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8745: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8746: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .19444,
                        height: .69444,
                        italic: .11111,
                        skew: 0
                    },
                    8764: {
                        depth: -.13313,
                        height: .36687,
                        italic: 0,
                        skew: 0
                    },
                    8768: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8771: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8773: {
                        depth: -.022,
                        height: .589,
                        italic: 0,
                        skew: 0
                    },
                    8776: {
                        depth: -.01688,
                        height: .48312,
                        italic: 0,
                        skew: 0
                    },
                    8781: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8784: {
                        depth: -.133,
                        height: .67,
                        italic: 0,
                        skew: 0
                    },
                    8800: {
                        depth: .215,
                        height: .716,
                        italic: 0,
                        skew: 0
                    },
                    8801: {
                        depth: -.03625,
                        height: .46375,
                        italic: 0,
                        skew: 0
                    },
                    8804: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8805: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8810: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8811: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8826: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8827: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8834: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8835: {
                        depth: .0391,
                        height: .5391,
                        italic: 0,
                        skew: 0
                    },
                    8838: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8839: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8846: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8849: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8850: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    8851: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8852: {
                        depth: 0,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    8853: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8854: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8855: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8856: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8857: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    8866: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8867: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8868: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8869: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8872: {
                        depth: .249,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8900: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8901: {
                        depth: -.05555,
                        height: .44445,
                        italic: 0,
                        skew: 0
                    },
                    8902: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    8904: {
                        depth: .005,
                        height: .505,
                        italic: 0,
                        skew: 0
                    },
                    8942: {
                        depth: .03,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    8943: {
                        depth: -.19,
                        height: .31,
                        italic: 0,
                        skew: 0
                    },
                    8945: {
                        depth: -.1,
                        height: .82,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8994: {
                        depth: -.14236,
                        height: .35764,
                        italic: 0,
                        skew: 0
                    },
                    8995: {
                        depth: -.14236,
                        height: .35764,
                        italic: 0,
                        skew: 0
                    },
                    9136: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    9137: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    9651: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9657: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    9661: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9667: {
                        depth: -.03472,
                        height: .46528,
                        italic: 0,
                        skew: 0
                    },
                    9711: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9824: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9825: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9826: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9827: {
                        depth: .12963,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9837: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    9838: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    9839: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10222: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    10223: {
                        depth: .244,
                        height: .744,
                        italic: 0,
                        skew: 0
                    },
                    10229: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10230: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10231: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10232: {
                        depth: .024,
                        height: .525,
                        italic: 0,
                        skew: 0
                    },
                    10233: {
                        depth: .024,
                        height: .525,
                        italic: 0,
                        skew: 0
                    },
                    10234: {
                        depth: .024,
                        height: .525,
                        italic: 0,
                        skew: 0
                    },
                    10236: {
                        depth: .011,
                        height: .511,
                        italic: 0,
                        skew: 0
                    },
                    10815: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: 0
                    },
                    10927: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    },
                    10928: {
                        depth: .13597,
                        height: .63597,
                        italic: 0,
                        skew: 0
                    }
                },
                "Math-BoldItalic": {
                    47: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .68611,
                        italic: .04835,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .68611,
                        italic: .05451,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .68611,
                        italic: .08229,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .68611,
                        italic: .07778,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .68611,
                        italic: .10069,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    81: {
                        depth: .19444,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .68611,
                        italic: .00421,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .68611,
                        italic: .05382,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .68611,
                        italic: .11424,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .68611,
                        italic: .25555,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68611,
                        italic: .07778,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .68611,
                        italic: .25555,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68611,
                        italic: .06979,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .11042,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .69326,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .69326,
                        italic: .0622,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .01852,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .0088,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .63492,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .02778,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: .04213,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .68611,
                        italic: .03194,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .68611,
                        italic: .07458,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .68611,
                        italic: .08229,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .68611,
                        italic: .05451,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .68611,
                        italic: .15972,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .68611,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .68611,
                        italic: .11653,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .68611,
                        italic: .04835,
                        skew: 0
                    },
                    945: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .03403,
                        skew: 0
                    },
                    947: {
                        depth: .19444,
                        height: .44444,
                        italic: .06389,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03819,
                        skew: 0
                    },
                    949: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .06215,
                        skew: 0
                    },
                    951: {
                        depth: .19444,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .03194,
                        skew: 0
                    },
                    953: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    954: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    957: {
                        depth: 0,
                        height: .44444,
                        italic: .06898,
                        skew: 0
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .03021,
                        skew: 0
                    },
                    959: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    960: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    962: {
                        depth: .09722,
                        height: .44444,
                        italic: .07917,
                        skew: 0
                    },
                    963: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .44444,
                        italic: .13472,
                        skew: 0
                    },
                    965: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    966: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    967: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03704,
                        skew: 0
                    },
                    969: {
                        depth: 0,
                        height: .44444,
                        italic: .03704,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    982: {
                        depth: 0,
                        height: .44444,
                        italic: .03194,
                        skew: 0
                    },
                    1009: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    1013: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    }
                },
                "Math-Italic": {
                    47: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .05556
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .11111
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .09618,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .02778
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .00773,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .02778
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .08334
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .16667
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .10764,
                        skew: .16667
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65952,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65952,
                        italic: .05724,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .03148,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .01968,
                        skew: .08334
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .08334
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: .05556
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: .08334
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .02691,
                        skew: .08334
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .04398,
                        skew: .05556
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .07569,
                        skew: .08334
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .05556
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11,
                        skew: .05556
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    945: {
                        depth: 0,
                        height: .43056,
                        italic: .0037,
                        skew: .02778
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .05278,
                        skew: .08334
                    },
                    947: {
                        depth: .19444,
                        height: .43056,
                        italic: .05556,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03785,
                        skew: .05556
                    },
                    949: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .07378,
                        skew: .08334
                    },
                    951: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .02778,
                        skew: .08334
                    },
                    953: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    954: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    957: {
                        depth: 0,
                        height: .43056,
                        italic: .06366,
                        skew: .02778
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .04601,
                        skew: .11111
                    },
                    959: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    960: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    962: {
                        depth: .09722,
                        height: .43056,
                        italic: .07986,
                        skew: .08334
                    },
                    963: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .43056,
                        italic: .1132,
                        skew: .02778
                    },
                    965: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    966: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    967: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03588,
                        skew: .11111
                    },
                    969: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    982: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    1009: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    1013: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    }
                },
                "Math-Regular": {
                    65: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .13889
                    },
                    66: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    67: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    68: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .05556
                    },
                    69: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    70: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    71: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    72: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    73: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .11111
                    },
                    74: {
                        depth: 0,
                        height: .68333,
                        italic: .09618,
                        skew: .16667
                    },
                    75: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .05556
                    },
                    76: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .02778
                    },
                    77: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    78: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .08334
                    },
                    79: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    80: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    81: {
                        depth: .19444,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    82: {
                        depth: 0,
                        height: .68333,
                        italic: .00773,
                        skew: .08334
                    },
                    83: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    84: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    85: {
                        depth: 0,
                        height: .68333,
                        italic: .10903,
                        skew: .02778
                    },
                    86: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .68333,
                        italic: .07847,
                        skew: .08334
                    },
                    89: {
                        depth: 0,
                        height: .68333,
                        italic: .22222,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .68333,
                        italic: .07153,
                        skew: .08334
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .16667
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    102: {
                        depth: .19444,
                        height: .69444,
                        italic: .10764,
                        skew: .16667
                    },
                    103: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .65952,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .65952,
                        italic: .05724,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: .03148,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: .01968,
                        skew: .08334
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    112: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    113: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .08334
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: .05556
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    116: {
                        depth: 0,
                        height: .61508,
                        italic: 0,
                        skew: .08334
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: .02691,
                        skew: .08334
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    121: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: .04398,
                        skew: .05556
                    },
                    915: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .08334
                    },
                    916: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    920: {
                        depth: 0,
                        height: .68333,
                        italic: .02778,
                        skew: .08334
                    },
                    923: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .16667
                    },
                    926: {
                        depth: 0,
                        height: .68333,
                        italic: .07569,
                        skew: .08334
                    },
                    928: {
                        depth: 0,
                        height: .68333,
                        italic: .08125,
                        skew: .05556
                    },
                    931: {
                        depth: 0,
                        height: .68333,
                        italic: .05764,
                        skew: .08334
                    },
                    933: {
                        depth: 0,
                        height: .68333,
                        italic: .13889,
                        skew: .05556
                    },
                    934: {
                        depth: 0,
                        height: .68333,
                        italic: 0,
                        skew: .08334
                    },
                    936: {
                        depth: 0,
                        height: .68333,
                        italic: .11,
                        skew: .05556
                    },
                    937: {
                        depth: 0,
                        height: .68333,
                        italic: .05017,
                        skew: .08334
                    },
                    945: {
                        depth: 0,
                        height: .43056,
                        italic: .0037,
                        skew: .02778
                    },
                    946: {
                        depth: .19444,
                        height: .69444,
                        italic: .05278,
                        skew: .08334
                    },
                    947: {
                        depth: .19444,
                        height: .43056,
                        italic: .05556,
                        skew: 0
                    },
                    948: {
                        depth: 0,
                        height: .69444,
                        italic: .03785,
                        skew: .05556
                    },
                    949: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    950: {
                        depth: .19444,
                        height: .69444,
                        italic: .07378,
                        skew: .08334
                    },
                    951: {
                        depth: .19444,
                        height: .43056,
                        italic: .03588,
                        skew: .05556
                    },
                    952: {
                        depth: 0,
                        height: .69444,
                        italic: .02778,
                        skew: .08334
                    },
                    953: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    954: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    955: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    956: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .02778
                    },
                    957: {
                        depth: 0,
                        height: .43056,
                        italic: .06366,
                        skew: .02778
                    },
                    958: {
                        depth: .19444,
                        height: .69444,
                        italic: .04601,
                        skew: .11111
                    },
                    959: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    960: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    961: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    962: {
                        depth: .09722,
                        height: .43056,
                        italic: .07986,
                        skew: .08334
                    },
                    963: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    964: {
                        depth: 0,
                        height: .43056,
                        italic: .1132,
                        skew: .02778
                    },
                    965: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: .02778
                    },
                    966: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    967: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    },
                    968: {
                        depth: .19444,
                        height: .69444,
                        italic: .03588,
                        skew: .11111
                    },
                    969: {
                        depth: 0,
                        height: .43056,
                        italic: .03588,
                        skew: 0
                    },
                    977: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    981: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: .08334
                    },
                    982: {
                        depth: 0,
                        height: .43056,
                        italic: .02778,
                        skew: 0
                    },
                    1009: {
                        depth: .19444,
                        height: .43056,
                        italic: 0,
                        skew: .08334
                    },
                    1013: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: .05556
                    }
                },
                "SansSerif-Regular": {
                    33: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: .19444,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .05556,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: .08333,
                        height: .58333,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .125,
                        height: .08333,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .08333,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .65556,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .125,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.13,
                        height: .37,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .125,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .69444,
                        italic: .01389,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .69444,
                        italic: .01389,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .69444,
                        italic: .025,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .25,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .35,
                        height: .09444,
                        italic: .02778,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .69444,
                        italic: .06944,
                        skew: 0
                    },
                    103: {
                        depth: .19444,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .19444,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .57143,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .19444,
                        height: .44444,
                        italic: .01389,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: .35,
                        height: .32659,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .19444,
                        height: .44444,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .67659,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .60889,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    775: {
                        depth: 0,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .67937,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    779: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .63194,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8211: {
                        depth: 0,
                        height: .44444,
                        italic: .02778,
                        skew: 0
                    },
                    8212: {
                        depth: 0,
                        height: .44444,
                        italic: .02778,
                        skew: 0
                    },
                    8216: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8217: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8220: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    8221: {
                        depth: 0,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    }
                },
                "Script-Regular": {
                    65: {
                        depth: 0,
                        height: .7,
                        italic: .22925,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .7,
                        italic: .04087,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .7,
                        italic: .1689,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .7,
                        italic: .09371,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .7,
                        italic: .18583,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .7,
                        italic: .13634,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .7,
                        italic: .17322,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .7,
                        italic: .29694,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    74: {
                        depth: .27778,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .7,
                        italic: .31259,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .7,
                        italic: .15981,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .7,
                        italic: .3525,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .7,
                        italic: .08078,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .7,
                        italic: .08078,
                        skew: 0
                    },
                    81: {
                        depth: 0,
                        height: .7,
                        italic: .03305,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .7,
                        italic: .06259,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .7,
                        italic: .19189,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .7,
                        italic: .29087,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .7,
                        italic: .25815,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .7,
                        italic: .27523,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .7,
                        italic: .27523,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .7,
                        italic: .26006,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .7,
                        italic: .2939,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .7,
                        italic: .24037,
                        skew: 0
                    }
                },
                "Size1-Regular": {
                    40: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .72222,
                        italic: 0,
                        skew: 0
                    },
                    8214: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    8593: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8595: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8657: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8659: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    8719: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8720: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8721: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8739: {
                        depth: -.00599,
                        height: .606,
                        italic: 0,
                        skew: 0
                    },
                    8741: {
                        depth: -.00599,
                        height: .606,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .30612,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8748: {
                        depth: .306,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8749: {
                        depth: .306,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8750: {
                        depth: .30612,
                        height: .805,
                        italic: .19445,
                        skew: 0
                    },
                    8896: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8897: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8898: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8899: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    9168: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .35001,
                        height: .85,
                        italic: 0,
                        skew: 0
                    },
                    10752: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10753: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10754: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10756: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    10758: {
                        depth: .25001,
                        height: .75,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size2-Regular": {
                    40: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8719: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8720: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8721: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8747: {
                        depth: .86225,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8748: {
                        depth: .862,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8749: {
                        depth: .862,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8750: {
                        depth: .86225,
                        height: 1.36,
                        italic: .44445,
                        skew: 0
                    },
                    8896: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8897: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8898: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8899: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    10752: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10753: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10754: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10756: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    },
                    10758: {
                        depth: .55001,
                        height: 1.05,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size3-Regular": {
                    40: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .75,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: .95003,
                        height: 1.45,
                        italic: 0,
                        skew: 0
                    }
                },
                "Size4-Regular": {
                    40: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    710: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    732: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .825,
                        italic: 0,
                        skew: 0
                    },
                    8730: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8968: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8969: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8970: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    8971: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    9115: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9116: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    9117: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9118: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9119: {
                        depth: 1e-5,
                        height: .6,
                        italic: 0,
                        skew: 0
                    },
                    9120: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9121: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9122: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    9123: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9124: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9125: {
                        depth: -99e-5,
                        height: .601,
                        italic: 0,
                        skew: 0
                    },
                    9126: {
                        depth: .64502,
                        height: 1.155,
                        italic: 0,
                        skew: 0
                    },
                    9127: {
                        depth: 1e-5,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    9128: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    9129: {
                        depth: .90001,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    9130: {
                        depth: 0,
                        height: .3,
                        italic: 0,
                        skew: 0
                    },
                    9131: {
                        depth: 1e-5,
                        height: .9,
                        italic: 0,
                        skew: 0
                    },
                    9132: {
                        depth: .65002,
                        height: 1.15,
                        italic: 0,
                        skew: 0
                    },
                    9133: {
                        depth: .90001,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    9143: {
                        depth: .88502,
                        height: .915,
                        italic: 0,
                        skew: 0
                    },
                    10216: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    10217: {
                        depth: 1.25003,
                        height: 1.75,
                        italic: 0,
                        skew: 0
                    },
                    57344: {
                        depth: -.00499,
                        height: .605,
                        italic: 0,
                        skew: 0
                    },
                    57345: {
                        depth: -.00499,
                        height: .605,
                        italic: 0,
                        skew: 0
                    },
                    57680: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57681: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57682: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    },
                    57683: {
                        depth: 0,
                        height: .12,
                        italic: 0,
                        skew: 0
                    }
                },
                "Typewriter-Regular": {
                    33: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    34: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    35: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    36: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    37: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    38: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    39: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    40: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    41: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    42: {
                        depth: 0,
                        height: .52083,
                        italic: 0,
                        skew: 0
                    },
                    43: {
                        depth: -.08056,
                        height: .53055,
                        italic: 0,
                        skew: 0
                    },
                    44: {
                        depth: .13889,
                        height: .125,
                        italic: 0,
                        skew: 0
                    },
                    45: {
                        depth: -.08056,
                        height: .53055,
                        italic: 0,
                        skew: 0
                    },
                    46: {
                        depth: 0,
                        height: .125,
                        italic: 0,
                        skew: 0
                    },
                    47: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    48: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    49: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    50: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    51: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    52: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    53: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    54: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    55: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    56: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    57: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    58: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    59: {
                        depth: .13889,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    60: {
                        depth: -.05556,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    61: {
                        depth: -.19549,
                        height: .41562,
                        italic: 0,
                        skew: 0
                    },
                    62: {
                        depth: -.05556,
                        height: .55556,
                        italic: 0,
                        skew: 0
                    },
                    63: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    64: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    65: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    66: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    67: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    68: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    69: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    70: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    71: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    72: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    73: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    74: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    75: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    76: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    77: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    78: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    79: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    80: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    81: {
                        depth: .13889,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    82: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    83: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    84: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    85: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    86: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    87: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    88: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    89: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    90: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    91: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    92: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    93: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    94: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    95: {
                        depth: .09514,
                        height: 0,
                        italic: 0,
                        skew: 0
                    },
                    96: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    97: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    98: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    99: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    100: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    101: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    102: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    103: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    104: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    105: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    106: {
                        depth: .22222,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    107: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    108: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    109: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    110: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    111: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    112: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    113: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    114: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    115: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    116: {
                        depth: 0,
                        height: .55358,
                        italic: 0,
                        skew: 0
                    },
                    117: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    118: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    119: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    120: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    121: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    122: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    123: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    124: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    125: {
                        depth: .08333,
                        height: .69444,
                        italic: 0,
                        skew: 0
                    },
                    126: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    127: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    305: {
                        depth: 0,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    567: {
                        depth: .22222,
                        height: .43056,
                        italic: 0,
                        skew: 0
                    },
                    768: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    769: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    770: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    771: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    772: {
                        depth: 0,
                        height: .56555,
                        italic: 0,
                        skew: 0
                    },
                    774: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    776: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    778: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    780: {
                        depth: 0,
                        height: .56597,
                        italic: 0,
                        skew: 0
                    },
                    915: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    916: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    920: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    923: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    926: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    928: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    931: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    933: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    934: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    936: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    937: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    2018: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    2019: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    },
                    8242: {
                        depth: 0,
                        height: .61111,
                        italic: 0,
                        skew: 0
                    }
                }
            }
        }, {}],
        18: [function(e, t, i) {
            var h = e("./utils");
            var a = e("./ParseError");
            var r = {
                "\\sqrt": {
                    numArgs: 1,
                    numOptionalArgs: 1,
                    handler: function(e, t, i, h) {
                        return {
                            type: "sqrt",
                            body: i,
                            index: t
                        }
                    }
                },
                "\\text": {
                    numArgs: 1,
                    argTypes: ["text"],
                    greediness: 2,
                    handler: function(e, t) {
                        var i;
                        if (t.type === "ordgroup") {
                            i = t.value
                        } else {
                            i = [t]
                        }
                        return {
                            type: "text",
                            body: i
                        }
                    }
                },
                "\\color": {
                    numArgs: 2,
                    allowedInText: true,
                    greediness: 3,
                    argTypes: ["color", "original"],
                    handler: function(e, t, i) {
                        var h;
                        if (i.type === "ordgroup") {
                            h = i.value
                        } else {
                            h = [i]
                        }
                        return {
                            type: "color",
                            color: t.value,
                            value: h
                        }
                    }
                },
                "\\overline": {
                    numArgs: 1,
                    handler: function(e, t) {
                        return {
                            type: "overline",
                            body: t
                        }
                    }
                },
                "\\rule": {
                    numArgs: 2,
                    numOptionalArgs: 1,
                    argTypes: ["size", "size", "size"],
                    handler: function(e, t, i, h) {
                        return {
                            type: "rule",
                            shift: t && t.value,
                            width: i.value,
                            height: h.value
                        }
                    }
                },
                "\\KaTeX": {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "katex"
                        }
                    }
                },
                "\\phantom": {
                    numArgs: 1,
                    handler: function(e, t) {
                        var i;
                        if (t.type === "ordgroup") {
                            i = t.value
                        } else {
                            i = [t]
                        }
                        return {
                            type: "phantom",
                            value: i
                        }
                    }
                }
            };
            var l = {
                "\\bigl": {
                    type: "open",
                    size: 1
                },
                "\\Bigl": {
                    type: "open",
                    size: 2
                },
                "\\biggl": {
                    type: "open",
                    size: 3
                },
                "\\Biggl": {
                    type: "open",
                    size: 4
                },
                "\\bigr": {
                    type: "close",
                    size: 1
                },
                "\\Bigr": {
                    type: "close",
                    size: 2
                },
                "\\biggr": {
                    type: "close",
                    size: 3
                },
                "\\Biggr": {
                    type: "close",
                    size: 4
                },
                "\\bigm": {
                    type: "rel",
                    size: 1
                },
                "\\Bigm": {
                    type: "rel",
                    size: 2
                },
                "\\biggm": {
                    type: "rel",
                    size: 3
                },
                "\\Biggm": {
                    type: "rel",
                    size: 4
                },
                "\\big": {
                    type: "textord",
                    size: 1
                },
                "\\Big": {
                    type: "textord",
                    size: 2
                },
                "\\bigg": {
                    type: "textord",
                    size: 3
                },
                "\\Bigg": {
                    type: "textord",
                    size: 4
                }
            };
            var s = ["(", ")", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\\lceil", "\\rceil", "<", ">", "\\langle", "\\rangle", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\\lmoustache", "\\rmoustache", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];
            var p = {
                "\\Bbb": "\\mathbb",
                "\\bold": "\\mathbf",
                "\\frak": "\\mathfrak"
            };
            var c = [{
                funcs: ["\\blue", "\\orange", "\\pink", "\\red", "\\green", "\\gray", "\\purple", "\\blueA", "\\blueB", "\\blueC", "\\blueD", "\\blueE", "\\tealA", "\\tealB", "\\tealC", "\\tealD", "\\tealE", "\\greenA", "\\greenB", "\\greenC", "\\greenD", "\\greenE", "\\goldA", "\\goldB", "\\goldC", "\\goldD", "\\goldE", "\\redA", "\\redB", "\\redC", "\\redD", "\\redE", "\\maroonA", "\\maroonB", "\\maroonC", "\\maroonD", "\\maroonE", "\\purpleA", "\\purpleB", "\\purpleC", "\\purpleD", "\\purpleE", "\\mintA", "\\mintB", "\\mintC", "\\grayA", "\\grayB", "\\grayC", "\\grayD", "\\grayE", "\\grayF", "\\grayG", "\\grayH", "\\grayI", "\\kaBlue", "\\kaGreen"],
                data: {
                    numArgs: 1,
                    allowedInText: true,
                    greediness: 3,
                    handler: function(e, t) {
                        var i;
                        if (t.type === "ordgroup") {
                            i = t.value
                        } else {
                            i = [t]
                        }
                        return {
                            type: "color",
                            color: "katex-" + e.slice(1),
                            value: i
                        }
                    }
                }
            }, {
                funcs: ["\\arcsin", "\\arccos", "\\arctan", "\\arg", "\\cos", "\\cosh", "\\cot", "\\coth", "\\csc", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\tan", "\\tanh"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: false,
                            symbol: false,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\det", "\\gcd", "\\inf", "\\lim", "\\liminf", "\\limsup", "\\max", "\\min", "\\Pr", "\\sup"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: true,
                            symbol: false,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\int", "\\iint", "\\iiint", "\\oint"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: false,
                            symbol: true,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        return {
                            type: "op",
                            limits: true,
                            symbol: true,
                            body: e
                        }
                    }
                }
            }, {
                funcs: ["\\dfrac", "\\frac", "\\tfrac", "\\dbinom", "\\binom", "\\tbinom"],
                data: {
                    numArgs: 2,
                    greediness: 2,
                    handler: function(e, t, i) {
                        var h;
                        var a = null;
                        var r = null;
                        var l = "auto";
                        switch (e) {
                            case "\\dfrac":
                            case "\\frac":
                            case "\\tfrac":
                                h = true;
                                break;
                            case "\\dbinom":
                            case "\\binom":
                            case "\\tbinom":
                                h = false;
                                a = "(";
                                r = ")";
                                break;
                            default:
                                throw new Error("Unrecognized genfrac command")
                        }
                        switch (e) {
                            case "\\dfrac":
                            case "\\dbinom":
                                l = "display";
                                break;
                            case "\\tfrac":
                            case "\\tbinom":
                                l = "text";
                                break
                        }
                        return {
                            type: "genfrac",
                            numer: t,
                            denom: i,
                            hasBarLine: h,
                            leftDelim: a,
                            rightDelim: r,
                            size: l
                        }
                    }
                }
            }, {
                funcs: ["\\llap", "\\rlap"],
                data: {
                    numArgs: 1,
                    allowedInText: true,
                    handler: function(e, t) {
                        return {
                            type: e.slice(1),
                            body: t
                        }
                    }
                }
            }, {
                funcs: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg", "\\left", "\\right"],
                data: {
                    numArgs: 1,
                    handler: function(e, t, i) {
                        if (!h.contains(s, t.value)) {
                            throw new a("Invalid delimiter: '" + t.value + "' after '" + e + "'", this.lexer, i[1])
                        }
                        if (e === "\\left" || e === "\\right") {
                            return {
                                type: "leftright",
                                value: t.value
                            }
                        } else {
                            return {
                                type: "delimsizing",
                                size: l[e].size,
                                delimType: l[e].type,
                                value: t.value
                            }
                        }
                    }
                }
            }, {
                funcs: ["\\tiny", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"],
                data: {
                    numArgs: 0
                }
            }, {
                funcs: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
                data: {
                    numArgs: 0
                }
            }, {
                funcs: ["\\mathrm", "\\mathit", "\\mathbf", "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf", "\\mathtt", "\\Bbb", "\\bold", "\\frak"],
                data: {
                    numArgs: 1,
                    handler: function(e, t) {
                        if (e in p) {
                            e = p[e]
                        }
                        return {
                            type: "font",
                            font: e.slice(1),
                            body: t
                        }
                    }
                }
            }, {
                funcs: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot"],
                data: {
                    numArgs: 1,
                    handler: function(e, t) {
                        return {
                            type: "accent",
                            accent: e,
                            base: t
                        }
                    }
                }
            }, {
                funcs: ["\\over", "\\choose"],
                data: {
                    numArgs: 0,
                    handler: function(e) {
                        var t;
                        switch (e) {
                            case "\\over":
                                t = "\\frac";
                                break;
                            case "\\choose":
                                t = "\\binom";
                                break;
                            default:
                                throw new Error("Unrecognized infix genfrac command")
                        }
                        return {
                            type: "infix",
                            replaceWith: t
                        }
                    }
                }
            }, {
                funcs: ["\\\\", "\\cr"],
                data: {
                    numArgs: 0,
                    numOptionalArgs: 1,
                    argTypes: ["size"],
                    handler: function(e, t) {
                        return {
                            type: "cr",
                            size: t
                        }
                    }
                }
            }, {
                funcs: ["\\begin", "\\end"],
                data: {
                    numArgs: 1,
                    argTypes: ["text"],
                    handler: function(e, t, i) {
                        if (t.type !== "ordgroup") {
                            throw new a("Invalid environment name", this.lexer, i[1])
                        }
                        var h = "";
                        for (var r = 0; r < t.value.length; ++r) {
                            h += t.value[r].value
                        }
                        return {
                            type: "environment",
                            name: h,
                            namepos: i[1]
                        }
                    }
                }
            }];
            var n = function(e, t) {
                for (var i = 0; i < e.length; i++) {
                    r[e[i]] = t
                }
            };
            for (var o = 0; o < c.length; o++) {
                n(c[o].funcs, c[o].data)
            }
            for (var g in r) {
                if (r.hasOwnProperty(g)) {
                    var d = r[g];
                    r[g] = {
                        numArgs: d.numArgs,
                        argTypes: d.argTypes,
                        greediness: d.greediness === undefined ? 1 : d.greediness,
                        allowedInText: d.allowedInText ? d.allowedInText : false,
                        numOptionalArgs: d.numOptionalArgs === undefined ? 0 : d.numOptionalArgs,
                        handler: d.handler
                    }
                }
            }
            t.exports = {
                funcs: r
            }
        }, {
            "./ParseError": 5,
            "./utils": 23
        }],
        19: [function(e, t, i) {
            var h = e("./utils");

            function a(e, t) {
                this.type = e;
                this.attributes = {};
                this.children = t || []
            }
            a.prototype.setAttribute = function(e, t) {
                this.attributes[e] = t
            };
            a.prototype.toNode = function() {
                var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
                for (var t in this.attributes) {
                    if (Object.prototype.hasOwnProperty.call(this.attributes, t)) {
                        e.setAttribute(t, this.attributes[t])
                    }
                }
                for (var i = 0; i < this.children.length; i++) {
                    e.appendChild(this.children[i].toNode())
                }
                return e
            };
            a.prototype.toMarkup = function() {
                var e = "<" + this.type;
                for (var t in this.attributes) {
                    if (Object.prototype.hasOwnProperty.call(this.attributes, t)) {
                        e += " " + t + '="';
                        e += h.escape(this.attributes[t]);
                        e += '"'
                    }
                }
                e += ">";
                for (var i = 0; i < this.children.length; i++) {
                    e += this.children[i].toMarkup()
                }
                e += "</" + this.type + ">";
                return e
            };

            function r(e) {
                this.text = e
            }
            r.prototype.toNode = function() {
                return document.createTextNode(this.text)
            };
            r.prototype.toMarkup = function() {
                return h.escape(this.text)
            };
            t.exports = {
                MathNode: a,
                TextNode: r
            }
        }, {
            "./utils": 23
        }],
        20: [function(e, t, i) {
            function h(e, t, i) {
                this.type = e;
                this.value = t;
                this.mode = i
            }

            function a(e, t, i) {
                this.result = e;
                this.position = t
            }
            t.exports = {
                ParseNode: h,
                ParseResult: a
            }
        }, {}],
        21: [function(e, t, i) {
            var h = e("./Parser");
            var a = function(e, t) {
                var i = new h(e, t);
                return i.parse()
            };
            t.exports = a
        }, {
            "./Parser": 6
        }],
        22: [function(e, t, i) {
            var h = {
                math: {
                    "\\equiv": {
                        font: "main",
                        group: "rel",
                        replace: "\u2261"
                    },
                    "\\prec": {
                        font: "main",
                        group: "rel",
                        replace: "\u227a"
                    },
                    "\\succ": {
                        font: "main",
                        group: "rel",
                        replace: "\u227b"
                    },
                    "\\sim": {
                        font: "main",
                        group: "rel",
                        replace: "\u223c"
                    },
                    "\\perp": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a5"
                    },
                    "\\preceq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2aaf"
                    },
                    "\\succeq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2ab0"
                    },
                    "\\simeq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2243"
                    },
                    "\\mid": {
                        font: "main",
                        group: "rel",
                        replace: "\u2223"
                    },
                    "\\ll": {
                        font: "main",
                        group: "rel",
                        replace: "\u226a"
                    },
                    "\\gg": {
                        font: "main",
                        group: "rel",
                        replace: "\u226b"
                    },
                    "\\asymp": {
                        font: "main",
                        group: "rel",
                        replace: "\u224d"
                    },
                    "\\parallel": {
                        font: "main",
                        group: "rel",
                        replace: "\u2225"
                    },
                    "\\bowtie": {
                        font: "main",
                        group: "rel",
                        replace: "\u22c8"
                    },
                    "\\smile": {
                        font: "main",
                        group: "rel",
                        replace: "\u2323"
                    },
                    "\\sqsubseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2291"
                    },
                    "\\sqsupseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2292"
                    },
                    "\\doteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2250"
                    },
                    "\\frown": {
                        font: "main",
                        group: "rel",
                        replace: "\u2322"
                    },
                    "\\ni": {
                        font: "main",
                        group: "rel",
                        replace: "\u220b"
                    },
                    "\\propto": {
                        font: "main",
                        group: "rel",
                        replace: "\u221d"
                    },
                    "\\vdash": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a2"
                    },
                    "\\dashv": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a3"
                    },
                    "\\owns": {
                        font: "main",
                        group: "rel",
                        replace: "\u220b"
                    },
                    "\\ldotp": {
                        font: "main",
                        group: "punct",
                        replace: "."
                    },
                    "\\cdotp": {
                        font: "main",
                        group: "punct",
                        replace: "\u22c5"
                    },
                    "\\#": {
                        font: "main",
                        group: "textord",
                        replace: "#"
                    },
                    "\\&": {
                        font: "main",
                        group: "textord",
                        replace: "&"
                    },
                    "\\aleph": {
                        font: "main",
                        group: "textord",
                        replace: "\u2135"
                    },
                    "\\forall": {
                        font: "main",
                        group: "textord",
                        replace: "\u2200"
                    },
                    "\\hbar": {
                        font: "main",
                        group: "textord",
                        replace: "\u210f"
                    },
                    "\\exists": {
                        font: "main",
                        group: "textord",
                        replace: "\u2203"
                    },
                    "\\nabla": {
                        font: "main",
                        group: "textord",
                        replace: "\u2207"
                    },
                    "\\flat": {
                        font: "main",
                        group: "textord",
                        replace: "\u266d"
                    },
                    "\\ell": {
                        font: "main",
                        group: "textord",
                        replace: "\u2113"
                    },
                    "\\natural": {
                        font: "main",
                        group: "textord",
                        replace: "\u266e"
                    },
                    "\\clubsuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2663"
                    },
                    "\\wp": {
                        font: "main",
                        group: "textord",
                        replace: "\u2118"
                    },
                    "\\sharp": {
                        font: "main",
                        group: "textord",
                        replace: "\u266f"
                    },
                    "\\diamondsuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2662"
                    },
                    "\\Re": {
                        font: "main",
                        group: "textord",
                        replace: "\u211c"
                    },
                    "\\heartsuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2661"
                    },
                    "\\Im": {
                        font: "main",
                        group: "textord",
                        replace: "\u2111"
                    },
                    "\\spadesuit": {
                        font: "main",
                        group: "textord",
                        replace: "\u2660"
                    },
                    "\\dag": {
                        font: "main",
                        group: "textord",
                        replace: "\u2020"
                    },
                    "\\ddag": {
                        font: "main",
                        group: "textord",
                        replace: "\u2021"
                    },
                    "\\rmoustache": {
                        font: "main",
                        group: "close",
                        replace: "\u23b1"
                    },
                    "\\lmoustache": {
                        font: "main",
                        group: "open",
                        replace: "\u23b0"
                    },
                    "\\rgroup": {
                        font: "main",
                        group: "close",
                        replace: "\u27ef"
                    },
                    "\\lgroup": {
                        font: "main",
                        group: "open",
                        replace: "\u27ee"
                    },
                    "\\mp": {
                        font: "main",
                        group: "bin",
                        replace: "\u2213"
                    },
                    "\\ominus": {
                        font: "main",
                        group: "bin",
                        replace: "\u2296"
                    },
                    "\\uplus": {
                        font: "main",
                        group: "bin",
                        replace: "\u228e"
                    },
                    "\\sqcap": {
                        font: "main",
                        group: "bin",
                        replace: "\u2293"
                    },
                    "\\ast": {
                        font: "main",
                        group: "bin",
                        replace: "\u2217"
                    },
                    "\\sqcup": {
                        font: "main",
                        group: "bin",
                        replace: "\u2294"
                    },
                    "\\bigcirc": {
                        font: "main",
                        group: "bin",
                        replace: "\u25ef"
                    },
                    "\\bullet": {
                        font: "main",
                        group: "bin",
                        replace: "\u2219"
                    },
                    "\\ddagger": {
                        font: "main",
                        group: "bin",
                        replace: "\u2021"
                    },
                    "\\wr": {
                        font: "main",
                        group: "bin",
                        replace: "\u2240"
                    },
                    "\\amalg": {
                        font: "main",
                        group: "bin",
                        replace: "\u2a3f"
                    },
                    "\\longleftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f5"
                    },
                    "\\Leftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d0"
                    },
                    "\\Longleftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f8"
                    },
                    "\\longrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f6"
                    },
                    "\\Rightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d2"
                    },
                    "\\Longrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f9"
                    },
                    "\\leftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2194"
                    },
                    "\\longleftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27f7"
                    },
                    "\\Leftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d4"
                    },
                    "\\Longleftrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u27fa"
                    },
                    "\\mapsto": {
                        font: "main",
                        group: "rel",
                        replace: "\u21a6"
                    },
                    "\\longmapsto": {
                        font: "main",
                        group: "rel",
                        replace: "\u27fc"
                    },
                    "\\nearrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2197"
                    },
                    "\\hookleftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21a9"
                    },
                    "\\hookrightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21aa"
                    },
                    "\\searrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2198"
                    },
                    "\\leftharpoonup": {
                        font: "main",
                        group: "rel",
                        replace: "\u21bc"
                    },
                    "\\rightharpoonup": {
                        font: "main",
                        group: "rel",
                        replace: "\u21c0"
                    },
                    "\\swarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2199"
                    },
                    "\\leftharpoondown": {
                        font: "main",
                        group: "rel",
                        replace: "\u21bd"
                    },
                    "\\rightharpoondown": {
                        font: "main",
                        group: "rel",
                        replace: "\u21c1"
                    },
                    "\\nwarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2196"
                    },
                    "\\rightleftharpoons": {
                        font: "main",
                        group: "rel",
                        replace: "\u21cc"
                    },
                    "\\nless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u226e"
                    },
                    "\\nleqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue010"
                    },
                    "\\nleqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue011"
                    },
                    "\\lneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a87"
                    },
                    "\\lneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2268"
                    },
                    "\\lvertneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00c"
                    },
                    "\\lnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e6"
                    },
                    "\\lnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a89"
                    },
                    "\\nprec": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2280"
                    },
                    "\\npreceq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e0"
                    },
                    "\\precnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e8"
                    },
                    "\\precnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab9"
                    },
                    "\\nsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2241"
                    },
                    "\\nshortmid": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue006"
                    },
                    "\\nmid": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2224"
                    },
                    "\\nvdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ac"
                    },
                    "\\nvDash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ad"
                    },
                    "\\ntriangleleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ea"
                    },
                    "\\ntrianglelefteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ec"
                    },
                    "\\subsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u228a"
                    },
                    "\\varsubsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue01a"
                    },
                    "\\subsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2acb"
                    },
                    "\\varsubsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue017"
                    },
                    "\\ngtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u226f"
                    },
                    "\\ngeqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00f"
                    },
                    "\\ngeqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00e"
                    },
                    "\\gneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a88"
                    },
                    "\\gneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2269"
                    },
                    "\\gvertneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue00d"
                    },
                    "\\gnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e7"
                    },
                    "\\gnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a8a"
                    },
                    "\\nsucc": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2281"
                    },
                    "\\nsucceq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e1"
                    },
                    "\\succnsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22e9"
                    },
                    "\\succnapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2aba"
                    },
                    "\\ncong": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2246"
                    },
                    "\\nshortparallel": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue007"
                    },
                    "\\nparallel": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2226"
                    },
                    "\\nVDash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22af"
                    },
                    "\\ntriangleright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22eb"
                    },
                    "\\ntrianglerighteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ed"
                    },
                    "\\nsupseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue018"
                    },
                    "\\supsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u228b"
                    },
                    "\\varsupsetneq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue01b"
                    },
                    "\\supsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2acc"
                    },
                    "\\varsupsetneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue019"
                    },
                    "\\nVdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22ae"
                    },
                    "\\precneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab5"
                    },
                    "\\succneqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab6"
                    },
                    "\\nsubseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\ue016"
                    },
                    "\\unlhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b4"
                    },
                    "\\unrhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b5"
                    },
                    "\\nleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u219a"
                    },
                    "\\nrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u219b"
                    },
                    "\\nLeftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21cd"
                    },
                    "\\nRightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21cf"
                    },
                    "\\nleftrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ae"
                    },
                    "\\nLeftrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ce"
                    },
                    "\\vartriangle": {
                        font: "ams",
                        group: "rel",
                        replace: "\u25b3"
                    },
                    "\\hslash": {
                        font: "ams",
                        group: "textord",
                        replace: "\u210f"
                    },
                    "\\triangledown": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25bd"
                    },
                    "\\lozenge": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25ca"
                    },
                    "\\circledS": {
                        font: "ams",
                        group: "textord",
                        replace: "\u24c8"
                    },
                    "\\circledR": {
                        font: "ams",
                        group: "textord",
                        replace: "\xae"
                    },
                    "\\measuredangle": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2221"
                    },
                    "\\nexists": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2204"
                    },
                    "\\mho": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2127"
                    },
                    "\\Finv": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2132"
                    },
                    "\\Game": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2141"
                    },
                    "\\Bbbk": {
                        font: "ams",
                        group: "textord",
                        replace: "k"
                    },
                    "\\backprime": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2035"
                    },
                    "\\blacktriangle": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25b2"
                    },
                    "\\blacktriangledown": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25bc"
                    },
                    "\\blacksquare": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25a0"
                    },
                    "\\blacklozenge": {
                        font: "ams",
                        group: "textord",
                        replace: "\u29eb"
                    },
                    "\\bigstar": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2605"
                    },
                    "\\sphericalangle": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2222"
                    },
                    "\\complement": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2201"
                    },
                    "\\eth": {
                        font: "ams",
                        group: "textord",
                        replace: "\xf0"
                    },
                    "\\diagup": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2571"
                    },
                    "\\diagdown": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2572"
                    },
                    "\\square": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25a1"
                    },
                    "\\Box": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25a1"
                    },
                    "\\Diamond": {
                        font: "ams",
                        group: "textord",
                        replace: "\u25ca"
                    },
                    "\\yen": {
                        font: "ams",
                        group: "textord",
                        replace: "\xa5"
                    },
                    "\\checkmark": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2713"
                    },
                    "\\beth": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2136"
                    },
                    "\\daleth": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2138"
                    },
                    "\\gimel": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2137"
                    },
                    "\\digamma": {
                        font: "ams",
                        group: "textord",
                        replace: "\u03dd"
                    },
                    "\\varkappa": {
                        font: "ams",
                        group: "textord",
                        replace: "\u03f0"
                    },
                    "\\ulcorner": {
                        font: "ams",
                        group: "open",
                        replace: "\u250c"
                    },
                    "\\urcorner": {
                        font: "ams",
                        group: "close",
                        replace: "\u2510"
                    },
                    "\\llcorner": {
                        font: "ams",
                        group: "open",
                        replace: "\u2514"
                    },
                    "\\lrcorner": {
                        font: "ams",
                        group: "close",
                        replace: "\u2518"
                    },
                    "\\leqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2266"
                    },
                    "\\leqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a7d"
                    },
                    "\\eqslantless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a95"
                    },
                    "\\lesssim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2272"
                    },
                    "\\lessapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a85"
                    },
                    "\\approxeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u224a"
                    },
                    "\\lessdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d6"
                    },
                    "\\lll": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d8"
                    },
                    "\\lessgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2276"
                    },
                    "\\lesseqgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22da"
                    },
                    "\\lesseqqgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a8b"
                    },
                    "\\doteqdot": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2251"
                    },
                    "\\risingdotseq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2253"
                    },
                    "\\fallingdotseq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2252"
                    },
                    "\\backsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u223d"
                    },
                    "\\backsimeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22cd"
                    },
                    "\\subseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ac5"
                    },
                    "\\Subset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d0"
                    },
                    "\\sqsubset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u228f"
                    },
                    "\\preccurlyeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227c"
                    },
                    "\\curlyeqprec": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22de"
                    },
                    "\\precsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227e"
                    },
                    "\\precapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab7"
                    },
                    "\\vartriangleleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b2"
                    },
                    "\\trianglelefteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b4"
                    },
                    "\\vDash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22a8"
                    },
                    "\\Vvdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22aa"
                    },
                    "\\smallsmile": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2323"
                    },
                    "\\smallfrown": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2322"
                    },
                    "\\bumpeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u224f"
                    },
                    "\\Bumpeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u224e"
                    },
                    "\\geqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2267"
                    },
                    "\\geqslant": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a7e"
                    },
                    "\\eqslantgtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a96"
                    },
                    "\\gtrsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2273"
                    },
                    "\\gtrapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a86"
                    },
                    "\\gtrdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d7"
                    },
                    "\\ggg": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d9"
                    },
                    "\\gtrless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2277"
                    },
                    "\\gtreqless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22db"
                    },
                    "\\gtreqqless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2a8c"
                    },
                    "\\eqcirc": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2256"
                    },
                    "\\circeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2257"
                    },
                    "\\triangleq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u225c"
                    },
                    "\\thicksim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u223c"
                    },
                    "\\thickapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2248"
                    },
                    "\\supseteqq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ac6"
                    },
                    "\\Supset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d1"
                    },
                    "\\sqsupset": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2290"
                    },
                    "\\succcurlyeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227d"
                    },
                    "\\curlyeqsucc": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22df"
                    },
                    "\\succsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u227f"
                    },
                    "\\succapprox": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2ab8"
                    },
                    "\\vartriangleright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b3"
                    },
                    "\\trianglerighteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b5"
                    },
                    "\\Vdash": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22a9"
                    },
                    "\\shortmid": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2223"
                    },
                    "\\shortparallel": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2225"
                    },
                    "\\between": {
                        font: "ams",
                        group: "rel",
                        replace: "\u226c"
                    },
                    "\\pitchfork": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d4"
                    },
                    "\\varpropto": {
                        font: "ams",
                        group: "rel",
                        replace: "\u221d"
                    },
                    "\\blacktriangleleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u25c0"
                    },
                    "\\therefore": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2234"
                    },
                    "\\backepsilon": {
                        font: "ams",
                        group: "rel",
                        replace: "\u220d"
                    },
                    "\\blacktriangleright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u25b6"
                    },
                    "\\because": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2235"
                    },
                    "\\llless": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d8"
                    },
                    "\\gggtr": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22d9"
                    },
                    "\\lhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b2"
                    },
                    "\\rhd": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22b3"
                    },
                    "\\eqsim": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2242"
                    },
                    "\\Join": {
                        font: "main",
                        group: "rel",
                        replace: "\u22c8"
                    },
                    "\\Doteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2251"
                    },
                    "\\dotplus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u2214"
                    },
                    "\\smallsetminus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u2216"
                    },
                    "\\Cap": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d2"
                    },
                    "\\Cup": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d3"
                    },
                    "\\doublebarwedge": {
                        font: "ams",
                        group: "bin",
                        replace: "\u2a5e"
                    },
                    "\\boxminus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229f"
                    },
                    "\\boxplus": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229e"
                    },
                    "\\divideontimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22c7"
                    },
                    "\\ltimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22c9"
                    },
                    "\\rtimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22ca"
                    },
                    "\\leftthreetimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22cb"
                    },
                    "\\rightthreetimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22cc"
                    },
                    "\\curlywedge": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22cf"
                    },
                    "\\curlyvee": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22ce"
                    },
                    "\\circleddash": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229d"
                    },
                    "\\circledast": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229b"
                    },
                    "\\centerdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22c5"
                    },
                    "\\intercal": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22ba"
                    },
                    "\\doublecap": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d2"
                    },
                    "\\doublecup": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22d3"
                    },
                    "\\boxtimes": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22a0"
                    },
                    "\\dashrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21e2"
                    },
                    "\\dashleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21e0"
                    },
                    "\\leftleftarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c7"
                    },
                    "\\leftrightarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c6"
                    },
                    "\\Lleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21da"
                    },
                    "\\twoheadleftarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u219e"
                    },
                    "\\leftarrowtail": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21a2"
                    },
                    "\\looparrowleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ab"
                    },
                    "\\leftrightharpoons": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21cb"
                    },
                    "\\curvearrowleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b6"
                    },
                    "\\circlearrowleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ba"
                    },
                    "\\Lsh": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b0"
                    },
                    "\\upuparrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c8"
                    },
                    "\\upharpoonleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21bf"
                    },
                    "\\downharpoonleft": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c3"
                    },
                    "\\multimap": {
                        font: "ams",
                        group: "rel",
                        replace: "\u22b8"
                    },
                    "\\leftrightsquigarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ad"
                    },
                    "\\rightrightarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c9"
                    },
                    "\\rightleftarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c4"
                    },
                    "\\twoheadrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21a0"
                    },
                    "\\rightarrowtail": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21a3"
                    },
                    "\\looparrowright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ac"
                    },
                    "\\curvearrowright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b7"
                    },
                    "\\circlearrowright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21bb"
                    },
                    "\\Rsh": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21b1"
                    },
                    "\\downdownarrows": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21ca"
                    },
                    "\\upharpoonright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21be"
                    },
                    "\\downharpoonright": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21c2"
                    },
                    "\\rightsquigarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21dd"
                    },
                    "\\leadsto": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21dd"
                    },
                    "\\Rrightarrow": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21db"
                    },
                    "\\restriction": {
                        font: "ams",
                        group: "rel",
                        replace: "\u21be"
                    },
                    "`": {
                        font: "main",
                        group: "textord",
                        replace: "\u2018"
                    },
                    "\\$": {
                        font: "main",
                        group: "textord",
                        replace: "$"
                    },
                    "\\%": {
                        font: "main",
                        group: "textord",
                        replace: "%"
                    },
                    "\\_": {
                        font: "main",
                        group: "textord",
                        replace: "_"
                    },
                    "\\angle": {
                        font: "main",
                        group: "textord",
                        replace: "\u2220"
                    },
                    "\\infty": {
                        font: "main",
                        group: "textord",
                        replace: "\u221e"
                    },
                    "\\prime": {
                        font: "main",
                        group: "textord",
                        replace: "\u2032"
                    },
                    "\\triangle": {
                        font: "main",
                        group: "textord",
                        replace: "\u25b3"
                    },
                    "\\Gamma": {
                        font: "main",
                        group: "textord",
                        replace: "\u0393"
                    },
                    "\\Delta": {
                        font: "main",
                        group: "textord",
                        replace: "\u0394"
                    },
                    "\\Theta": {
                        font: "main",
                        group: "textord",
                        replace: "\u0398"
                    },
                    "\\Lambda": {
                        font: "main",
                        group: "textord",
                        replace: "\u039b"
                    },
                    "\\Xi": {
                        font: "main",
                        group: "textord",
                        replace: "\u039e"
                    },
                    "\\Pi": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a0"
                    },
                    "\\Sigma": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a3"
                    },
                    "\\Upsilon": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a5"
                    },
                    "\\Phi": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a6"
                    },
                    "\\Psi": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a8"
                    },
                    "\\Omega": {
                        font: "main",
                        group: "textord",
                        replace: "\u03a9"
                    },
                    "\\neg": {
                        font: "main",
                        group: "textord",
                        replace: "\xac"
                    },
                    "\\lnot": {
                        font: "main",
                        group: "textord",
                        replace: "\xac"
                    },
                    "\\top": {
                        font: "main",
                        group: "textord",
                        replace: "\u22a4"
                    },
                    "\\bot": {
                        font: "main",
                        group: "textord",
                        replace: "\u22a5"
                    },
                    "\\emptyset": {
                        font: "main",
                        group: "textord",
                        replace: "\u2205"
                    },
                    "\\varnothing": {
                        font: "ams",
                        group: "textord",
                        replace: "\u2205"
                    },
                    "\\alpha": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b1"
                    },
                    "\\beta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b2"
                    },
                    "\\gamma": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b3"
                    },
                    "\\delta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b4"
                    },
                    "\\epsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03f5"
                    },
                    "\\zeta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b6"
                    },
                    "\\eta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b7"
                    },
                    "\\theta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b8"
                    },
                    "\\iota": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b9"
                    },
                    "\\kappa": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03ba"
                    },
                    "\\lambda": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03bb"
                    },
                    "\\mu": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03bc"
                    },
                    "\\nu": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03bd"
                    },
                    "\\xi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03be"
                    },
                    "\\omicron": {
                        font: "main",
                        group: "mathord",
                        replace: "o"
                    },
                    "\\pi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c0"
                    },
                    "\\rho": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c1"
                    },
                    "\\sigma": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c3"
                    },
                    "\\tau": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c4"
                    },
                    "\\upsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c5"
                    },
                    "\\phi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03d5"
                    },
                    "\\chi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c7"
                    },
                    "\\psi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c8"
                    },
                    "\\omega": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c9"
                    },
                    "\\varepsilon": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03b5"
                    },
                    "\\vartheta": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03d1"
                    },
                    "\\varpi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03d6"
                    },
                    "\\varrho": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03f1"
                    },
                    "\\varsigma": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c2"
                    },
                    "\\varphi": {
                        font: "main",
                        group: "mathord",
                        replace: "\u03c6"
                    },
                    "*": {
                        font: "main",
                        group: "bin",
                        replace: "\u2217"
                    },
                    "+": {
                        font: "main",
                        group: "bin"
                    },
                    "-": {
                        font: "main",
                        group: "bin",
                        replace: "\u2212"
                    },
                    "\\cdot": {
                        font: "main",
                        group: "bin",
                        replace: "\u22c5"
                    },
                    "\\circ": {
                        font: "main",
                        group: "bin",
                        replace: "\u2218"
                    },
                    "\\div": {
                        font: "main",
                        group: "bin",
                        replace: "\xf7"
                    },
                    "\\pm": {
                        font: "main",
                        group: "bin",
                        replace: "\xb1"
                    },
                    "\\times": {
                        font: "main",
                        group: "bin",
                        replace: "\xd7"
                    },
                    "\\cap": {
                        font: "main",
                        group: "bin",
                        replace: "\u2229"
                    },
                    "\\cup": {
                        font: "main",
                        group: "bin",
                        replace: "\u222a"
                    },
                    "\\setminus": {
                        font: "main",
                        group: "bin",
                        replace: "\u2216"
                    },
                    "\\land": {
                        font: "main",
                        group: "bin",
                        replace: "\u2227"
                    },
                    "\\lor": {
                        font: "main",
                        group: "bin",
                        replace: "\u2228"
                    },
                    "\\wedge": {
                        font: "main",
                        group: "bin",
                        replace: "\u2227"
                    },
                    "\\vee": {
                        font: "main",
                        group: "bin",
                        replace: "\u2228"
                    },
                    "\\surd": {
                        font: "main",
                        group: "textord",
                        replace: "\u221a"
                    },
                    "(": {
                        font: "main",
                        group: "open"
                    },
                    "[": {
                        font: "main",
                        group: "open"
                    },
                    "\\langle": {
                        font: "main",
                        group: "open",
                        replace: "\u27e8"
                    },
                    "\\lvert": {
                        font: "main",
                        group: "open",
                        replace: "\u2223"
                    },
                    "\\lVert": {
                        font: "main",
                        group: "open",
                        replace: "\u2225"
                    },
                    ")": {
                        font: "main",
                        group: "close"
                    },
                    "]": {
                        font: "main",
                        group: "close"
                    },
                    "?": {
                        font: "main",
                        group: "close"
                    },
                    "!": {
                        font: "main",
                        group: "close"
                    },
                    "\\rangle": {
                        font: "main",
                        group: "close",
                        replace: "\u27e9"
                    },
                    "\\rvert": {
                        font: "main",
                        group: "close",
                        replace: "\u2223"
                    },
                    "\\rVert": {
                        font: "main",
                        group: "close",
                        replace: "\u2225"
                    },
                    "=": {
                        font: "main",
                        group: "rel"
                    },
                    "<": {
                        font: "main",
                        group: "rel"
                    },
                    ">": {
                        font: "main",
                        group: "rel"
                    },
                    ":": {
                        font: "main",
                        group: "rel"
                    },
                    "\\approx": {
                        font: "main",
                        group: "rel",
                        replace: "\u2248"
                    },
                    "\\cong": {
                        font: "main",
                        group: "rel",
                        replace: "\u2245"
                    },
                    "\\ge": {
                        font: "main",
                        group: "rel",
                        replace: "\u2265"
                    },
                    "\\geq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2265"
                    },
                    "\\gets": {
                        font: "main",
                        group: "rel",
                        replace: "\u2190"
                    },
                    "\\in": {
                        font: "main",
                        group: "rel",
                        replace: "\u2208"
                    },
                    "\\notin": {
                        font: "main",
                        group: "rel",
                        replace: "\u2209"
                    },
                    "\\subset": {
                        font: "main",
                        group: "rel",
                        replace: "\u2282"
                    },
                    "\\supset": {
                        font: "main",
                        group: "rel",
                        replace: "\u2283"
                    },
                    "\\subseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2286"
                    },
                    "\\supseteq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2287"
                    },
                    "\\nsubseteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2288"
                    },
                    "\\nsupseteq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2289"
                    },
                    "\\models": {
                        font: "main",
                        group: "rel",
                        replace: "\u22a8"
                    },
                    "\\leftarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2190"
                    },
                    "\\le": {
                        font: "main",
                        group: "rel",
                        replace: "\u2264"
                    },
                    "\\leq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2264"
                    },
                    "\\ne": {
                        font: "main",
                        group: "rel",
                        replace: "\u2260"
                    },
                    "\\neq": {
                        font: "main",
                        group: "rel",
                        replace: "\u2260"
                    },
                    "\\rightarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2192"
                    },
                    "\\to": {
                        font: "main",
                        group: "rel",
                        replace: "\u2192"
                    },
                    "\\ngeq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2271"
                    },
                    "\\nleq": {
                        font: "ams",
                        group: "rel",
                        replace: "\u2270"
                    },
                    "\\!": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\ ": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    "~": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    "\\,": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\:": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\;": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\enspace": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\qquad": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\quad": {
                        font: "main",
                        group: "spacing"
                    },
                    "\\space": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    ",": {
                        font: "main",
                        group: "punct"
                    },
                    ";": {
                        font: "main",
                        group: "punct"
                    },
                    "\\colon": {
                        font: "main",
                        group: "punct",
                        replace: ":"
                    },
                    "\\barwedge": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22bc"
                    },
                    "\\veebar": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22bb"
                    },
                    "\\odot": {
                        font: "main",
                        group: "bin",
                        replace: "\u2299"
                    },
                    "\\oplus": {
                        font: "main",
                        group: "bin",
                        replace: "\u2295"
                    },
                    "\\otimes": {
                        font: "main",
                        group: "bin",
                        replace: "\u2297"
                    },
                    "\\partial": {
                        font: "main",
                        group: "textord",
                        replace: "\u2202"
                    },
                    "\\oslash": {
                        font: "main",
                        group: "bin",
                        replace: "\u2298"
                    },
                    "\\circledcirc": {
                        font: "ams",
                        group: "bin",
                        replace: "\u229a"
                    },
                    "\\boxdot": {
                        font: "ams",
                        group: "bin",
                        replace: "\u22a1"
                    },
                    "\\bigtriangleup": {
                        font: "main",
                        group: "bin",
                        replace: "\u25b3"
                    },
                    "\\bigtriangledown": {
                        font: "main",
                        group: "bin",
                        replace: "\u25bd"
                    },
                    "\\dagger": {
                        font: "main",
                        group: "bin",
                        replace: "\u2020"
                    },
                    "\\diamond": {
                        font: "main",
                        group: "bin",
                        replace: "\u22c4"
                    },
                    "\\star": {
                        font: "main",
                        group: "bin",
                        replace: "\u22c6"
                    },
                    "\\triangleleft": {
                        font: "main",
                        group: "bin",
                        replace: "\u25c3"
                    },
                    "\\triangleright": {
                        font: "main",
                        group: "bin",
                        replace: "\u25b9"
                    },
                    "\\{": {
                        font: "main",
                        group: "open",
                        replace: "{"
                    },
                    "\\}": {
                        font: "main",
                        group: "close",
                        replace: "}"
                    },
                    "\\lbrace": {
                        font: "main",
                        group: "open",
                        replace: "{"
                    },
                    "\\rbrace": {
                        font: "main",
                        group: "close",
                        replace: "}"
                    },
                    "\\lbrack": {
                        font: "main",
                        group: "open",
                        replace: "["
                    },
                    "\\rbrack": {
                        font: "main",
                        group: "close",
                        replace: "]"
                    },
                    "\\lfloor": {
                        font: "main",
                        group: "open",
                        replace: "\u230a"
                    },
                    "\\rfloor": {
                        font: "main",
                        group: "close",
                        replace: "\u230b"
                    },
                    "\\lceil": {
                        font: "main",
                        group: "open",
                        replace: "\u2308"
                    },
                    "\\rceil": {
                        font: "main",
                        group: "close",
                        replace: "\u2309"
                    },
                    "\\backslash": {
                        font: "main",
                        group: "textord",
                        replace: "\\"
                    },
                    "|": {
                        font: "main",
                        group: "textord",
                        replace: "\u2223"
                    },
                    "\\vert": {
                        font: "main",
                        group: "textord",
                        replace: "\u2223"
                    },
                    "\\|": {
                        font: "main",
                        group: "textord",
                        replace: "\u2225"
                    },
                    "\\Vert": {
                        font: "main",
                        group: "textord",
                        replace: "\u2225"
                    },
                    "\\uparrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2191"
                    },
                    "\\Uparrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d1"
                    },
                    "\\downarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2193"
                    },
                    "\\Downarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d3"
                    },
                    "\\updownarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u2195"
                    },
                    "\\Updownarrow": {
                        font: "main",
                        group: "rel",
                        replace: "\u21d5"
                    },
                    "\\coprod": {
                        font: "math",
                        group: "op",
                        replace: "\u2210"
                    },
                    "\\bigvee": {
                        font: "math",
                        group: "op",
                        replace: "\u22c1"
                    },
                    "\\bigwedge": {
                        font: "math",
                        group: "op",
                        replace: "\u22c0"
                    },
                    "\\biguplus": {
                        font: "math",
                        group: "op",
                        replace: "\u2a04"
                    },
                    "\\bigcap": {
                        font: "math",
                        group: "op",
                        replace: "\u22c2"
                    },
                    "\\bigcup": {
                        font: "math",
                        group: "op",
                        replace: "\u22c3"
                    },
                    "\\int": {
                        font: "math",
                        group: "op",
                        replace: "\u222b"
                    },
                    "\\intop": {
                        font: "math",
                        group: "op",
                        replace: "\u222b"
                    },
                    "\\iint": {
                        font: "math",
                        group: "op",
                        replace: "\u222c"
                    },
                    "\\iiint": {
                        font: "math",
                        group: "op",
                        replace: "\u222d"
                    },
                    "\\prod": {
                        font: "math",
                        group: "op",
                        replace: "\u220f"
                    },
                    "\\sum": {
                        font: "math",
                        group: "op",
                        replace: "\u2211"
                    },
                    "\\bigotimes": {
                        font: "math",
                        group: "op",
                        replace: "\u2a02"
                    },
                    "\\bigoplus": {
                        font: "math",
                        group: "op",
                        replace: "\u2a01"
                    },
                    "\\bigodot": {
                        font: "math",
                        group: "op",
                        replace: "\u2a00"
                    },
                    "\\oint": {
                        font: "math",
                        group: "op",
                        replace: "\u222e"
                    },
                    "\\bigsqcup": {
                        font: "math",
                        group: "op",
                        replace: "\u2a06"
                    },
                    "\\smallint": {
                        font: "math",
                        group: "op",
                        replace: "\u222b"
                    },
                    "\\ldots": {
                        font: "main",
                        group: "inner",
                        replace: "\u2026"
                    },
                    "\\cdots": {
                        font: "main",
                        group: "inner",
                        replace: "\u22ef"
                    },
                    "\\ddots": {
                        font: "main",
                        group: "inner",
                        replace: "\u22f1"
                    },
                    "\\vdots": {
                        font: "main",
                        group: "textord",
                        replace: "\u22ee"
                    },
                    "\\acute": {
                        font: "main",
                        group: "accent",
                        replace: "\xb4"
                    },
                    "\\grave": {
                        font: "main",
                        group: "accent",
                        replace: "`"
                    },
                    "\\ddot": {
                        font: "main",
                        group: "accent",
                        replace: "\xa8"
                    },
                    "\\tilde": {
                        font: "main",
                        group: "accent",
                        replace: "~"
                    },
                    "\\bar": {
                        font: "main",
                        group: "accent",
                        replace: "\xaf"
                    },
                    "\\breve": {
                        font: "main",
                        group: "accent",
                        replace: "\u02d8"
                    },
                    "\\check": {
                        font: "main",
                        group: "accent",
                        replace: "\u02c7"
                    },
                    "\\hat": {
                        font: "main",
                        group: "accent",
                        replace: "^"
                    },
                    "\\vec": {
                        font: "main",
                        group: "accent",
                        replace: "\u20d7"
                    },
                    "\\dot": {
                        font: "main",
                        group: "accent",
                        replace: "\u02d9"
                    },
                    "\\imath": {
                        font: "main",
                        group: "mathord",
                        replace: "\u0131"
                    },
                    "\\jmath": {
                        font: "main",
                        group: "mathord",
                        replace: "\u0237"
                    }
                },
                text: {
                    "\\ ": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    " ": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    },
                    "~": {
                        font: "main",
                        group: "spacing",
                        replace: "\xa0"
                    }
                }
            };
            var a = '0123456789/@."';
            for (var r = 0; r < a.length; r++) {
                var l = a.charAt(r);
                h.math[l] = {
                    font: "main",
                    group: "textord"
                }
            }
            var s = "0123456789`!@*()-=+[]'\";:?/.,";
            for (var r = 0; r < s.length; r++) {
                var l = s.charAt(r);
                h.text[l] = {
                    font: "main",
                    group: "textord"
                }
            }
            var p = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var r = 0; r < p.length; r++) {
                var l = p.charAt(r);
                h.math[l] = {
                    font: "main",
                    group: "mathord"
                };
                h.text[l] = {
                    font: "main",
                    group: "textord"
                }
            }
            t.exports = h
        }, {}],
        23: [function(e, t, i) {
            var h = Array.prototype.indexOf;
            var a = function(e, t) {
                if (e == null) {
                    return -1
                }
                if (h && e.indexOf === h) {
                    return e.indexOf(t)
                }
                var i = 0,
                    a = e.length;
                for (; i < a; i++) {
                    if (e[i] === t) {
                        return i
                    }
                }
                return -1
            };
            var r = function(e, t) {
                return a(e, t) !== -1
            };
            var l = function(e, t) {
                return e === undefined ? t : e
            };
            var s = /([A-Z])/g;
            var p = function(e) {
                return e.replace(s, "-$1").toLowerCase()
            };
            var c = {
                "&": "&amp;",
                ">": "&gt;",
                "<": "&lt;",
                '"': "&quot;",
                "'": "&#x27;"
            };
            var n = /[&><"']/g;

            function o(e) {
                return c[e]
            }

            function g(e) {
                return ("" + e).replace(n, o)
            }
            var d;
            if (typeof document !== "undefined") {
                var w = document.createElement("span");
                if ("textContent" in w) {
                    d = function(e, t) {
                        e.textContent = t
                    }
                } else {
                    d = function(e, t) {
                        e.innerText = t
                    }
                }
            }

            function u(e) {
                d(e, "")
            }
            t.exports = {
                contains: r,
                deflt: l,
                escape: g,
                hyphenate: p,
                indexOf: a,
                setTextContent: d,
                clearNode: u
            }
        }, {}]
    }, {}, [1])(1)
});