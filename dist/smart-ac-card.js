/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, Q = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let At = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ct.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ct.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ft = (i) => new At(typeof i == "string" ? i : i + "", void 0, tt), V = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new At(e, i, tt);
}, Nt = (i, t) => {
  if (Q) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = I.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, lt = Q ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Ft(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: zt, defineProperty: Ut, getOwnPropertyDescriptor: Ht, getOwnPropertyNames: Mt, getOwnPropertySymbols: Dt, getPrototypeOf: It } = Object, L = globalThis, dt = L.trustedTypes, Rt = dt ? dt.emptyScript : "", jt = L.reactiveElementPolyfillSupport, O = (i, t) => i, R = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Rt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, et = (i, t) => !zt(i, t), ut = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: et };
Symbol.metadata ??= Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ut) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Ut(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: r } = Ht(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: n, set(a) {
      const o = n?.call(this);
      r?.call(this, a), this.requestUpdate(t, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = It(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const e = this.properties, s = [...Mt(e), ...Dt(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(lt(n));
    } else t !== void 0 && e.push(lt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Nt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : R).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const r = s.getPropertyOptions(n), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : R;
      this._$Em = n;
      const o = a.fromAttribute(e, r.type);
      this[n] = o ?? this._$Ej?.get(n) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, r) {
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (r = this[t]), s ??= a.getPropertyOptions(t), !((s.hasChanged ?? et)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: r }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, r] of s) {
        const { wrapped: a } = r, o = this[n];
        a !== !0 || this._$AL.has(n) || o === void 0 || this.C(n, void 0, r, o);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[O("elementProperties")] = /* @__PURE__ */ new Map(), A[O("finalized")] = /* @__PURE__ */ new Map(), jt?.({ ReactiveElement: A }), (L.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = globalThis, ht = (i) => i, j = it.trustedTypes, pt = j ? j.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, St = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Et = "?" + v, Vt = `<${Et}>`, w = document, P = () => w.createComment(""), B = (i) => i === null || typeof i != "object" && typeof i != "function", st = Array.isArray, Lt = (i) => st(i) || typeof i?.[Symbol.iterator] == "function", Y = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _t = /-->/g, mt = />/g, b = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, gt = /"/g, Ct = /^(?:script|style|textarea|title)$/i, Wt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), d = Wt(1), C = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), y = w.createTreeWalker(w, 129);
function kt(i, t) {
  if (!st(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pt !== void 0 ? pt.createHTML(t) : t;
}
const qt = (i, t) => {
  const e = i.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = T;
  for (let o = 0; o < e; o++) {
    const c = i[o];
    let l, _, p = -1, m = 0;
    for (; m < c.length && (a.lastIndex = m, _ = a.exec(c), _ !== null); ) m = a.lastIndex, a === T ? _[1] === "!--" ? a = _t : _[1] !== void 0 ? a = mt : _[2] !== void 0 ? (Ct.test(_[2]) && (n = RegExp("</" + _[2], "g")), a = b) : _[3] !== void 0 && (a = b) : a === b ? _[0] === ">" ? (a = n ?? T, p = -1) : _[1] === void 0 ? p = -2 : (p = a.lastIndex - _[2].length, l = _[1], a = _[3] === void 0 ? b : _[3] === '"' ? gt : ft) : a === gt || a === ft ? a = b : a === _t || a === mt ? a = T : (a = b, n = void 0);
    const g = a === b && i[o + 1].startsWith("/>") ? " " : "";
    r += a === T ? c + Vt : p >= 0 ? (s.push(l), c.slice(0, p) + St + c.slice(p) + v + g) : c + v + (p === -2 ? o : g);
  }
  return [kt(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class F {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let r = 0, a = 0;
    const o = t.length - 1, c = this.parts, [l, _] = qt(t, e);
    if (this.el = F.createElement(l, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = y.nextNode()) !== null && c.length < o; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(St)) {
          const m = _[a++], g = n.getAttribute(p).split(v), M = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: r, name: M[2], strings: g, ctor: M[1] === "." ? Jt : M[1] === "?" ? Yt : M[1] === "@" ? Gt : W }), n.removeAttribute(p);
        } else p.startsWith(v) && (c.push({ type: 6, index: r }), n.removeAttribute(p));
        if (Ct.test(n.tagName)) {
          const p = n.textContent.split(v), m = p.length - 1;
          if (m > 0) {
            n.textContent = j ? j.emptyScript : "";
            for (let g = 0; g < m; g++) n.append(p[g], P()), y.nextNode(), c.push({ type: 2, index: ++r });
            n.append(p[m], P());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Et) c.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(v, p + 1)) !== -1; ) c.push({ type: 7, index: r }), p += v.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = w.createElement("template");
    return s.innerHTML = t, s;
  }
}
function k(i, t, e = i, s) {
  if (t === C) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = B(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = k(i, n._$AS(i, t.values), n, s)), t;
}
class Kt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? w).importNode(e, !0);
    y.currentNode = n;
    let r = y.nextNode(), a = 0, o = 0, c = s[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let l;
        c.type === 2 ? l = new z(r, r.nextSibling, this, t) : c.type === 1 ? l = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (l = new Zt(r, this, t)), this._$AV.push(l), c = s[++o];
      }
      a !== c?.index && (r = y.nextNode(), a++);
    }
    return y.currentNode = w, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = k(this, t, e), B(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && B(this._$AH) ? this._$AA.nextSibling.data = t : this.T(w.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = F.createElement(kt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const r = new Kt(n, this), a = r.u(this.options);
      r.p(e), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = vt.get(t.strings);
    return e === void 0 && vt.set(t.strings, e = new F(t)), e;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const r of t) n === e.length ? e.push(s = new z(this.O(P()), this.O(P()), this, this.options)) : s = e[n], s._$AI(r), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = ht(t).nextSibling;
      ht(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, r) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, n) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = k(this, t, e, 0), a = !B(t) || t !== this._$AH && t !== C, a && (this._$AH = t);
    else {
      const o = t;
      let c, l;
      for (t = r[0], c = 0; c < r.length - 1; c++) l = k(this, o[s + c], e, c), l === C && (l = this._$AH[c]), a ||= !B(l) || l !== this._$AH[c], l === u ? t = u : t !== u && (t += (l ?? "") + r[c + 1]), this._$AH[c] = l;
    }
    a && !n && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Yt extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Gt extends W {
  constructor(t, e, s, n, r) {
    super(t, e, s, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? u) === C) return;
    const s = this._$AH, n = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== u && (s === u || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const Xt = it.litHtmlPolyfillSupport;
Xt?.(F, z), (it.litHtmlVersions ??= []).push("3.3.3");
const Qt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = n = new z(t.insertBefore(P(), r), r, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = globalThis;
class $ extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Qt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return C;
  }
}
$._$litElement$ = !0, $.finalized = !0, nt.litElementHydrateSupport?.({ LitElement: $ });
const te = nt.litElementPolyfillSupport;
te?.({ LitElement: $ });
(nt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: et }, ie = (i = ee, t, e) => {
  const { kind: s, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), r.set(e.name, i), s === "accessor") {
    const { name: a } = e;
    return { set(o) {
      const c = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(a, c, i, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, i, o), o;
    } };
  }
  if (s === "setter") {
    const { name: a } = e;
    return function(o) {
      const c = this[a];
      t.call(this, o), this.requestUpdate(a, c, i, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function se(i) {
  return (t, e) => typeof e == "object" ? ie(i, t, e) : ((s, n, r) => {
    const a = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(i) {
  return se({ ...i, state: !0, attribute: !1 });
}
async function ne(i, t) {
  if (!t)
    return;
  const e = Array.isArray(t) ? t : [t];
  for (const s of e)
    await re(i, s);
}
async function re(i, t) {
  const e = t.perform_action ?? t.service ?? t.action;
  if (!(t.action === "call-service" || t.action === "perform-action" || e.includes(".")) || !e.includes("."))
    throw new Error(`Invalid action "${t.action}". Expected "domain.service".`);
  const [n, r] = e.split(".", 2), a = { ...t.data ?? t.service_data ?? {} }, o = t.target?.entity_id;
  o !== void 0 && a.entity_id === void 0 && (a.entity_id = o), n === "script" && r === "turn_on" && ae(a), await i.callService(n, r, a, t.target);
}
function ae(i) {
  const t = Object.keys(i).filter(
    (e) => e !== "entity_id" && e !== "variables"
  );
  t.length !== 0 && (i.variables = {
    ...typeof i.variables == "object" && i.variables ? i.variables : {},
    ...Object.fromEntries(t.map((e) => [e, i[e]]))
  }, t.forEach((e) => {
    delete i[e];
  }));
}
const U = "smart-ac-card", oe = "0.4.2", Ot = "smart-ac-card-editor", rt = "smart-ac-card-dialog", Pt = {
  off: "var(--disabled-text-color)",
  cool: "#2196f3",
  heat: "#ff7043",
  fan: "#26a69a",
  dry: "#7e57c2",
  auto: "#66bb6a",
  sleep: "#5c6bc0",
  boost: "#ffb300",
  eco: "#43a047",
  online: "var(--primary-color)",
  offline: "var(--error-color)",
  unknown: "var(--secondary-text-color)",
  window_open: "var(--warning-color, #ff9800)",
  feature_active: "var(--warning-color, #ff9800)",
  feature_inactive: "var(--disabled-text-color)",
  button_background: "var(--ha-card-background, var(--card-background-color))",
  button_text: "var(--primary-text-color)"
}, at = {
  power: "mdi:power",
  off: "mdi:power-off",
  cool: "mdi:snowflake",
  heat: "mdi:fire",
  sleep: "mdi:weather-night",
  fan: "mdi:fan",
  dry: "mdi:water-percent",
  auto: "mdi:autorenew",
  swing_vertical: "mdi:arrow-up-down",
  display: "mdi:monitor",
  buzzer: "mdi:bell-ring",
  settings: "mdi:cog",
  window_open: "mdi:window-open-variant",
  window_closed: "mdi:window-closed-variant"
}, Bt = [
  { state: ["off", "aus"], status: "off" },
  { state: ["cool", "cooling", "kühlen", "kuehlen"], status: "cool" },
  { state: ["heat", "heating", "heizen"], status: "heat" },
  { state: ["fan", "fan_only", "lüfter", "luefter"], status: "fan" },
  { state: ["dry", "dehumidify", "entfeuchten"], status: "dry" },
  { state: ["auto", "automatik"], status: "auto" },
  { state: ["sleep", "night", "nachtmodus"], status: "sleep" },
  { state: ["boost", "turbo"], status: "boost" },
  { state: ["eco", "economy"], status: "eco" },
  { state: ["unavailable", "offline"], status: "offline" }
], S = [
  { id: "power_on", name: "On", icon: "mdi:power" },
  { id: "power_off", name: "Off", icon: "mdi:power-off" },
  { id: "cool", name: "Cool", icon: "mdi:snowflake" },
  { id: "heat", name: "Heat", icon: "mdi:fire" },
  { id: "sleep", name: "Night", icon: "mdi:weather-night" },
  { id: "swing_vertical", name: "Swing V", icon: "mdi:arrow-up-down" },
  { id: "fan", name: "Fan", icon: "mdi:fan" },
  { id: "display", name: "Display", icon: "mdi:monitor" },
  { id: "buzzer", name: "Buzzer", icon: "mdi:bell-ring" }
], Z = {
  power_on: "power_on_action",
  power_off: "power_off_action",
  cool: "cool_action",
  heat: "heat_action",
  sleep: "sleep_action",
  swing_vertical: "swing_vertical_action",
  fan: "fan_action",
  display: "display_action",
  buzzer: "buzzer_action"
}, bt = {
  enabled: !0,
  cool: !0,
  heat: !0,
  fan: !0,
  swing: !0,
  sleep: !0
};
function ce(i) {
  if (!i || typeof i != "object")
    throw new Error("Invalid Smart AC Card configuration.");
  if (!i.temperature_entity)
    throw new Error("Smart AC Card requires temperature_entity.");
  return {
    ...i,
    type: i.type || `custom:${U}`,
    buttons: de(i),
    colors: { ...Pt, ...i.colors },
    icons: { ...at, ...i.icons },
    status_map: i.status_map ?? Bt
  };
}
function le(i) {
  return typeof i == "boolean" ? { ...bt, enabled: i } : { ...bt, ...i ?? {} };
}
function yt(i, t) {
  if (t.action)
    return t.action;
  const e = t.id;
  if (!(!e || !(e in Z)))
    return i[Z[e]];
}
function de(i) {
  const t = i.buttons ?? [], e = new Map(t.filter((n) => n.id).map((n) => [n.id, n]));
  return [...S.map((n) => {
    const r = e.get(n.id), a = r?.visible ?? n.visible ?? !0;
    return { ...n, ...r, visible: a };
  }), ...t.filter((n) => !n.id)];
}
function ue(i) {
  const t = {
    off: "Off",
    cool: "Cooling",
    heat: "Heating",
    fan: "Fan",
    dry: "Dry",
    auto: "Automatic",
    sleep: "Night",
    boost: "Boost",
    eco: "Eco",
    online: "Online",
    offline: "Offline",
    unknown: "Unknown"
  };
  return t[i] ?? t.unknown;
}
function E(i, t, e, s) {
  const n = new CustomEvent(t, {
    bubbles: !0,
    cancelable: !1,
    composed: !0,
    detail: e
  });
  return i.dispatchEvent(n), n;
}
function q(i, t) {
  return t ? i.states[t] : void 0;
}
function he(i, t, e) {
  const s = q(i, t);
  if (!s)
    return "--";
  const n = i.formatEntityState?.(s) ?? s.state, r = e ?? s.attributes.unit_of_measurement ?? "";
  return r && !n.includes(r) ? `${n}${r}` : n;
}
function pe(i, t) {
  const e = X(i, t);
  if (e === void 0)
    return;
  const n = q(i, t.target_temperature_entity ?? t.status_entity)?.attributes.unit_of_measurement ?? "°C";
  return `${e}${n}`;
}
function X(i, t) {
  const e = t.target_temperature_entity ?? t.status_entity, s = q(i, e);
  if (!e || !s)
    return;
  const n = t.target_temperature_attribute ?? "temperature", r = n === "state" ? s.state : s.attributes[n];
  if (r == null || r === "")
    return;
  const a = Number(r);
  return Number.isFinite(a) ? a : void 0;
}
function $t(i, t) {
  const e = q(i, t.status_entity);
  if (!t.status_entity || !e)
    return "unknown";
  const s = String(
    t.status_attribute ? e.attributes[t.status_attribute] : e.state
  ).toLowerCase(), n = t.status_map ?? Bt;
  for (const r of n)
    if ((Array.isArray(r.state) ? r.state : [r.state]).map((o) => o.toLowerCase()).includes(s))
      return r.status;
  return e.state === "unavailable" || e.state === "unknown" ? "offline" : "online";
}
function _e() {
  return Promise.resolve().then(() => Ee);
}
function me(i, t, e) {
  E(i, "show-dialog", {
    dialogTag: rt,
    dialogImport: _e,
    dialogParams: { hass: t, config: e }
  });
}
function fe(i, t) {
  Object.entries(t).forEach(([e, s]) => {
    s && i.style.setProperty(e, s);
  });
}
function G(i) {
  return JSON.parse(JSON.stringify(i));
}
function D(i, t, e) {
  return i.icons?.[t] ?? at[t] ?? e ?? "mdi:circle";
}
const wt = {
  en: {
    room: "Room",
    name: "AC name",
    temperature_entity: "Temperature entity",
    status_entity: "Status entity",
    status_attribute: "Status attribute",
    settings: "Settings",
    helpers: "Helpers",
    cool_temperature: "Default cooling temperature",
    heat_temperature: "Default heating temperature",
    autostart: "Autostart active",
    autostart_time: "Autostart time",
    sleep_auto: "Automatic sleep mode",
    sleep_time: "Sleep mode time",
    no_helpers: "No helpers configured",
    actions_hint: "Actions can be edited in YAML.",
    starts_at: "Starts at",
    sleep_starts_at: "Night mode starts at",
    window_open: "Window open",
    window_closed: "Window closed",
    window_is_open: "Window is open"
  },
  de: {
    room: "Raum",
    name: "Klimageraetname",
    temperature_entity: "Temperatur-Entity",
    status_entity: "Status-Entity",
    status_attribute: "Status-Attribut",
    settings: "Einstellungen",
    helpers: "Helfer",
    cool_temperature: "Standardtemperatur Kuehlen",
    heat_temperature: "Standardtemperatur Heizen",
    autostart: "Autostart aktiv",
    autostart_time: "Autostart Uhrzeit",
    sleep_auto: "Schlafmodus automatisch",
    sleep_time: "Schlafmodus Uhrzeit",
    no_helpers: "Keine Helfer konfiguriert",
    actions_hint: "Actions koennen in YAML bearbeitet werden.",
    starts_at: "Startet um",
    sleep_starts_at: "Nachtmodus wird aktiviert um",
    window_open: "Fenster geoeffnet",
    window_closed: "Fenster geschlossen",
    window_is_open: "Fenster ist geoeffnet"
  }
};
function h(i, t) {
  const s = (i?.locale?.language ?? i?.language ?? "en").split("-")[0] ?? "en";
  return wt[s]?.[t] ?? wt.en?.[t] ?? t;
}
const ge = V`
  @keyframes smart-ac-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes smart-ac-pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.82;
    }
    50% {
      transform: scale(1.12);
      opacity: 1;
    }
  }

  @keyframes smart-ac-glow {
    0%,
    100% {
      filter: drop-shadow(0 0 0 transparent);
    }
    50% {
      filter: drop-shadow(0 0 10px var(--smart-ac-active-color));
    }
  }

  @keyframes smart-ac-swing {
    0%,
    100% {
      transform: translateY(-2px);
    }
    50% {
      transform: translateY(2px);
    }
  }

  .animate-cool ha-icon,
  .animate-fan ha-icon {
    animation: smart-ac-spin var(--smart-ac-animation-speed, 8s) linear infinite;
  }

  .animate-heat ha-icon {
    animation: smart-ac-pulse 2.4s ease-in-out infinite;
  }

  .animate-sleep ha-icon {
    animation: smart-ac-glow 3.6s ease-in-out infinite;
  }

  .animate-swing ha-icon {
    animation: smart-ac-swing 1.8s ease-in-out infinite;
  }
`, ve = [
  ge,
  V`
    :host {
      display: block;
      --smart-ac-border-radius: var(--ha-card-border-radius, 12px);
      --smart-ac-card-padding: 18px;
      --smart-ac-gap: 12px;
      --smart-ac-button-radius: 10px;
      --smart-ac-active-color: var(--primary-color);
      --smart-ac-active-tint: color-mix(in srgb, var(--smart-ac-active-color) 14%, transparent);
      --smart-ac-button-background: var(--ha-card-background, var(--card-background-color));
      --smart-ac-button-text: var(--primary-text-color);
    }

    ha-card {
      overflow: hidden;
      border-radius: var(--smart-ac-border-radius);
      background:
        linear-gradient(135deg, var(--smart-ac-active-tint), transparent 58%),
        var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      transition:
        background 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
    }

    .wrap {
      padding: var(--smart-ac-card-padding);
    }

    .header {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
      align-items: start;
      min-height: 42px;
    }

    .room {
      font-size: 0.92rem;
      color: var(--secondary-text-color);
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .name {
      margin-top: 3px;
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    .settings-button {
      appearance: none;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      inline-size: 42px;
      block-size: 42px;
      display: inline-grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .settings-button:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .settings-button ha-icon {
      --mdc-icon-size: 24px;
    }

    .window-indicator {
      appearance: none;
      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);
      inline-size: 42px;
      block-size: 42px;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--secondary-text-color);
      display: inline-grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .window-indicator.open {
      color: var(--smart-ac-window-open-color, var(--warning-color, #ff9800));
      background: color-mix(in srgb, var(--smart-ac-window-open-color, var(--warning-color, #ff9800)) 12%, transparent);
    }

    .window-indicator:hover {
      background: var(--secondary-background-color);
    }

    .window-indicator ha-icon {
      --mdc-icon-size: 24px;
    }

    .temperature-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
      align-items: end;
      margin-top: 18px;
    }

    .temperature {
      font-size: clamp(2.8rem, 9vw, 4.7rem);
      line-height: 0.95;
      font-weight: 650;
      letter-spacing: 0;
      font-variant-numeric: tabular-nums;
    }

    .temperature-button {
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--primary-text-color);
      padding: 0;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
    }

    .temperature-button:hover {
      color: var(--primary-color);
    }

    .status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      background: var(--smart-ac-active-tint);
      color: var(--smart-ac-active-color);
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .buttons {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--smart-ac-gap);
      margin-top: 18px;
    }

    .setpoint-row {
      margin-top: 16px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      min-height: 42px;
      border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    }

    .setpoint-label {
      color: var(--secondary-text-color);
      font-size: 0.82rem;
      font-weight: 700;
    }

    .setpoint-control {
      display: inline-grid;
      grid-template-columns: 34px minmax(72px, auto) 34px;
      gap: 6px;
      align-items: center;
    }

    .setpoint-button {
      appearance: none;
      width: 34px;
      height: 34px;
      border: 1px solid var(--divider-color);
      border-radius: 50%;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--smart-ac-active-color);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }

    .setpoint-button[disabled] {
      opacity: 0.45;
      cursor: default;
    }

    .setpoint-button ha-icon {
      --mdc-icon-size: 22px;
    }

    .setpoint-value {
      color: var(--primary-text-color);
      font-size: 1rem;
      font-weight: 800;
      text-align: center;
      white-space: nowrap;
    }

    :host([wide]) .buttons {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .button-cell {
      position: relative;
      min-width: 0;
      display: grid;
      gap: 6px;
    }

    .action-button {
      appearance: none;
      position: relative;
      width: 100%;
      border: 1px solid var(--divider-color);
      border-radius: var(--smart-ac-button-radius);
      background: var(--smart-ac-button-background);
      color: var(--smart-ac-button-text);
      min-height: 70px;
      padding: 10px 8px;
      display: grid;
      grid-template-rows: 28px auto;
      align-items: center;
      justify-items: center;
      gap: 6px;
      cursor: pointer;
      font: inherit;
      transition:
        transform 120ms ease,
        border-color 120ms ease,
        background 120ms ease;
    }

    .action-button:hover {
      border-color: var(--smart-ac-active-color);
      background: var(--smart-ac-active-tint);
    }

    .action-button[data-active] {
      border-color: var(--smart-ac-active-color);
      background: var(--smart-ac-button-active-background, var(--smart-ac-active-tint));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--smart-ac-active-color) 32%, transparent);
    }

    .action-button.feature-button[data-active] {
      border-color: var(--divider-color);
      background: var(--smart-ac-button-background);
      box-shadow: none;
    }

    .action-button.feature-button:hover {
      border-color: var(--divider-color);
      background: var(--smart-ac-button-background);
    }

    .action-button:active {
      transform: scale(0.985);
    }

    .action-button[disabled] {
      cursor: default;
      opacity: 0.45;
    }

    .action-button ha-icon {
      color: var(--smart-ac-button-color, var(--smart-ac-active-color));
      --mdc-icon-size: 27px;
      transform-origin: center;
    }

    .action-button.feature-button ha-icon {
      color: var(--smart-ac-feature-inactive-color, var(--disabled-text-color));
    }

    .action-button.feature-button[data-active] ha-icon {
      color: var(--smart-ac-feature-active-color, var(--warning-color, #ff9800));
    }

    .action-button.feature-button:not([data-active])::after {
      position: absolute;
      top: 25px;
      width: 34px;
      height: 2px;
      content: "";
      background: var(--smart-ac-feature-inactive-color, var(--disabled-text-color));
      border-radius: 1px;
      transform: rotate(-45deg);
      pointer-events: none;
    }

    .action-label {
      max-width: 100%;
      color: var(--smart-ac-button-text);
      font-size: 0.84rem;
      font-weight: 600;
      line-height: 1.2;
      text-align: center;
      overflow-wrap: anywhere;
    }

    .button-select {
      width: 100%;
      min-height: 36px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      padding: 0 8px;
      font: inherit;
      font-size: 0.84rem;
    }

    .compact .buttons {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .compact .action-button {
      min-height: 58px;
      grid-template-rows: 24px auto;
    }

    .version {
      margin-top: 10px;
      color: var(--secondary-text-color);
      font-size: 0.66rem;
      line-height: 1;
      text-align: right;
      opacity: 0.62;
      user-select: none;
    }

    .schedule-hint {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      line-height: 1.3;
      text-align: left;
    }

    @media (max-width: 420px) {
      .wrap {
        padding: 16px;
      }

      .temperature-row {
        grid-template-columns: 1fr;
        align-items: start;
      }

      .buttons,
      :host([wide]) .buttons {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `
], be = V`
  ha-dialog {
    --mdc-dialog-min-width: min(560px, calc(100vw - 24px));
    --mdc-dialog-max-width: min(640px, calc(100vw - 24px));
  }

  .content {
    width: 100%;
    max-width: 592px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .section {
    padding: 6px 0;
  }

  .section-title {
    margin: 18px 0 8px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .entity-row {
    min-height: 52px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    gap: 14px;
    align-items: center;
    border-top: 1px solid var(--divider-color);
    max-width: 100%;
  }

  .helper-label {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 14px;
  }

  .helper-label ha-icon {
    color: var(--state-icon-color);
    --mdc-icon-size: 22px;
  }

  .helper-label span {
    overflow-wrap: anywhere;
  }

  .helper-control {
    min-width: 0;
    max-width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .number-input,
  .time-input,
  .select-input {
    min-height: 36px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    padding: 0 8px;
    font: inherit;
  }

  .number-input {
    width: min(96px, 100%);
  }

  .time-control {
    display: inline-grid;
    grid-template-columns: 30px minmax(0, 96px) 30px;
    gap: 6px;
    align-items: center;
    max-width: 100%;
  }

  .step-button,
  .press-button {
    min-height: 34px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
  }

  .step-button {
    width: 30px;
    padding: 0;
    line-height: 1;
  }

  .step-button ha-icon {
    --mdc-icon-size: 18px;
  }

  .press-button {
    padding: 0 12px;
  }

  .state-value,
  .missing {
    color: var(--secondary-text-color);
  }

  .empty {
    color: var(--secondary-text-color);
    padding: 12px 0;
  }

  @media (max-width: 520px) {
    .entity-row {
      grid-template-columns: 1fr;
      gap: 8px;
      padding: 10px 0;
    }

    .helper-control {
      justify-content: flex-start;
    }
  }
`, ye = V`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 16px;
  }

  ha-form {
    display: block;
  }

  .group {
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 14px;
    display: grid;
    gap: 12px;
  }

  .button-config {
    display: grid;
    gap: 10px;
    padding-block: 8px;
    border-top: 1px solid var(--divider-color);
  }

  .title {
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .hint {
    color: var(--secondary-text-color);
    font-size: 0.86rem;
  }

  .field {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) minmax(160px, 2fr);
    gap: 10px;
    align-items: center;
  }

  .field label {
    color: var(--secondary-text-color);
  }

  input[type="text"],
  input[type="color"],
  textarea {
    width: 100%;
    min-height: 40px;
    box-sizing: border-box;
  }

  textarea {
    resize: vertical;
    min-height: 72px;
    font-family: var(--code-font-family, monospace);
  }

  .action-editor {
    border-top: 1px solid var(--divider-color);
    padding-top: 12px;
    display: grid;
    gap: 10px;
  }

  .action-title {
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .interaction-list {
    display: grid;
    gap: 12px;
  }

  .interaction-item {
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--secondary-background-color);
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  .interaction-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-weight: 600;
  }

  .interaction-field {
    grid-template-columns: minmax(120px, 1fr) minmax(180px, 2fr);
  }

  .add-action,
  .remove-action {
    min-height: 34px;
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    font: inherit;
  }

  .add-action {
    justify-self: start;
    padding: 0 14px;
    background: color-mix(in srgb, var(--primary-color) 16%, transparent);
    color: var(--primary-color);
    font-weight: 700;
  }

  .remove-action {
    padding: 0 12px;
    background: transparent;
    color: var(--secondary-text-color);
  }

  .remove-action:hover {
    color: var(--error-color);
  }

  @media (max-width: 560px) {
    .field {
      grid-template-columns: 1fr;
    }
  }
`;
var $e = Object.defineProperty, we = Object.getOwnPropertyDescriptor, ot = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? we(t, e) : t, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = (s ? a(t, e, n) : a(n)) || n);
  return s && n && $e(t, e, n), n;
};
const xt = /* @__PURE__ */ new Set(["power_on", "power_off", "cool", "heat"]);
let N = class extends $ {
  set hass(i) {
    this._hass = i;
  }
  get hass() {
    return this._hass;
  }
  setConfig(i) {
    this._config = { ...i, type: i.type || `custom:${U}` };
  }
  render() {
    return this._config ? d`
      <div class="editor">
        <div class="group">
          <div class="title">Basics</div>
          ${this._textField("room", h(this._hass, "room"))}
          ${this._textField("name", h(this._hass, "name"))}
          ${this._entityField("temperature_entity", h(this._hass, "temperature_entity"))}
          ${this._entityField("window_entity", "Window entity")}
          ${this._textField("target_temperature_label", "Target temperature label", "Target")}
          ${this._entityField("target_temperature_entity", "Target temperature entity")}
          ${this._textField("target_temperature_attribute", "Target temperature attribute", "temperature")}
          ${this._numberField("target_temperature_step", "Target temperature step", 0.5)}
          ${this._entityField("status_entity", h(this._hass, "status_entity"))}
          ${this._textField("status_attribute", h(this._hass, "status_attribute"))}
        </div>

        <div class="group">
          <div class="title">Popup helpers</div>
          ${this._entityField("popup.cool_temperature_entity", h(this._hass, "cool_temperature"))}
          ${this._entityField("popup.heat_temperature_entity", h(this._hass, "heat_temperature"))}
          ${this._entityField("popup.autostart_entity", h(this._hass, "autostart"))}
          ${this._entityField("popup.autostart_time_entity", h(this._hass, "autostart_time"))}
          ${this._entityField("popup.sleep_auto_entity", h(this._hass, "sleep_auto"))}
          ${this._entityField("popup.sleep_time_entity", h(this._hass, "sleep_time"))}
        </div>

        <div class="group">
          <div class="title">Icons</div>
          ${Object.entries(at).map(
      ([i, t]) => this._iconField(`icons.${i}`, i.replaceAll("_", " "), String(t))
    )}
        </div>

        <div class="group">
          <div class="title">Colors</div>
          ${["cool", "heat", "off", "sleep", "online", "offline", "window_open", "feature_active", "feature_inactive"].map(
      (i) => this._colorField(`colors.${i}`, i, Pt[i])
    )}
          ${this._textField("colors.button_background", "button background")}
          ${this._textField("colors.button_text", "button text")}
        </div>

        <div class="group">
          <div class="title">Buttons</div>
          ${S.map((i) => this._buttonVisibilityField(i))}
        </div>

        <div class="group">
          <div class="title">Actions</div>
          ${S.map((i) => this._actionEditor(i))}
        </div>

        <div class="group">
          <div class="title">Options</div>
          ${this._checkboxField("animations", "Animations")}
          ${this._checkboxField("compact", "Compact layout")}
        </div>
      </div>
    ` : u;
  }
  _textField(i, t, e = "") {
    const s = this._get(i) ?? e;
    return d`
      <div class="field">
        <label>${t}</label>
        <input
          type="text"
          .value=${String(s)}
          @input=${(n) => this._valueChanged(i, n.currentTarget.value || void 0)}
        />
      </div>
    `;
  }
  _entityField(i, t) {
    const e = this._get(i);
    return d`
      <div class="field">
        <label>${t}</label>
        <ha-entity-picker
          .hass=${this._hass}
          .value=${e}
          allow-custom-entity
          @value-changed=${(s) => this._valueChanged(i, s.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
  }
  _iconField(i, t, e) {
    const s = this._get(i) ?? e;
    return d`
      <div class="field">
        <label>${t}</label>
        <ha-icon-picker
          .hass=${this._hass}
          .value=${s}
          @value-changed=${(n) => this._valueChanged(i, n.detail.value)}
        ></ha-icon-picker>
      </div>
    `;
  }
  _colorField(i, t, e) {
    const s = this._get(i) ?? e, n = /^#[0-9a-f]{6}$/i.test(s);
    return d`
      <div class="field">
        <label>${t}</label>
        <input
          type=${n ? "color" : "text"}
          .value=${s}
          @input=${(r) => this._valueChanged(i, r.currentTarget.value || void 0)}
        />
      </div>
    `;
  }
  _checkboxField(i, t) {
    return d`
      <div class="field">
        <label>${t}</label>
        <ha-switch
          .checked=${!!this._get(i)}
          @change=${(e) => this._valueChanged(i, e.currentTarget.checked)}
        ></ha-switch>
      </div>
    `;
  }
  _numberField(i, t, e) {
    const s = this._get(i) ?? e;
    return d`
      <div class="field">
        <label>${t}</label>
        <input
          type="number"
          step="0.1"
          .value=${String(s)}
          @input=${(n) => this._valueChanged(i, Number(n.currentTarget.value))}
        />
      </div>
    `;
  }
  _buttonVisibilityField(i) {
    const t = i.id;
    if (!t)
      return u;
    const e = xt.has(t);
    return d`
      <div class="button-config">
        <div class="field">
          <label>${i.name ?? t}</label>
          <input
            type="text"
            .value=${String(this._buttonValue(t, "name") ?? i.name ?? t)}
            @input=${(s) => this._setButtonField(t, "name", s.currentTarget.value)}
          />
        </div>
        <div class="field">
          <label>Visible</label>
          <ha-switch
            .checked=${e || this._buttonVisible(t)}
            .disabled=${e}
            @change=${(s) => this._setButtonVisible(t, s.currentTarget.checked)}
          ></ha-switch>
        </div>
        ${this._buttonSelectEntityField(t)}
      </div>
    `;
  }
  _buttonSelectEntityField(i) {
    if (i !== "fan" && i !== "swing_vertical")
      return u;
    const t = this._buttonValue(i, "select_entity");
    return d`
      <div class="field">
        <label>Select value entity</label>
        <ha-entity-picker
          .hass=${this._hass}
          .value=${t}
          allow-custom-entity
          @value-changed=${(e) => this._setButtonField(i, "select_entity", e.detail.value)}
        ></ha-entity-picker>
      </div>
    `;
  }
  _actionEditor(i) {
    const t = i.id;
    if (!t)
      return u;
    const e = Z[t], s = this._actionsFor(e), n = this._buttonValue(t, "status_entity"), r = this._buttonValue(t, "status_attribute"), a = this._buttonValue(t, "active_state");
    return d`
      <div class="action-editor">
        <div class="action-title">${this._buttonValue(t, "name") ?? i.name ?? t}</div>
        <div class="field">
          <label>Status entity</label>
          <ha-entity-picker
            .hass=${this._hass}
            .value=${n}
            allow-custom-entity
            @value-changed=${(o) => this._setButtonField(t, "status_entity", o.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="field">
          <label>Status attribute</label>
          <input
            type="text"
            .value=${r ?? ""}
            placeholder="state"
            @input=${(o) => this._setButtonField(t, "status_attribute", o.currentTarget.value)}
          />
        </div>
        <div class="field">
          <label>Active state</label>
          <input
            type="text"
            .value=${a ?? ""}
            placeholder="on"
            @input=${(o) => this._setButtonField(t, "active_state", o.currentTarget.value)}
          />
        </div>
        <div class="interaction-list">
          ${s.length === 0 ? d`<div class="hint">No interactions configured.</div>` : s.map(
      (o, c) => d`
                  <div class="interaction-item">
                    <div class="interaction-header">
                      <span>Interaction ${c + 1}</span>
                      <button class="remove-action" @click=${() => this._removeAction(e, c)}>
                        Remove
                      </button>
                    </div>
                    <hui-action-editor
                      .hass=${this._hass}
                      .config=${this._toHaAction(o)}
                      @config-changed=${(l) => this._setActionAt(e, c, l.detail.config)}
                      @value-changed=${(l) => this._setActionAt(e, c, l.detail.value)}
                      @action-changed=${(l) => this._setActionAt(e, c, l.detail.action)}
                    ></hui-action-editor>
                    <div class="field interaction-field">
                      <label>Action service</label>
                      <input
                        type="text"
                        placeholder="script.turn_on"
                        .value=${this._serviceAction(o)}
                        @input=${(l) => this._setActionService(
        e,
        c,
        l.currentTarget.value
      )}
                      />
                    </div>
                    <div class="field interaction-field">
                      <label>Target entity</label>
                      <ha-entity-picker
                        .hass=${this._hass}
                        .value=${this._targetEntity(o)}
                        allow-custom-entity
                        @value-changed=${(l) => this._setActionTarget(e, c, l.detail.value)}
                      ></ha-entity-picker>
                    </div>
                    <div class="field interaction-field">
                      <label>Data JSON</label>
                      <textarea
                        rows="3"
                        placeholder='{"temperature": 23}'
                        .value=${this._actionData(o)}
                        @change=${(l) => this._setActionData(
        e,
        c,
        l.currentTarget.value
      )}
                      ></textarea>
                    </div>
                  </div>
                `
    )}
          <button class="add-action" @click=${() => this._addAction(e)}>
            + Add interaction
          </button>
        </div>
      </div>
    `;
  }
  _buttonValue(i, t) {
    return this._config?.buttons?.find((e) => e.id === i)?.[t];
  }
  _setButtonField(i, t, e) {
    if (!this._config)
      return;
    const s = G(this._config), n = [...s.buttons ?? []], r = n.findIndex((c) => c.id === i), o = { ...S.find((c) => c.id === i) ?? { id: i }, ...r >= 0 ? n[r] : {}, id: i };
    e === void 0 || e === "" ? delete o[t] : o[t] = e, r >= 0 ? n[r] = o : n.push(o), s.buttons = n, this._config = s, E(this, "config-changed", { config: s });
  }
  _actionsFor(i) {
    const t = this._config?.[i];
    return Array.isArray(t) ? t : t && typeof t == "object" && "action" in t ? [t] : [];
  }
  _toHaAction(i) {
    return i.action === "call-service" || i.action === "perform-action" ? i : i.action.includes(".") ? {
      ...i,
      action: "perform-action",
      perform_action: i.action
    } : i;
  }
  _targetEntity(i) {
    const t = i.target?.entity_id;
    return typeof t == "string" ? t : void 0;
  }
  _serviceAction(i) {
    return i.perform_action ?? i.service ?? (i.action.includes(".") ? i.action : "");
  }
  _actionData(i) {
    const t = i.data ?? i.service_data;
    return t ? JSON.stringify(t, null, 2) : "";
  }
  _setActionTarget(i, t, e) {
    const s = this._actionsFor(i), n = { ...s[t] ?? { action: "perform-action" } };
    e ? n.target = { ...n.target ?? {}, entity_id: e } : delete n.target, s[t] = n, this._setActions(i, s);
  }
  _setActionService(i, t, e) {
    const s = this._actionsFor(i), n = { ...s[t] ?? { action: "perform-action" } }, r = e.trim();
    r ? (n.action = "perform-action", n.perform_action = r, delete n.service) : (n.action = "perform-action", delete n.perform_action, delete n.service), s[t] = n, this._setActions(i, s);
  }
  _setActionData(i, t, e) {
    const s = this._actionsFor(i), n = { ...s[t] ?? { action: "perform-action" } };
    e.trim() ? n.data = JSON.parse(e) : delete n.data, s[t] = n, this._setActions(i, s);
  }
  _addAction(i) {
    const t = this._actionsFor(i);
    this._setActions(i, [...t, { action: "perform-action" }]);
  }
  _removeAction(i, t) {
    const e = this._actionsFor(i).filter((s, n) => n !== t);
    this._setActions(i, e);
  }
  _setActionAt(i, t, e) {
    const s = this._actionsFor(i);
    if (!e) {
      this._removeAction(i, t);
      return;
    }
    s[t] = e, this._setActions(i, s);
  }
  _setActions(i, t) {
    if (t.length === 0) {
      this._valueChanged(i, void 0);
      return;
    }
    this._valueChanged(i, t.length === 1 ? t[0] : t);
  }
  _get(i) {
    return i.split(".").reduce((t, e) => t?.[e], this._config);
  }
  _buttonVisible(i) {
    const t = this._config?.buttons?.find((s) => s.id === i);
    if (t?.visible !== void 0)
      return t.visible;
    const e = S.find((s) => s.id === i);
    return e?.visible !== void 0 ? e.visible : !0;
  }
  _setButtonVisible(i, t) {
    if (!this._config || xt.has(i))
      return;
    const e = G(this._config), s = [...e.buttons ?? []], n = s.findIndex((o) => o.id === i), a = { ...S.find((o) => o.id === i) ?? { id: i }, ...n >= 0 ? s[n] : {}, id: i, visible: t };
    n >= 0 ? s[n] = a : s.push(a), e.buttons = s, this._config = e, E(this, "config-changed", { config: e });
  }
  _valueChanged(i, t) {
    if (!this._config)
      return;
    const e = G(this._config), s = i.split(".");
    let n = e;
    s.slice(0, -1).forEach((a) => {
      n[a] = n[a] ?? {}, n = n[a];
    });
    const r = s[s.length - 1];
    r && (t === void 0 || t === "" ? delete n[r] : n[r] = t, this._config = e, E(this, "config-changed", { config: e }));
  }
};
N.styles = ye;
ot([
  f()
], N.prototype, "_hass", 2);
ot([
  f()
], N.prototype, "_config", 2);
N = ot([
  Tt(Ot)
], N);
var xe = Object.defineProperty, K = (i, t, e, s) => {
  for (var n = void 0, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = a(t, e, n) || n);
  return n && xe(t, e, n), n;
};
class H extends $ {
  static {
    this.styles = ve;
  }
  set hass(t) {
    this._hass = t;
  }
  get hass() {
    return this._hass;
  }
  static getConfigElement() {
    return document.createElement(Ot);
  }
  static getStubConfig() {
    return {
      type: `custom:${U}`,
      room: "Bedroom",
      name: "Air conditioner",
      temperature_entity: "sensor.bedroom_temperature",
      status_entity: "sensor.bedroom_ac_status",
      animations: !0
    };
  }
  setConfig(t) {
    this._config = ce(t);
  }
  getCardSize() {
    return 5;
  }
  updated(t) {
    if (super.updated(t), !this._config || !this._hass)
      return;
    const e = $t(this._hass, this._config), s = this._config.colors ?? {}, n = s[e] ?? s.online;
    fe(this, {
      "--smart-ac-active-color": n,
      "--smart-ac-active-tint": n ? `color-mix(in srgb, ${n} 14%, transparent)` : void 0,
      "--smart-ac-button-background": s.button_background,
      "--smart-ac-button-text": s.button_text,
      "--smart-ac-window-open-color": s.window_open,
      "--smart-ac-feature-active-color": s.feature_active,
      "--smart-ac-feature-inactive-color": s.feature_inactive
    }), this.toggleAttribute("wide", this.offsetWidth > 430);
  }
  render() {
    if (!this._config || !this._hass)
      return u;
    const t = $t(this._hass, this._config), e = he(
      this._hass,
      this._config.temperature_entity,
      this._config.unit
    ), s = pe(this._hass, this._config), n = X(this._hass, this._config), r = this._statusHints(t), a = this._windowOpen();
    return d`
      <ha-card>
        <div class=${this._config.compact ? "wrap compact" : "wrap"}>
          <div class="header">
            <div>
              <div class="room">${this._config.room ?? ""}</div>
              <div class="name">${this._config.name ?? ""}</div>
            </div>
            ${this._config.window_entity ? d`
                  <button
                    class=${a ? "window-indicator open" : "window-indicator"}
                    title=${a ? h(this._hass, "window_open") : h(this._hass, "window_closed")}
                    aria-label=${a ? h(this._hass, "window_open") : h(this._hass, "window_closed")}
                    @click=${this._openWindowDetails}
                  >
                    <ha-icon
                      .icon=${D(this._config, a ? "window_open" : "window_closed")}
                    ></ha-icon>
                  </button>
                ` : u}
            <button
              class="settings-button"
              title="Settings"
              aria-label="Settings"
              @click=${this._openDialog}
            >
              <ha-icon .icon=${D(this._config, "settings")}></ha-icon>
            </button>
          </div>

          <div class="temperature-row">
            <button
              class="temperature temperature-button"
              aria-label="Show temperature details"
              @click=${this._openTemperatureDetails}
            >
              ${e}
            </button>
            <div class="status">${ue(t)}</div>
          </div>

          ${s ? d`
                <div class="setpoint-row">
                  <span class="setpoint-label">${this._config.target_temperature_label ?? "Target"}</span>
                  <div class="setpoint-control">
                    <button
                      class="setpoint-button"
                      aria-label="Decrease target temperature"
                      ?disabled=${n === void 0}
                      @click=${() => this._changeTargetTemperature(-1)}
                    >
                      <ha-icon .icon=${"mdi:chevron-left"}></ha-icon>
                    </button>
                    <span class="setpoint-value">${s}</span>
                    <button
                      class="setpoint-button"
                      aria-label="Increase target temperature"
                      ?disabled=${n === void 0}
                      @click=${() => this._changeTargetTemperature(1)}
                    >
                      <ha-icon .icon=${"mdi:chevron-right"}></ha-icon>
                    </button>
                  </div>
                </div>
              ` : u}

          <div class="buttons">
            ${(this._config.buttons ?? []).filter((o) => o.visible !== !1).map((o) => this._renderButton(o, t))}
          </div>
          ${r.length > 0 ? d`<div class="schedule-hint">${r.map((o) => d`<div>${o}</div>`)}</div>` : u}
          <div class="version">v${oe}</div>
        </div>
      </ha-card>
    `;
  }
  _renderButton(t, e) {
    if (!this._config)
      return u;
    const s = t.id ?? t.name ?? "custom", n = yt(this._config, t), r = this._selectOptions(t), a = this._buttonActive(t, e), o = ["sleep", "display", "buzzer"].includes(t.id ?? ""), c = this._animationClass(t, e, a), l = [
      t.color ? `${o ? "--smart-ac-feature-active-color" : "--smart-ac-button-color"}:${t.color}` : "",
      a && !o ? "--smart-ac-button-active-background: var(--smart-ac-active-tint)" : ""
    ].filter(Boolean).join(";");
    return d`
      <div class="button-cell">
        <button
          class=${`action-button ${o ? "feature-button" : ""} ${c}`}
          style=${l}
          aria-pressed=${a ? "true" : "false"}
          ?data-active=${a}
          ?disabled=${this._runningButton === s || !n && !t.select_entity}
          @click=${() => this._handleButton(t)}
        >
          <ha-icon .icon=${t.icon ?? this._fallbackButtonIcon(t)}></ha-icon>
          <span class="action-label">${t.name ?? t.id}</span>
        </button>
        ${t.select_entity && this._openSelectButtonId === s ? d`
              <select
                class="button-select"
                .value=${this._selectValue(t) ?? ""}
                @change=${(_) => this._setSelectButtonValue(t, _.currentTarget.value)}
              >
                <option value="" disabled>Select value</option>
                ${r.map((_) => d`<option value=${_}>${_}</option>`)}
              </select>
            ` : u}
      </div>
    `;
  }
  _animationClass(t, e, s) {
    if (!this._config)
      return "";
    const n = le(this._config.animations);
    if (!n.enabled)
      return "";
    const r = t.id;
    return n.cool && r === "cool" && (s || e === "cool") ? "animate-cool" : n.heat && r === "heat" && (s || e === "heat") ? "animate-heat" : n.fan && r === "fan" && (s || e === "fan") ? "animate-fan" : n.swing && r === "swing_vertical" && s ? "animate-swing" : n.sleep && r === "sleep" && (s || e === "sleep") ? "animate-sleep" : "";
  }
  _buttonActive(t, e) {
    if (!this._hass)
      return !1;
    if (!t.status_entity && t.select_entity)
      return this._selectButtonActive(t);
    if (!t.status_entity)
      return this._statusMatchesButton(t, e);
    const s = this._hass.states[t.status_entity];
    if (!s)
      return !1;
    const n = t.status_attribute && t.status_attribute !== "state" ? s.attributes[t.status_attribute] : s.state, r = Array.isArray(n) ? s.state : n;
    return (t.active_state ? Array.isArray(t.active_state) ? t.active_state : [t.active_state] : ["on", "true", "active", "cool", "heat", "fan", "sleep", "boost", "eco"]).map((c) => String(c).toLowerCase()).includes(String(r).toLowerCase());
  }
  _statusMatchesButton(t, e) {
    switch (t.id) {
      case "cool":
        return e === "cool";
      case "heat":
        return e === "heat";
      case "sleep":
        return e === "sleep";
      case "power_off":
        return e === "off";
      case "fan":
        return e === "fan";
      default:
        return !1;
    }
  }
  _fallbackButtonIcon(t) {
    if (!this._config)
      return "mdi:circle";
    const e = t.id ?? "";
    return e === "fan" ? D(this._config, "fan") : D(this._config, e, "mdi:circle");
  }
  async _handleButton(t) {
    if (!this._hass || !this._config)
      return;
    const e = t.id ?? t.name ?? "custom", s = yt(this._config, t);
    if (t.select_entity) {
      this._openSelectButtonId = this._openSelectButtonId === e ? void 0 : e;
      return;
    }
    if (s && !(this._needsOpenWindowConfirmation(t) && !window.confirm("Fenster ist auf!!!"))) {
      this._runningButton = e;
      try {
        await ne(this._hass, s);
      } catch (n) {
        console.error("Smart AC Card action failed", { button: t, action: s, error: n });
      } finally {
        this._runningButton = void 0;
      }
    }
  }
  _selectButtonActive(t) {
    if (!this._hass || !t.select_entity)
      return !1;
    const e = this._hass.states[t.select_entity]?.state;
    return !!(e && !["off", "none", "unknown", "unavailable"].includes(e.toLowerCase()));
  }
  _selectOptions(t) {
    if (!this._hass || !t.select_entity)
      return [];
    const s = this._hass.states[t.select_entity]?.attributes.options;
    return Array.isArray(s) ? s.map((n) => String(n)) : [];
  }
  _selectValue(t) {
    return t.select_entity ? this._hass?.states[t.select_entity]?.state : void 0;
  }
  async _setSelectButtonValue(t, e) {
    if (!this._hass || !t.select_entity || !e)
      return;
    const s = t.select_entity, n = s.split(".")[0] ?? "";
    if (this._openSelectButtonId = void 0, n === "select" || n === "input_select") {
      await this._hass.callService(n, "select_option", { option: e }, { entity_id: s });
      return;
    }
    await this._hass.callService(n, "set_value", { value: e }, { entity_id: s });
  }
  _needsOpenWindowConfirmation(t) {
    return this._windowOpen() && ["power_on", "cool", "heat"].includes(String(t.id));
  }
  async _changeTargetTemperature(t) {
    if (!this._hass || !this._config)
      return;
    const e = this._config.target_temperature_entity ?? this._config.status_entity, s = e ? this._hass.states[e] : void 0, n = X(this._hass, this._config);
    if (!e || !s || n === void 0)
      return;
    const r = this._config.target_temperature_step ?? 0.5, a = Math.round((n + t * r) * 10) / 10, o = e.split(".")[0] ?? "", c = this._config.target_temperature_attribute ?? "temperature";
    if (o === "input_number" || o === "number") {
      await this._hass.callService(o, "set_value", { value: a }, { entity_id: e });
      return;
    }
    if (o === "climate") {
      await this._hass.callService(
        "climate",
        "set_temperature",
        { [c === "state" ? "temperature" : c]: a },
        { entity_id: e }
      );
      return;
    }
    await this._hass.callService(o, "set_value", { value: a }, { entity_id: e });
  }
  _openTemperatureDetails() {
    this._config?.temperature_entity && E(this, "hass-more-info", { entityId: this._config.temperature_entity });
  }
  _openWindowDetails() {
    this._config?.window_entity && E(this, "hass-more-info", { entityId: this._config.window_entity });
  }
  _statusHints(t) {
    const e = [], s = this._scheduleHint(t);
    return s && e.push(s), this._windowOpen() && e.push(h(this._hass, "window_is_open")), e;
  }
  _scheduleHint(t) {
    if (!this._hass || !this._config?.popup)
      return;
    const e = this._config.popup;
    if (t === "off" && this._entityIsOn(e.autostart_entity) && e.autostart_time_entity) {
      const n = this._formattedTime(e.autostart_time_entity);
      return n ? `${h(this._hass, "starts_at")} ${n}` : void 0;
    }
    if (!["off", "offline", "unknown"].includes(t) && this._entityIsOn(e.sleep_auto_entity) && e.sleep_time_entity) {
      const n = this._formattedTime(e.sleep_time_entity);
      return n ? `${h(this._hass, "sleep_starts_at")} ${n}` : void 0;
    }
  }
  _windowOpen() {
    if (!this._hass || !this._config?.window_entity)
      return !1;
    const t = this._hass.states[this._config.window_entity]?.state.toLowerCase();
    return !!(t && ["on", "open", "opening", "tilted"].includes(t));
  }
  _entityIsOn(t) {
    return (t ? this._hass?.states[t]?.state : void 0) === "on";
  }
  _formattedTime(t) {
    const e = this._hass?.states[t], n = (e?.state.includes(" ") ? e.state.split(" ").at(-1) : e?.state)?.match(/^(\d{1,2}):(\d{2})/);
    if (!n)
      return;
    const r = Number(n[1]), a = Number(n[2]);
    if (!(!Number.isFinite(r) || !Number.isFinite(a)))
      return a === 0 ? `${r.toString()} Uhr` : `${r.toString().padStart(2, "0")}:${a.toString().padStart(2, "0")} Uhr`;
  }
  _openDialog() {
    !this._hass || !this._config || me(this, this._hass, this._config);
  }
}
K([
  f()
], H.prototype, "_hass");
K([
  f()
], H.prototype, "_config");
K([
  f()
], H.prototype, "_runningButton");
K([
  f()
], H.prototype, "_openSelectButtonId");
customElements.define(U, H);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: U,
  name: "Smart AC Card",
  description: "Configurable air conditioner control card.",
  preview: !0
});
var Ae = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, J = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Se(t, e) : t, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (n = (s ? a(t, e, n) : a(n)) || n);
  return s && n && Ae(t, e, n), n;
};
let x = class extends $ {
  constructor() {
    super(...arguments), this._open = !1;
  }
  set hass(i) {
    this._hass = i;
  }
  showDialog(i) {
    this._hass = i.hass, this._config = i.config, this._open = !0;
  }
  closeDialog() {
    this._open && (this._open = !1, this._config = void 0, this.dispatchEvent(
      new CustomEvent("dialog-closed", {
        bubbles: !0,
        composed: !0,
        detail: { dialog: rt }
      })
    ));
  }
  render() {
    if (!this._open || !this._hass || !this._config)
      return u;
    const i = this._config.popup ?? {}, t = i.title ?? `${this._config.room ?? ""} ${this._config.name ?? ""}`.trim(), e = [
      {
        entity: i.cool_temperature_entity,
        name: h(this._hass, "cool_temperature")
      },
      {
        entity: i.heat_temperature_entity,
        name: h(this._hass, "heat_temperature")
      },
      {
        entity: i.autostart_entity,
        name: h(this._hass, "autostart")
      },
      {
        entity: i.autostart_time_entity,
        name: h(this._hass, "autostart_time")
      },
      {
        entity: i.sleep_auto_entity,
        name: h(this._hass, "sleep_auto")
      },
      {
        entity: i.sleep_time_entity,
        name: h(this._hass, "sleep_time")
      }
    ].filter((n) => !!n.entity).map((n) => ({ entity: n.entity, name: n.name })), s = i.helpers ?? [];
    return d`
      <ha-dialog
        open
        .heading=${t || h(this._hass, "settings")}
        @closed=${this.closeDialog}
      >
        <div class="content">
          ${this._renderHelperSection(e, !1)}
          ${s.length > 0 ? d`
                <div class="section-title">${h(this._hass, "helpers")}</div>
                ${this._renderHelperSection(s, !0)}
              ` : u}
        </div>
        <mwc-button slot="primaryAction" dialogAction="close">Close</mwc-button>
      </ha-dialog>
    `;
  }
  _renderHelperSection(i, t = !0) {
    return !this._hass || i.length === 0 ? t ? d`<div class="empty">${h(this._hass, "no_helpers")}</div>` : u : d`
      <div class="section">
        ${i.map((e) => {
      const s = this._hass?.states[e.entity];
      return d`
            <div class="entity-row">
              <div class="helper-label">
                ${e.icon ? d`<ha-icon .icon=${e.icon}></ha-icon>` : u}
                <span>${e.name ?? s?.attributes.friendly_name ?? e.entity}</span>
              </div>
              <div class="helper-control">${this._renderControl(e, s)}</div>
            </div>
          `;
    })}
      </div>
    `;
  }
  _renderControl(i, t) {
    if (!t)
      return d`<span class="missing">${i.entity}</span>`;
    const e = i.type ?? this._domain(i.entity);
    if (e === "input_boolean" || e === "switch")
      return d`
        <ha-switch
          .checked=${t.state === "on"}
          @change=${(s) => this._setBoolean(i.entity, s.currentTarget.checked)}
        ></ha-switch>
      `;
    if (e === "input_datetime")
      return this._renderTimeControl(i.entity, t);
    if (e === "input_number" || e === "number")
      return d`
        <input
          class="number-input"
          type="number"
          .value=${t.state}
          min=${t.attributes.min ?? u}
          max=${t.attributes.max ?? u}
          step=${t.attributes.step ?? 1}
          @change=${(s) => this._setNumber(i.entity, Number(s.currentTarget.value))}
        />
      `;
    if (e === "select") {
      const s = t.attributes.options ?? [];
      return d`
        <select
          class="select-input"
          .value=${t.state}
          @change=${(n) => this._setSelect(i.entity, n.currentTarget.value)}
        >
          ${s.map((n) => d`<option value=${n}>${n}</option>`)}
        </select>
      `;
    }
    return e === "button" ? d`<button class="press-button" @click=${() => this._pressButton(i.entity)}>Press</button>` : d`<span class="state-value">${this._hass?.formatEntityState?.(t) ?? t.state}</span>`;
  }
  _renderTimeControl(i, t) {
    const e = this._timeFromState(t);
    return d`
      <div class="time-control">
        <button class="step-button" @click=${() => this._stepTime(i, e, 5)}>▲</button>
        <input
          class="time-input"
          type="time"
          .value=${e}
          @change=${(s) => this._setTime(i, s.currentTarget.value)}
        />
        <button class="step-button" @click=${() => this._stepTime(i, e, -5)}>▼</button>
      </div>
    `;
  }
  _domain(i) {
    return i.split(".", 1)[0] ?? "";
  }
  async _setBoolean(i, t) {
    const e = this._domain(i);
    await this._hass?.callService(e, t ? "turn_on" : "turn_off", {}, { entity_id: i });
  }
  async _setNumber(i, t) {
    if (!Number.isFinite(t))
      return;
    const e = this._domain(i);
    await this._hass?.callService(e, "set_value", { value: t }, { entity_id: i });
  }
  async _setSelect(i, t) {
    await this._hass?.callService("select", "select_option", { option: t }, { entity_id: i });
  }
  async _pressButton(i) {
    await this._hass?.callService("button", "press", {}, { entity_id: i });
  }
  async _setTime(i, t) {
    /^\d{2}:\d{2}$/.test(t) && await this._hass?.callService("input_datetime", "set_datetime", { time: `${t}:00` }, { entity_id: i });
  }
  _stepTime(i, t, e) {
    const [s, n] = t.split(":"), r = Number(s), a = Number(n);
    if (!Number.isFinite(r) || !Number.isFinite(a))
      return;
    const o = 1440, c = (r * 60 + a + e + o) % o, l = Math.floor(c / 60).toString().padStart(2, "0"), _ = (c % 60).toString().padStart(2, "0");
    this._setTime(i, `${l}:${_}`);
  }
  _timeFromState(i) {
    const e = (i.state.includes(" ") ? i.state.split(" ").at(-1) : i.state)?.match(/^(\d{2}):(\d{2})/);
    return e ? `${e[1]}:${e[2]}` : "00:00";
  }
};
x.styles = be;
J([
  f()
], x.prototype, "_hass", 2);
J([
  f()
], x.prototype, "_config", 2);
J([
  f()
], x.prototype, "_open", 2);
x = J([
  Tt(rt)
], x);
const Ee = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get SmartAcCardDialog() {
    return x;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  H as SmartAcCard
};
//# sourceMappingURL=smart-ac-card.js.map
