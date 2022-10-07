import type MagicString from 'magic-string';
import { type RenderOptions, renderStatementList } from '../../utils/renderHelpers';
import type { HasEffectsContext, InclusionContext } from '../ExecutionContext';
import type * as NodeType from './NodeType';
import { type IncludeChildren, NodeBase, type StatementNode } from './shared/Node';

export default class Program extends NodeBase {
	declare body: readonly StatementNode[];
	declare sourceType: 'module';
	declare type: NodeType.tProgram;

	private hasCachedEffect = false;

	hasEffects(context: HasEffectsContext): boolean {
		// We are caching here to later more efficiently identify side-effect-free modules
		if (this.hasCachedEffect) return true;
		for (const node of this.body) {
			if (node.hasEffects(context)) {
				return (this.hasCachedEffect = true);
			}
		}
		return false;
	}

	include(context: InclusionContext, includeChildrenRecursively: IncludeChildren): void {
		this.included = true;
		for (const node of this.body) {
			if (includeChildrenRecursively || node.shouldBeIncluded(context)) {
				node.include(context, includeChildrenRecursively);
			}
		}
	}

	render(code: MagicString, options: RenderOptions): void {
		if (this.body.length) {
			renderStatementList(this.body, code, this.start, this.end, options);
		} else {
			super.render(code, options);
		}
	}

	protected applyDeoptimizations() {}
}
