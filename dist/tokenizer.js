"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
var BlockEndToken_1 = require("./tokens/BlockEndToken");
var BlockStartToken_1 = require("./tokens/BlockStartToken");
var ModelKeyToken_1 = require("./tokens/ModelKeyToken");
var RawToken_1 = require("./tokens/RawToken");
var Token_1 = require("./tokens/Token");
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
        var tokens = [];
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
            var target = stack.length ? stack[stack.length - 1].children : tokens;
            if (i < start) {
                target.push(new RawToken_1.RawToken(s.substring(i, start)));
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
                target.push(token);
                stack.push(token);
            }
            else {
                target.push(token);
            }
            i = end + this.config.tokenEnd.length;
        }
        if (stack.length > 0) {
            throw new Error("Unclosed items in template: " + stack.map(function (t) { return t.constructor.name; }).join(', '));
        }
        if (i < s.length) {
            tokens.push(new RawToken_1.RawToken(s.substring(i)));
        }
        return tokens;
    };
    Tokenizer.prototype.renderTemplate = function (template) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                tokens = this.tokenize(template.content);
                return [2 /*return*/, Token_1.Token.renderTokens(tokens, template)];
            });
        });
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map