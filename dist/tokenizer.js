"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
var BlockEndToken_1 = require("./tokens/core/BlockEndToken");
var BlockStartToken_1 = require("./tokens/core/BlockStartToken");
var ModelKeyToken_1 = require("./tokens/ModelKeyToken");
var RawToken_1 = require("./tokens/RawToken");
var RootToken_1 = require("./tokens/RootToken");
var identInfo = function (s, identifier) {
    var value = s.trim();
    var present = value.startsWith(identifier);
    var trimmed = present
        ? value.substring(identifier.length).trim()
        : value;
    return { present: present, trimmed: trimmed };
};
var Tokenizer = /** @class */ (function () {
    function Tokenizer(config) {
        this.config = config;
    }
    Tokenizer.prototype.createToken = function (content) {
        var config = this.config;
        // this lops off the opening "/" sequence if present
        var _a = identInfo(content, config.closeTokenIdentifier), isClosingToken = _a.present, trimmed = _a.trimmed;
        // sort identifiers by length, longest first
        // this avoids cases where we might interpret "includeRaw" as "include"
        // because it starts with the same string ('include')
        var orderedIdentifiers = Object.keys(config.tokens).sort(function (a, b) {
            if (a.length === b.length) {
                return 0;
            }
            return a.length > b.length ? -1 : 1;
        });
        // test for each identifier
        for (var i = 0; i < orderedIdentifiers.length; i++) {
            var identifier = orderedIdentifiers[i];
            var _b = identInfo(trimmed, identifier), isMatchingType = _b.present, tokenContents = _b.trimmed;
            if (isMatchingType) {
                var TokenType = config.tokens[identifier];
                return isClosingToken
                    ? new BlockEndToken_1.BlockEndToken(TokenType)
                    : new TokenType(tokenContents);
            }
        }
        return new ModelKeyToken_1.ModelKeyToken(content);
    };
    ;
    Tokenizer.prototype.tokenize = function (s) {
        var root = new RootToken_1.RootToken();
        var stack = [];
        var i = 0;
        while (i < s.length) {
            var start = s.indexOf(this.config.tokenStart, i);
            if (start === -1) {
                break;
            }
            var end = s.indexOf(this.config.tokenEnd, start + this.config.tokenStart.length);
            if (end === -1) {
                break;
            }
            var parent_1 = stack.length ? stack[stack.length - 1] : root;
            if (i < start) {
                parent_1.append(new RawToken_1.RawToken(s.substring(i, start)));
            }
            var token = this.createToken(s.substring(start + this.config.tokenStart.length, end));
            if (token instanceof BlockEndToken_1.BlockEndToken) {
                if (stack.length === 0) {
                    throw new Error("Found closing " + token.type.name + " without opening.");
                }
                var openingToken = stack[stack.length - 1];
                if (openingToken.constructor !== token.type) {
                    throw new Error("Found " + token.type.name + " but " + openingToken.constructor.name + " is still open.");
                }
                stack.pop();
            }
            else if (token instanceof BlockStartToken_1.BlockStartToken) {
                parent_1.append(token);
                stack.push(token);
            }
            else {
                parent_1.append(token);
            }
            i = end + this.config.tokenEnd.length;
        }
        if (stack.length > 0) {
            throw new Error("Unclosed items in template: " + stack.map(function (t) { return t.constructor.name; }).join(', '));
        }
        if (i < s.length) {
            root.append(new RawToken_1.RawToken(s.substring(i)));
        }
        return [root];
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map