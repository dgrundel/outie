"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Tokenizer = exports.ForToken = exports.UnlessToken = exports.IfToken = exports.BlockEndToken = exports.BlockStartToken = exports.RawIncludeToken = exports.IncludeToken = exports.RawModelKeyToken = exports.ModelKeyToken = exports.RawToken = exports.Token = void 0;
var encoder_1 = require("./encoder");
var template_1 = require("./template");
var Token = /** @class */ (function () {
    function Token(content) {
        this.content = content;
    }
    Token.getValue = function (key, data) {
        var keyParts = key.trim().split('.');
        return keyParts.reduce(function (obj, prop) { return typeof obj === 'undefined' ? undefined : obj[prop]; }, data);
    };
    Token.getString = function (key, data) {
        var value = Token.getValue(key, data);
        return typeof value !== 'undefined' ? value.toString() : '';
    };
    return Token;
}());
exports.Token = Token;
var RawToken = /** @class */ (function (_super) {
    __extends(RawToken, _super);
    function RawToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RawToken.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.content];
            });
        });
    };
    return RawToken;
}(Token));
exports.RawToken = RawToken;
var ModelKeyToken = /** @class */ (function (_super) {
    __extends(ModelKeyToken, _super);
    function ModelKeyToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModelKeyToken.prototype.render = function (template) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                value = Token.getString(this.content, template.model);
                return [2 /*return*/, value ? encoder_1.encodeHtml(value) : ''];
            });
        });
    };
    return ModelKeyToken;
}(Token));
exports.ModelKeyToken = ModelKeyToken;
var RawModelKeyToken = /** @class */ (function (_super) {
    __extends(RawModelKeyToken, _super);
    function RawModelKeyToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RawModelKeyToken.prototype.render = function (template) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Token.getString(this.content, template.model)];
            });
        });
    };
    return RawModelKeyToken;
}(ModelKeyToken));
exports.RawModelKeyToken = RawModelKeyToken;
var IncludeToken = /** @class */ (function (_super) {
    __extends(IncludeToken, _super);
    function IncludeToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IncludeToken.prototype.render = function (template, tokenizer) {
        return __awaiter(this, void 0, void 0, function () {
            var nested;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, template_1.Template.fromFile(this.content, template.model, template.dir)];
                    case 1:
                        nested = _a.sent();
                        return [2 /*return*/, tokenizer.renderTemplate(nested)];
                }
            });
        });
    };
    return IncludeToken;
}(Token));
exports.IncludeToken = IncludeToken;
var RawIncludeToken = /** @class */ (function (_super) {
    __extends(RawIncludeToken, _super);
    function RawIncludeToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RawIncludeToken.prototype.render = function (template) {
        return __awaiter(this, void 0, void 0, function () {
            var nested;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, template_1.Template.fromFile(this.content, template.model, template.dir)];
                    case 1:
                        nested = _a.sent();
                        // just return the raw file content
                        return [2 /*return*/, nested.content];
                }
            });
        });
    };
    return RawIncludeToken;
}(Token));
exports.RawIncludeToken = RawIncludeToken;
/**
 * Base class for all tokens that have start and end tags.
 */
var BlockStartToken = /** @class */ (function (_super) {
    __extends(BlockStartToken, _super);
    function BlockStartToken() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    return BlockStartToken;
}(Token));
exports.BlockStartToken = BlockStartToken;
/**
 * This is a sort of meta token that is used to signal the
 * close of a block (e.g. it's used for "/for", "/if", etc.)
 */
