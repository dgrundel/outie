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
exports.ForToken = void 0;
var BlockStartToken_1 = require("./BlockStartToken");
var Token_1 = require("./Token");
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
    ForToken.prototype.render = function (template) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = Token_1.Token.getValue(this.itemsKey, template.model);
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
                            return Token_1.Token.renderTokens(_this.children, template.withExtras(extras));
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
}(BlockStartToken_1.BlockStartToken));
exports.ForToken = ForToken;
//# sourceMappingURL=ForToken.js.map