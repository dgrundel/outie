"use strict";
// https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeHtml = void 0;
var encodeHtml = function (s) {
    return s
        // & --> &amp;
        .replace(/\&/g, '&amp;')
        // < --> &lt;
        .replace(/\</g, '&lt;')
        // > --> &gt;
        .replace(/\>/g, '&gt;')
        // " --> &quot;
        .replace(/\"/g, '&#x22;')
        // ' --> &#x27;
        .replace(/\'/g, '&#x27;');
};
exports.encodeHtml = encodeHtml;
//# sourceMappingURL=encoder.js.map