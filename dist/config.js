"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var defaultConfig = {
    tokenStart: '{',
    tokenEnd: '}',
    closeTokenIdentifier: '/',
    rawTokenIdentifier: 'raw',
    rawIncludeTokenIdentifier: 'includeRaw',
    includeTokenIdentifier: 'include',
    ifTokenIdentifier: 'if',
    unlessTokenIdentifier: 'unless',
    forTokenIdentifier: 'for',
};
var getConfig = function (userConfig) {
    if (userConfig === void 0) { userConfig = {}; }
    return Object.assign({}, defaultConfig, userConfig);
};
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map