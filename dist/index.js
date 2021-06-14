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
exports.Outie = exports.BlockStartToken = exports.Token = exports.Template = exports.MruCache = exports.defaultConfig = void 0;
var config_1 = require("./config");
var tokenizer_1 = require("./tokenizer");
var template_1 = require("./template");
var config_2 = require("./config");
Object.defineProperty(exports, "defaultConfig", { enumerable: true, get: function () { return config_2.defaultConfig; } });
var cache_1 = require("./cache");
Object.defineProperty(exports, "MruCache", { enumerable: true, get: function () { return cache_1.MruCache; } });
var template_2 = require("./template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return template_2.Template; } });
var Token_1 = require("./tokens/core/Token");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return Token_1.Token; } });
var BlockStartToken_1 = require("./tokens/core/BlockStartToken");
Object.defineProperty(exports, "BlockStartToken", { enumerable: true, get: function () { return BlockStartToken_1.BlockStartToken; } });
var Outie = /** @class */ (function () {
    function Outie(userConfig) {
        var config = config_1.getConfig(userConfig);
        this.config = config;
        this.tokenizer = new tokenizer_1.Tokenizer(config);
    }
    /**
     * Pre-compile a template string
     *
     * @param template - a template string to compile
     * @returns pre-compiled template
     */
    Outie.prototype.template = function (template) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, template_1.Template.fromString(template, this.tokenizer)];
                    case 1:
                        t = _a.sent();
                        t.compile();
                        return [2 /*return*/, t];
                }
            });
        });
    };
    /**
     * Pre-compile a template from a file
     *
     * @param filePath - absolute path to template file
     * @returns pre-compiled template
     */
    Outie.prototype.templateFromFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, template_1.Template.fromFile(filePath, this.tokenizer)];
                    case 1:
                        t = _a.sent();
                        t.compile();
                        return [2 /*return*/, t];
                }
            });
        });
    };
    /**
     * Render a template string.
     *
     * @param template - template string
     * @param model - data model
     * @returns - Promise<string>, rendered template
     */
    Outie.prototype.render = function (template, model) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, template_1.Template.fromString(template, this.tokenizer)];
                    case 1:
                        t = _a.sent();
                        return [2 /*return*/, t.render(model)];
                }
            });
        });
    };
    /**
     * Render the contents of a file as a template.
     *
     * @param filePath - absolute path to file
     * @param model - data model
     * @returns - Promise<string>, rendered template
     */
    Outie.prototype.renderFile = function (filePath, model) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, template_1.Template.fromFile(filePath, this.tokenizer)];
                    case 1:
                        t = _a.sent();
                        return [2 /*return*/, t.render(model)];
                }
            });
        });
    };
    return Outie;
}());
exports.Outie = Outie;
//# sourceMappingURL=index.js.map