var BlockEndToken = /** @class */ (function (_super) {
    __extends(BlockEndToken, _super);
    function BlockEndToken(type) {
        var _this = _super.call(this, '') || this;
        _this.type = type;
        return _this;
    }
    BlockEndToken.prototype.render = function () {
        throw new Error(this.constructor.name + ".render should never be called.");
    };
    return BlockEndToken;
}(Token));
exports.BlockEndToken = BlockEndToken;
var IfToken = /** @class */ (function (_super) {
    __extends(IfToken, _super);
    function IfToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IfToken.prototype.render = function (template, tokenizer) {
        return __awaiter(this, void 0, void 0, function () {
            var condition;
            return __generator(this, function (_a) {
                condition = Token.getValue(this.content, template.model);
                return [2 /*return*/, condition ? tokenizer.renderTokens(this.children, template) : ''];
            });
        });
    };
    return IfToken;
}(BlockStartToken));
exports.IfToken = IfToken;
var UnlessToken = /** @class */ (function (_super) {
    __extends(UnlessToken, _super);
    function UnlessToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UnlessToken.prototype.render = function (template, tokenizer) {
        return __awaiter(this, void 0, void 0, function () {
            var condition;
            return __generator(this, function (_a) {
                condition = Token.getValue(this.content, template.model);
                return [2 /*return*/, !condition ? tokenizer.renderTokens(this.children, template) : ''];
            });
        });
    };
    return UnlessToken;
}(BlockStartToken));
exports.UnlessToken = UnlessToken;
var ForToken = /** @class */ (function (_super) {
    __extends(ForToken, _super);
    function ForToken(content) {
        var _this = _super.call(this, content) || this;
        var _a = ForToken.parseTokenContent(content), valueVarName = _a.valueVarName, keyVarName = _a.keyVarName, itemsKey = _a.itemsKey;
        _this.valueVarName = valueVarName;
        _this.keyVarName = keyVarName;
        _this.itemsKey = itemsKey;
        return _this;
    }
    ForToken.prototype.render = function (template, tokenizer) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = Token.getValue(this.itemsKey, template.model);
                        if (typeof collection !== 'object') {
                            return [2 /*return*/, ''];
                        }
                        promises = Object.keys(collection).map(function (k) {
                            var _a;
                            var extras = (_a = {},
                                _a[_this.valueVarName] = collection[k],
                                _a);
                            if (_this.keyVarName) {
                                extras[_this.keyVarName] = k;
                            }
                            return tokenizer.renderTokens(_this.children, template.with(extras));
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: 
                    // wait for the items to render and join them
                    return [2 /*return*/, (_a.sent()).join('')];
                }
            });
        });
    };
    ForToken.parseTokenContent = function (content) {
        var trimmed = content.trim();
        var matches = trimmed.match(/(\w+)(?:\:(\w+))?(?:\s+in\s+)(\S+)/) || [];
        var valueVarName = matches[2] ? matches[2] : matches[1];
        var keyVarName = matches[2] ? matches[1] : undefined;
        var itemsKey = matches[3];
        if (!(valueVarName && itemsKey)) {
            throw new Error("Unrecognized string \"" + trimmed + "\" in " + this.constructor.name + "."
                + '\nExpected format: "key:value in items" or "value in items"');
        }
        return { valueVarName: valueVarName, keyVarName: keyVarName, itemsKey: itemsKey, };
    };
    return ForToken;
}(BlockStartToken));
exports.ForToken = ForToken;
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
        var _a;
        var config = this.config;
        // this lops off the opening "/" sequence if present
        var _b = identInfo(content, config.closeTokenIdentifier), isClosingToken = _b.present, trimmed = _b.trimmed;
        // map of all identifiers with their corresponding token types
        var typeMap = (_a = {},
            _a[config.rawTokenIdentifier] = RawModelKeyToken,
            _a[config.rawIncludeTokenIdentifier] = RawIncludeToken,
            _a[config.includeTokenIdentifier] = IncludeToken,
            _a[config.ifTokenIdentifier] = IfToken,
            _a[config.unlessTokenIdentifier] = UnlessToken,
            _a[config.forTokenIdentifier] = ForToken,
            _a);
        // sort identifiers by length, longest first
        // this avoids cases where we might interpret "includeRaw" as "include"
        // because it starts with the same string ('include')
        var orderedIdentifiers = Object.keys(typeMap).sort(function (a, b) {
            if (a.length === b.length) {
                return 0;
            }
            return a.length > b.length ? -1 : 1;
        });
        // test for each identifier
        for (var i = 0; i < orderedIdentifiers.length; i++) {
            var identifier = orderedIdentifiers[i];
            var _c = identInfo(trimmed, identifier), isMatchingType = _c.present, tokenContents = _c.trimmed;
            if (isMatchingType) {
                var TokenType = typeMap[identifier];
                return isClosingToken
                    ? new BlockEndToken(TokenType)
                    : new TokenType(tokenContents);
            }
        }
        return new ModelKeyToken(content);
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
                target.push(new RawToken(s.substring(i, start)));
            }
            var token = this.createToken(s.substring(start + this.config.tokenStart.length, end));
            if (token instanceof BlockEndToken) {
                if (stack.length === 0) {
                    throw new Error("Found closing " + token.type.name + " without opening.");
                }
                var openingToken = stack[stack.length - 1];
                if (openingToken.constructor !== token.type) {
                    throw new Error("Found " + token.type.name + " but " + openingToken.constructor.name + " is still open.");
                }
                stack.pop();
            }
            else if (token instanceof BlockStartToken) {
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
            tokens.push(new RawToken(s.substring(i)));
        }
        return tokens;
    };
    Tokenizer.prototype.renderTokens = function (tokens, template) {
        return __awaiter(this, void 0, void 0, function () {
            var rendered;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(tokens.map(function (t) { return t.render(template, _this); }))];
                    case 1:
                        rendered = _a.sent();
                        return [2 /*return*/, rendered.join('')];
                }
            });
        });
    };
    Tokenizer.prototype.renderTemplate = function (template) {
        return __awaiter(this, void 0, void 0, function () {
            var tokens;
            return __generator(this, function (_a) {
                tokens = this.tokenize(template.content);
                return [2 /*return*/, this.renderTokens(tokens, template)];
            });
        });
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map