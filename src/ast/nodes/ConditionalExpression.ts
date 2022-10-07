import MagicString from 'magic-string';
import { BLANK } from '../../utils/blank';
import {
	findFirstOccurrenceOutsideComment,
	findNonWhiteSpace,
	NodeRenderOptions,
	removeLineBreaks,
	RenderOptions
} from '../../utils/renderHelpers';
import { removeAnnotations } from '../../utils/treeshakeNode';
import { DeoptimizableEntity } from '../DeoptimizableEntity';
import { HasEffectsContext, InclusionContext } from '../ExecutionContext';
import {
	NodeInteraction,
	NodeInteractionCalled,
	NodeInteractionWithThisArg
} from '../NodeInteractions';
import {
	EMPTY_PATH,
	ObjectPath,
	PathTracker,
	SHARED_RECURSION_TRACKER,
	UNKNOWN_PATH
} from '../utils/PathTracker';
import type * as NodeType from './NodeType';
import SpreadElement from './SpreadElement';
import { ExpressionEntity, LiteralValueOrUnknown, UnknownValue } from './shared/Expression';
import { MultiExpression } from './shared/MultiExpression';
import { ExpressionNode, IncludeChildren, NodeBase } from './shared/Node';

export default class ConditionalExpression extends NodeBase implements DeoptimizableEntity {
	declare alternate: ExpressionNode;
	declare consequent: ExpressionNode;
	declare test: ExpressionNode;
	declare type: NodeType.tConditionalExpression;

	private expressionsToBeDeoptimized: DeoptimizableEntity[] = [];
	private isBranchResolutionAnalysed = false;
	private usedBranch: ExpressionNode | null = null;

	deoptimizeCache(): void {
		if (this.usedBranch !== null) {
			const unusedBranch = this.usedBranch === this.consequent ? this.alternate : this.consequent;
			this.usedBranch = null;
			unusedBranch.deoptimizePath(UNKNOWN_PATH);
			for (const expression of this.expressionsToBeDeoptimized) {
				expression.deoptimizeCache();
			}
		}
	}

	deoptimizePath(path: ObjectPath): void {
		const usedBranch = this.getUsedBranch();
		if (!usedBranch) {
			this.consequent.deoptimizePath(path);
			this.alternate.deoptimizePath(path);
		} else {
			usedBranch.deoptimizePath(path);
		}
	}

	deoptimizeThisOnInteractionAtPath(
		interaction: NodeInteractionWithThisArg,
		path: ObjectPath,
		recursionTracker: PathTracker
	): void {
		this.consequent.deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker);
		this.alternate.deoptimizeThisOnInteractionAtPath(interaction, path, recursionTracker);
	}

	getLiteralValueAtPath(
		path: ObjectPath,
		recursionTracker: PathTracker,
		origin: DeoptimizableEntity
	): LiteralValueOrUnknown {
		const usedBranch = this.getUsedBranch();
		if (!usedBranch) return UnknownValue;
		this.expressionsToBeDeoptimized.push(origin);
		return usedBranch.getLiteralValueAtPath(path, recursionTracker, origin);
	}

	getReturnExpressionWhenCalledAtPath(
		path: ObjectPath,
		interaction: NodeInteractionCalled,
		recursionTracker: PathTracker,
		origin: DeoptimizableEntity
	): ExpressionEntity {
		const usedBranch = this.getUsedBranch();
		if (!usedBranch)
			return new MultiExpression([
				this.consequent.getReturnExpressionWhenCalledAtPath(
					path,
					interaction,
					recursionTracker,
					origin
				),
				this.alternate.getReturnExpressionWhenCalledAtPath(
					path,
					interaction,
					recursionTracker,
					origin
				)
			]);
		this.expressionsToBeDeoptimized.push(origin);
		return usedBranch.getReturnExpressionWhenCalledAtPath(
			path,
			interaction,
			recursionTracker,
			origin
		);
	}

	hasEffects(context: HasEffectsContext): boolean {
		if (this.test.hasEffects(context)) return true;
		const usedBranch = this.getUsedBranch();
		if (!usedBranch) {
			return this.consequent.hasEffects(context) || this.alternate.hasEffects(context);
		}
		return usedBranch.hasEffects(context);
	}

	hasEffectsOnInteractionAtPath(
		path: ObjectPath,
		interaction: NodeInteraction,
		context: HasEffectsContext
	): boolean {
		const usedBranch = this.getUsedBranch();
		if (!usedBranch) {
			return (
				this.consequent.hasEffectsOnInteractionAtPath(path, interaction, context) ||
				this.alternate.hasEffectsOnInteractionAtPath(path, interaction, context)
			);
		}
		return usedBranch.hasEffectsOnInteractionAtPath(path, interaction, context);
	}

	include(context: InclusionContext, includeChildrenRecursively: IncludeChildren): void {
		this.included = true;
		const usedBranch = this.getUsedBranch();
		if (includeChildrenRecursively || this.test.shouldBeIncluded(context) || usedBranch === null) {
			this.test.include(context, includeChildrenRecursively);
			this.consequent.include(context, includeChildrenRecursively);
			this.alternate.include(context, includeChildrenRecursively);
		} else {
			usedBranch.include(context, includeChildrenRecursively);
		}
	}

	includeCallArguments(
		context: InclusionContext,
		args: readonly (ExpressionEntity | SpreadElement)[]
	): void {
		const usedBranch = this.getUsedBranch();
		if (!usedBranch) {
			this.consequent.includeCallArguments(context, args);
			this.alternate.includeCallArguments(context, args);
		} else {
			usedBranch.includeCallArguments(context, args);
		}
	}

	render(
		code: MagicString,
		options: RenderOptions,
		{
			isCalleeOfRenderedParent,
			preventASI,
			renderedParentType,
			renderedSurroundingElement
		}: NodeRenderOptions = BLANK
	): void {
		const usedBranch = this.getUsedBranch();
		if (!this.test.included) {
			const colonPos = findFirstOccurrenceOutsideComment(code.original, ':', this.consequent.end);
			const inclusionStart = findNonWhiteSpace(
				code.original,
				(this.consequent.included
					? findFirstOccurrenceOutsideComment(code.original, '?', this.test.end)
					: colonPos) + 1
			);
			if (preventASI) {
				removeLineBreaks(code, inclusionStart, usedBranch!.start);
			}
			code.remove(this.start, inclusionStart);
			if (this.consequent.included) {
				code.remove(colonPos, this.end);
			}
			removeAnnotations(this, code);
			usedBranch!.render(code, options, {
				isCalleeOfRenderedParent,
				preventASI: true,
				renderedParentType: renderedParentType || this.parent.type,
				renderedSurroundingElement: renderedSurroundingElement || this.parent.type
			});
		} else {
			this.test.render(code, options, { renderedSurroundingElement });
			this.consequent.render(code, options);
			this.alternate.render(code, options);
		}
	}

	private getUsedBranch() {
		if (this.isBranchResolutionAnalysed) {
			return this.usedBranch;
		}
		this.isBranchResolutionAnalysed = true;
		const testValue = this.test.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
		return typeof testValue === 'symbol'
			? null
			: (this.usedBranch = testValue ? this.consequent : this.alternate);
	}
}
