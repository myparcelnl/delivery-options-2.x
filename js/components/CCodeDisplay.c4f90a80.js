/*! MyParcel Delivery Options Sandbox undefined */
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["components/CCodeDisplay"],{1020:function(e,n){function t(e){Object.freeze(e);var n="function"===typeof e;return Object.getOwnPropertyNames(e).forEach((function(a){!e.hasOwnProperty(a)||null===e[a]||"object"!==typeof e[a]&&"function"!==typeof e[a]||n&&("caller"===a||"callee"===a||"arguments"===a)||Object.isFrozen(e[a])||t(e[a])})),e}function a(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r(e){var n,t={},a=Array.prototype.slice.call(arguments,1);for(n in e)t[n]=e[n];return a.forEach((function(e){for(n in e)t[n]=e[n]})),t}function i(e){return e.nodeName.toLowerCase()}function s(e){var n=[];return function e(t,a){for(var r=t.firstChild;r;r=r.nextSibling)3===r.nodeType?a+=r.nodeValue.length:1===r.nodeType&&(n.push({event:"start",offset:a,node:r}),a=e(r,a),i(r).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:r}));return a}(e,0),n}function o(e,n,t){var r=0,s="",o=[];function l(){return e.length&&n.length?e[0].offset!==n[0].offset?e[0].offset<n[0].offset?e:n:"start"===n[0].event?e:n:e.length?e:n}function c(e){function n(e){return" "+e.nodeName+'="'+a(e.value).replace(/"/g,"&quot;")+'"'}s+="<"+i(e)+[].map.call(e.attributes,n).join("")+">"}function u(e){s+="</"+i(e)+">"}function d(e){("start"===e.event?c:u)(e.node)}while(e.length||n.length){var g=l();if(s+=a(t.substring(r,g[0].offset)),r=g[0].offset,g===e){o.reverse().forEach(u);do{d(g.splice(0,1)[0]),g=l()}while(g===e&&g.length&&g[0].offset===r);o.reverse().forEach(c)}else"start"===g[0].event?o.push(g[0].node):o.pop(),d(g.splice(0,1)[0])}return s+a(t.substr(r))}var l=Object.freeze({__proto__:null,escapeHTML:a,inherit:r,nodeStream:s,mergeStreams:o});const c="</span>",u=e=>!!e.kind;class d{constructor(e,n){this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){this.buffer+=a(e)}openNode(e){if(!u(e))return;let n=e.kind;e.sublanguage||(n=`${this.classPrefix}${n}`),this.span(n)}closeNode(e){u(e)&&(this.buffer+=c)}span(e){this.buffer+=`<span class="${e}">`}value(){return this.buffer}}class g{constructor(){this.rootNode={children:[]},this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){let n={kind:e,children:[]};this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){while(this.closeNode());}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){return"string"===typeof n?e.addText(n):n.children&&(e.openNode(n),n.children.forEach(n=>this._walk(e,n)),e.closeNode(n)),e}static _collapse(e){e.children&&(e.children.every(e=>"string"===typeof e)?(e.text=e.children.join(""),delete e["children"]):e.children.forEach(e=>{"string"!==typeof e&&g._collapse(e)}))}}class h extends g{constructor(e){super(),this.options=e}addKeyword(e,n){""!==e&&(this.openNode(n),this.addText(e),this.closeNode())}addText(e){""!==e&&this.add(e)}addSublanguage(e,n){let t=e.root;t.kind=n,t.sublanguage=!0,this.add(t)}toHTML(){let e=new d(this,this.options);return e.value()}finalize(){}}function f(e){return new RegExp(e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")}function b(e){return e&&e.source||e}function m(e){return new RegExp(e.toString()+"|").exec("").length-1}function p(e,n){var t=e&&e.exec(n);return t&&0===t.index}function v(e,n){for(var t=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./,a=0,r="",i=0;i<e.length;i++){a+=1;var s=a,o=b(e[i]);i>0&&(r+=n),r+="(";while(o.length>0){var l=t.exec(o);if(null==l){r+=o;break}r+=o.substring(0,l.index),o=o.substring(l.index+l[0].length),"\\"==l[0][0]&&l[1]?r+="\\"+String(Number(l[1])+s):(r+=l[0],"("==l[0]&&a++)}r+=")"}return r}const E="[a-zA-Z]\\w*",_="[a-zA-Z_]\\w*",x="\\b\\d+(\\.\\d+)?",N="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",w="\\b(0b[01]+)",O="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",R={begin:"\\\\[\\s\\S]",relevance:0},y={className:"string",begin:"'",end:"'",illegal:"\\n",contains:[R]},M={className:"string",begin:'"',end:'"',illegal:"\\n",contains:[R]},S={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},T=function(e,n,t){var a=r({className:"comment",begin:e,end:n,contains:[]},t||{});return a.contains.push(S),a.contains.push({className:"doctag",begin:"(?:TODO|FIXME|NOTE|BUG|XXX):",relevance:0}),a},A=T("//","$"),C=T("/\\*","\\*/"),k=T("#","$"),L={className:"number",begin:x,relevance:0},I={className:"number",begin:N,relevance:0},D={className:"number",begin:w,relevance:0},B={className:"number",begin:x+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},j={begin:/(?=\/[^\/\n]*\/)/,contains:[{className:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[R,{begin:/\[/,end:/\]/,relevance:0,contains:[R]}]}]},P={className:"title",begin:E,relevance:0},H={className:"title",begin:_,relevance:0},U={begin:"\\.\\s*"+_,relevance:0};var K=Object.freeze({__proto__:null,IDENT_RE:E,UNDERSCORE_IDENT_RE:_,NUMBER_RE:x,C_NUMBER_RE:N,BINARY_NUMBER_RE:w,RE_STARTERS_RE:O,BACKSLASH_ESCAPE:R,APOS_STRING_MODE:y,QUOTE_STRING_MODE:M,PHRASAL_WORDS_MODE:S,COMMENT:T,C_LINE_COMMENT_MODE:A,C_BLOCK_COMMENT_MODE:C,HASH_COMMENT_MODE:k,NUMBER_MODE:L,C_NUMBER_MODE:I,BINARY_NUMBER_MODE:D,CSS_NUMBER_MODE:B,REGEXP_MODE:j,TITLE_MODE:P,UNDERSCORE_TITLE_MODE:H,METHOD_GUARD:U}),z="of and for in not or if then".split(" ");function $(e){function n(n,t){return new RegExp(b(n),"m"+(e.case_insensitive?"i":"")+(t?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,n){n.position=this.position++,this.matchIndexes[this.matchAt]=n,this.regexes.push([n,e]),this.matchAt+=m(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null);let e=this.regexes.map(e=>e[1]);this.matcherRe=n(v(e,"|"),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;let n=this.matcherRe.exec(e);if(!n)return null;let t=n.findIndex((e,n)=>n>0&&void 0!=e),a=this.matchIndexes[t];return Object.assign(n,a)}}class a{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];let n=new t;return this.rules.slice(e).forEach(([e,t])=>n.addRule(e,t)),n.compile(),this.multiRegexes[e]=n,n}considerAll(){this.regexIndex=0}addRule(e,n){this.rules.push([e,n]),"begin"===n.type&&this.count++}exec(e){let n=this.getMatcher(this.regexIndex);n.lastIndex=this.lastIndex;let t=n.exec(e);return t&&(this.regexIndex+=t.position+1,this.regexIndex===this.count&&(this.regexIndex=0)),t}}function r(e){let n=new a;return e.contains.forEach(e=>n.addRule(e.begin,{rule:e,type:"begin"})),e.terminator_end&&n.addRule(e.terminator_end,{type:"end"}),e.illegal&&n.addRule(e.illegal,{type:"illegal"}),n}function i(e){let n=e.input[e.index-1],t=e.input[e.index+e[0].length];if("."===n||"."===t)return{ignoreMatch:!0}}function s(t,a){t.compiled||(t.compiled=!0,t.__onBegin=null,t.keywords=t.keywords||t.beginKeywords,t.keywords&&(t.keywords=W(t.keywords,e.case_insensitive)),t.lexemesRe=n(t.lexemes||/\w+/,!0),a&&(t.beginKeywords&&(t.begin="\\b("+t.beginKeywords.split(" ").join("|")+")(?=\\b|\\s)",t.__onBegin=i),t.begin||(t.begin=/\B|\b/),t.beginRe=n(t.begin),t.endSameAsBegin&&(t.end=t.begin),t.end||t.endsWithParent||(t.end=/\B|\b/),t.end&&(t.endRe=n(t.end)),t.terminator_end=b(t.end)||"",t.endsWithParent&&a.terminator_end&&(t.terminator_end+=(t.end?"|":"")+a.terminator_end)),t.illegal&&(t.illegalRe=n(t.illegal)),null==t.relevance&&(t.relevance=1),t.contains||(t.contains=[]),t.contains=[].concat(...t.contains.map((function(e){return F("self"===e?t:e)}))),t.contains.forEach((function(e){s(e,t)})),t.starts&&s(t.starts,a),t.matcher=r(t))}if(e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");s(e)}function G(e){return!!e&&(e.endsWithParent||G(e.starts))}function F(e){return e.variants&&!e.cached_variants&&(e.cached_variants=e.variants.map((function(n){return r(e,{variants:null},n)}))),e.cached_variants?e.cached_variants:G(e)?r(e,{starts:e.starts?r(e.starts):null}):Object.isFrozen(e)?r(e):e}function W(e,n){var t={};return"string"===typeof e?a("keyword",e):Object.keys(e).forEach((function(n){a(n,e[n])})),t;function a(e,a){n&&(a=a.toLowerCase()),a.split(" ").forEach((function(n){var a=n.split("|");t[a[0]]=[e,X(a[0],a[1])]}))}}function X(e,n){return n?Number(n):J(e)?0:1}function J(e){return z.includes(e.toLowerCase())}var Z="10.0.1";const q=a,Q=r,{nodeStream:V,mergeStreams:Y}=l,ee=function(e){var n=[],a={},r={},i=[],s=!0,o=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,l="Could not find the language '{}', did you forget to load/include a language module?",c={noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0,__emitter:h};function u(e){return c.noHighlightRe.test(e)}function d(e){var n,t=e.className+" ";if(t+=e.parentNode?e.parentNode.className:"",n=c.languageDetectRe.exec(t),n){var a=T(n[1]);return a||(console.warn(l.replace("{}",n[1])),console.warn("Falling back to no-highlight mode for this block.",e)),a?n[1]:"no-highlight"}return t.split(/\s+/).find(e=>u(e)||T(e))}function g(e,n,t,a){var r={code:n,language:e};k("before:highlight",r);var i=r.result?r.result:b(r.language,r.code,t,a);return i.code=r.code,k("after:highlight",i),i}function b(e,n,t,r){var i=n;function o(e,n){if(p(e.endRe,n)){while(e.endsParent&&e.parent)e=e.parent;return e}if(e.endsWithParent)return o(e.parent,n)}function u(e,n){var t=R.case_insensitive?n[0].toLowerCase():n[0];return e.keywords.hasOwnProperty(t)&&e.keywords[t]}function d(){var e,n,t,a;if(M.keywords){n=0,M.lexemesRe.lastIndex=0,t=M.lexemesRe.exec(L),a="";while(t){a+=L.substring(n,t.index),e=u(M,t);var r=null;e?(A.addText(a),a="",I+=e[1],r=e[0],A.addKeyword(t[0],r)):a+=t[0],n=M.lexemesRe.lastIndex,t=M.lexemesRe.exec(L)}a+=L.substr(n),A.addText(a)}else A.addText(L)}function g(){if(""!==L){var e="string"===typeof M.subLanguage;if(!e||a[M.subLanguage]){var n=e?b(M.subLanguage,L,!0,S[M.subLanguage]):v(L,M.subLanguage.length?M.subLanguage:void 0);M.relevance>0&&(I+=n.relevance),e&&(S[M.subLanguage]=n.top),A.addSublanguage(n.emitter,n.language)}else A.addText(L)}}function h(){null!=M.subLanguage?g():d(),L=""}function m(e){e.className&&A.openNode(e.className),M=Object.create(e,{parent:{value:M}})}function E(e){return 0===M.matcher.regexIndex?(L+=e[0],1):(B=!0,0)}function _(e){var n=e[0],t=e.rule;if(t.__onBegin){let a=t.__onBegin(e)||{};if(a.ignoreMatch)return E(n)}return t&&t.endSameAsBegin&&(t.endRe=f(n)),t.skip?L+=n:(t.excludeBegin&&(L+=n),h(),t.returnBegin||t.excludeBegin||(L=n)),m(t),t.returnBegin?0:n.length}function x(e){var n=e[0],t=i.substr(e.index),a=o(M,t);if(a){var r=M;r.skip?L+=n:(r.returnEnd||r.excludeEnd||(L+=n),h(),r.excludeEnd&&(L=n));do{M.className&&A.closeNode(),M.skip||M.subLanguage||(I+=M.relevance),M=M.parent}while(M!==a.parent);return a.starts&&(a.endSameAsBegin&&(a.starts.endRe=a.endRe),m(a.starts)),r.returnEnd?0:n.length}}function N(){for(var e=[],n=M;n!==R;n=n.parent)n.className&&e.unshift(n.className);e.forEach(e=>A.openNode(e))}var w={};function O(n,a){var r,o=a&&a[0];if(L+=n,null==o)return h(),0;if("begin"==w.type&&"end"==a.type&&w.index==a.index&&""===o){if(L+=i.slice(a.index,a.index+1),!s)throw r=new Error("0 width match regex"),r.languageName=e,r.badRule=w.rule,r;return 1}if(w=a,"begin"===a.type)return _(a);if("illegal"===a.type&&!t)throw r=new Error('Illegal lexeme "'+o+'" for mode "'+(M.className||"<unnamed>")+'"'),r.mode=M,r;if("end"===a.type){var l=x(a);if(void 0!=l)return l}return L+=o,o.length}var R=T(e);if(!R)throw console.error(l.replace("{}",e)),new Error('Unknown language: "'+e+'"');$(R);var y,M=r||R,S={},A=new c.__emitter(c);N();var C,k,L="",I=0,D=0;try{var B=!1;M.matcher.considerAll();while(1){if(B?B=!1:(M.matcher.lastIndex=D,M.matcher.considerAll()),C=M.matcher.exec(i),!C)break;let e=i.substring(D,C.index);k=O(e,C),D=C.index+k}return O(i.substr(D)),A.closeAllNodes(),A.finalize(),y=A.toHTML(),{relevance:I,value:y,language:e,illegal:!1,emitter:A,top:M}}catch(j){if(j.message&&j.message.includes("Illegal"))return{illegal:!0,illegalBy:{msg:j.message,context:i.slice(D-100,D+100),mode:j.mode},sofar:y,relevance:0,value:q(i),emitter:A};if(s)return{relevance:0,value:q(i),emitter:A,language:e,top:M,errorRaised:j};throw j}}function m(e){const n={relevance:0,emitter:new c.__emitter(c),value:q(e),illegal:!1,top:R};return n.emitter.addText(e),n}function v(e,n){n=n||c.languages||Object.keys(a);var t=m(e),r=t;return n.filter(T).filter(A).forEach((function(n){var a=b(n,e,!1);a.language=n,a.relevance>r.relevance&&(r=a),a.relevance>t.relevance&&(r=t,t=a)})),r.language&&(t.second_best=r),t}function E(e){return c.tabReplace||c.useBR?e.replace(o,(function(e,n){return c.useBR&&"\n"===e?"<br>":c.tabReplace?n.replace(/\t/g,c.tabReplace):""})):e}function _(e,n,t){var a=n?r[n]:t,i=[e.trim()];return e.match(/\bhljs\b/)||i.push("hljs"),e.includes(a)||i.push(a),i.join(" ").trim()}function x(e){var n,t,a,r,i,s=d(e);u(s)||(k("before:highlightBlock",{block:e,language:s}),c.useBR?(n=document.createElement("div"),n.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):n=e,i=n.textContent,a=s?g(s,i,!0):v(i),t=V(n),t.length&&(r=document.createElement("div"),r.innerHTML=a.value,a.value=Y(t,V(r),i)),a.value=E(a.value),k("after:highlightBlock",{block:e,result:a}),e.innerHTML=a.value,e.className=_(e.className,s,a.language),e.result={language:a.language,re:a.relevance},a.second_best&&(e.second_best={language:a.second_best.language,re:a.second_best.relevance}))}function N(e){c=Q(c,e)}function w(){if(!w.called){w.called=!0;var e=document.querySelectorAll("pre code");n.forEach.call(e,x)}}function O(){window.addEventListener("DOMContentLoaded",w,!1)}const R={disableAutodetect:!0,name:"Plain text"};function y(n,t){var i;try{i=t(e)}catch(o){if(console.error("Language definition for '{}' could not be registered.".replace("{}",n)),!s)throw o;console.error(o),i=R}i.name||(i.name=n),a[n]=i,i.rawDefinition=t.bind(null,e),i.aliases&&i.aliases.forEach((function(e){r[e]=n}))}function M(){return Object.keys(a)}function S(e){var n=T(e);if(n)return n;var t=new Error("The '{}' language is required, but not loaded.".replace("{}",e));throw t}function T(e){return e=(e||"").toLowerCase(),a[e]||a[r[e]]}function A(e){var n=T(e);return n&&!n.disableAutodetect}function C(e,n){i.push(e)}function k(e,n){var t=e;i.forEach((function(e){e[t]&&e[t](n)}))}Object.assign(e,{highlight:g,highlightAuto:v,fixMarkup:E,highlightBlock:x,configure:N,initHighlighting:w,initHighlightingOnLoad:O,registerLanguage:y,listLanguages:M,getLanguage:T,requireLanguage:S,autoDetection:A,inherit:Q,addPlugin:C}),e.debugMode=function(){s=!1},e.safeMode=function(){s=!0},e.versionString=Z;for(const h in K)"object"===typeof K[h]&&t(K[h]);return Object.assign(e,K),e};var ne=ee({});e.exports=ne},"4dd1":function(e,n){function t(e){var n={begin:"<>",end:"</>"},t={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/},a="[A-Za-z$_][0-9A-Za-z$_]*",r={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},i={className:"number",variants:[{begin:"\\b(0[bB][01]+)n?"},{begin:"\\b(0[oO][0-7]+)n?"},{begin:e.C_NUMBER_RE+"n?"}],relevance:0},s={className:"subst",begin:"\\$\\{",end:"\\}",keywords:r,contains:[]},o={begin:"html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,s],subLanguage:"xml"}},l={begin:"css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,s],subLanguage:"css"}},c={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,s]};s.contains=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,o,l,c,i,e.REGEXP_MODE];var u=s.contains.concat([e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]),d={className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,contains:u};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:r,contains:[{className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},{className:"meta",begin:/^#!/,end:/$/},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,o,l,c,e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+",contains:[{className:"type",begin:"\\{",end:"\\}",relevance:0},{className:"variable",begin:a+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,i,{begin:/[{,\n]\s*/,relevance:0,contains:[{begin:a+"\\s*:",returnBegin:!0,relevance:0,contains:[{className:"attr",begin:a,relevance:0}]}]},{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.REGEXP_MODE,{className:"function",begin:"(\\(.*?\\)|"+a+")\\s*=>",returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:a},{begin:/\(\s*\)/},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:u}]}]},{begin:/,/,relevance:0},{className:"",begin:/\s/,end:/\s*/,skip:!0},{variants:[{begin:n.begin,end:n.end},{begin:t.begin,end:t.end}],subLanguage:"xml",contains:[{begin:t.begin,end:t.end,skip:!0,contains:["self"]}]}],relevance:0},{className:"function",beginKeywords:"function",end:/\{/,excludeEnd:!0,contains:[e.inherit(e.TITLE_MODE,{begin:a}),d],illegal:/\[|%/},{begin:/\$[(.]/},e.METHOD_GUARD,{className:"class",beginKeywords:"class",end:/[{;=]/,excludeEnd:!0,illegal:/[:"\[\]]/,contains:[{beginKeywords:"extends"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"constructor",end:/\{/,excludeEnd:!0},{begin:"(get|set)\\s*(?="+a+"\\()",end:/{/,keywords:"get set",contains:[e.inherit(e.TITLE_MODE,{begin:a}),{begin:/\(\)/},d]}],illegal:/#(?!!)/}}e.exports=t},"5ad2":function(e,n){function t(e){var n={literal:"true false null"},t=[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],a=[e.QUOTE_STRING_MODE,e.C_NUMBER_MODE],r={end:",",endsWithParent:!0,excludeEnd:!0,contains:a,keywords:n},i={begin:"{",end:"}",contains:[{className:"attr",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE],illegal:"\\n"},e.inherit(r,{begin:/:/})].concat(t),illegal:"\\S"},s={begin:"\\[",end:"\\]",contains:[e.inherit(r)],illegal:"\\S"};return a.push(i,s),t.forEach((function(e){a.push(e)})),{name:"JSON",contains:a,keywords:n,illegal:"\\S"}}e.exports=t},a70e:function(e,n,t){t("1020")},cce3:function(e,n,t){"use strict";t.r(n);var a=function(){var e,n=this,t=n.$createElement,a=n._self._c||t;return a("pre",{staticClass:"card code code--block",class:(e={},e["code--"+n.language]=n.language,e["code--loading"]=n.loading,e),domProps:{innerHTML:n._s(n.codeHtml)},on:{click:n.handleClick,mouseover:n.listeners.mouseOver,mouseout:n.listeners.mouseOut}})},r=[],i=(t("caad"),t("2532"),t("d88a")),s=t("85b1"),o=t("a70e"),l=t.n(o),c=t("4dd1"),u=t.n(c),d=t("5ad2"),g=t.n(d);l.a.registerLanguage("javascript",u.a),l.a.registerLanguage("json",g.a),l.a.configure({tabReplace:"  "});var h={name:"CCodeDisplay",props:{loading:Boolean,code:{type:String,default:null},language:{type:String,default:function(){return i["a"]}},allowHover:{type:Array,default:null}},data:function(){var e=15;return{hovered:null,listeners:{mouseOver:Object(s["a"])(this.handleMouseOver,e),mouseOut:Object(s["a"])(this.handleMouseOut,e)}}},computed:{codeHtml:function(){var e=l.a.getLanguage(this.language)?this.language:"javascript",n=l.a.highlight(e,this.code).value;return'<div class="code__wrapper">'.concat(n,"</div>")}},methods:{handleClick:function(e){var n=e.target;"SPAN"===n.tagName&&this.$emit("click",n)},handleMouseOver:function(e){var n=e.target,t=this.allowHover&&this.allowHover.includes(n.innerText);t&&"SPAN"===n.tagName&&!n.classList.contains("code--hover")&&(this.hovered=n,n.classList.add("code--hover"))},handleMouseOut:function(){this.hovered&&(this.hovered.classList.remove("code--hover"),this.hovered=null)}}},f=h,b=t("2877"),m=Object(b["a"])(f,a,r,!1,null,null,null);n["default"]=m.exports}}]);