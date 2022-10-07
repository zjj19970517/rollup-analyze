import type MagicString from 'magic-string';
import type { RenderOptions } from '../../utils/renderHelpers';
import type { InclusionContext } from '../ExecutionContext';
import * as NodeType from './NodeType';
import { type ExpressionNode, StatementBase } from './shared/Node';

export default class ExpressionStatement extends StatementBase {
	declare directive?: string;
	declare expression: ExpressionNode;

	initialise(): void {
		if (
			this.directive &&
			this.directive !== 'use strict' &&
			this.parent.type === NodeType.Program
		) {
			this.context.warn(
				// This is necessary, because either way (deleting or not) can lead to errors.
				{
					code: 'MODULE_LEVEL_DIRECTIVE',
					message: `Module level directives cause errors when bundled, '${this.directive}' was ignored.`
				},
				this.start
			);
		}
	}

	render(code: MagicString, options: RenderOptions): void {
		super.render(code, options);
		if (this.included) this.insertSemicolon(code);
	}

	shouldBeIncluded(context: InclusionContext): boolean {
		if (this.directive && this.directive !== 'use strict')
			return this.parent.type !== NodeType.Program;

		return super.shouldBeIncluded(context);
	}

	protected applyDeoptimizations() {}
}
