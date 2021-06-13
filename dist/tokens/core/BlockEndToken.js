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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockEndToken = void 0;
var Token_1 = require("./Token");
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
}(Token_1.Token));
exports.BlockEndToken = BlockEndToken;
//# sourceMappingURL=BlockEndToken.js.map