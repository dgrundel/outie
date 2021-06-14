"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.defaultConfig = void 0;
var ForToken_1 = require("./tokens/ForToken");
var IfToken_1 = require("./tokens/IfToken");
var IncludeToken_1 = require("./tokens/IncludeToken");
var RawIncludeToken_1 = require("./tokens/RawIncludeToken");
var RawModelKeyToken_1 = require("./tokens/RawModelKeyToken");
var UnlessToken_1 = require("./tokens/UnlessToken");
var cache_1 = require("./cache");
exports.defaultConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    closeTokenIdentifier: '/',
    tokens: {
        'raw': RawModelKeyToken_1.RawModelKeyToken,
        'includeRaw': RawIncludeToken_1.RawIncludeToken,
        'include': IncludeToken_1.IncludeToken,
        'if': IfToken_1.IfToken,
        'unless': UnlessToken_1.UnlessToken,
        'for': ForToken_1.ForToken,
    },
    fileCache: new cache_1.MruCache(),
};
var getConfig = function (userConfig) {
    if (userConfig === void 0) { userConfig = {}; }
    return Object.assign({}, exports.defaultConfig, userConfig);
};
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map