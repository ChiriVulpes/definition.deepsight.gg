export enum DeepsightPerkEffectType {
	DamageBuff,
	StackingDamageBuffDynamic,
	StackingDamageBuffStaticAdditive,
	StackingDamageBuffStaticMultiplicative,
}

export interface DeepsightPerkDefinition {
	effects: DeepsightPerkEffect[]
	notes?: string[]
}

export interface DeepsightPerkEffectBase {
	type: DeepsightPerkEffectType
}

export interface DeepsightPerkDamageBuff extends DeepsightPerkEffectBase {
	damage: number
}

export interface DeepsightPerkDamageBuffStackingDynamic<MAX_STACKS extends number> extends DeepsightPerkEffectBase {
	maxStacks: MAX_STACKS
	damage: number[] & { length: NoInfer<MAX_STACKS> }
}

export interface DeepsightPerkDamageBuffStackingStaticAdditive extends DeepsightPerkEffectBase {
	maxStacks: number
	damagePerStack: number
}

export interface DeepsightPerkDamageBuffStackingStaticMultiplicative extends DeepsightPerkEffectBase {
	maxStacks: number
	damagePerStack: number
}

export type DeepsightPerkEffect =
	| DeepsightPerkDamageBuff
	| DeepsightPerkDamageBuffStackingDynamic<number>
	| DeepsightPerkDamageBuffStackingStaticAdditive
	| DeepsightPerkDamageBuffStackingStaticMultiplicative
