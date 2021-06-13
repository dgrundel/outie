import { Template } from '../../template';
import { Token } from './Token';
/**
 * Base class for all tokens that have start and end tags.
 */
export declare abstract class BlockStartToken extends Token {
    protected readonly children: Token[];
    append(child: Token): void;
    render(template: Template): Promise<string>;
}
//# sourceMappingURL=BlockStartToken.d.ts.map