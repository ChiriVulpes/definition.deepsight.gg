import { InventoryItemHashes } from "@deepsight.gg/Enums";
import { DeepsightPerkDamageBuff, DeepsightPerkDamageBuffStackingDynamic, DeepsightPerkDamageBuffStackingStaticAdditive, DeepsightPerkDamageBuffStackingStaticMultiplicative, DeepsightPerkDefinition, DeepsightPerkEffectType } from "./IDeepsightPerkDefinition";
import DefinitionTable from "./utility/DefinitionTable";

export function Damage (damage: number): DeepsightPerkDamageBuff {
	return { type: DeepsightPerkEffectType.DamageBuff, damage }
}
export function StackingDamage<const MAX_STACKS extends number> (maxStacks: MAX_STACKS, damage: number[] & { length: NoInfer<MAX_STACKS> }): DeepsightPerkDamageBuffStackingDynamic<MAX_STACKS> {
	return { type: DeepsightPerkEffectType.StackingDamageBuffDynamic, maxStacks, damage }
}
export function StackingDamageAdditive (maxStacks: number, damagePerStack: number): DeepsightPerkDamageBuffStackingStaticAdditive {
	return { type: DeepsightPerkEffectType.StackingDamageBuffStaticAdditive, maxStacks, damagePerStack }
}
export function StackingDamageMultiplicative (maxStacks: number, damagePerStack: number): DeepsightPerkDamageBuffStackingStaticMultiplicative {
	return { type: DeepsightPerkEffectType.StackingDamageBuffStaticMultiplicative, maxStacks, damagePerStack }
}

export default DefinitionTable<Record<number, DeepsightPerkDefinition>>('DeepsightPerkDefinition', async () => {
	return {
		// a lot of these formulas subtract 0.5 to account for the ceil that happens ingame before we see the numbers

		[InventoryItemHashes.RampageTraitPlug_TooltipNotificationsLength1]: {
			// there's some weird shit going on here for some archetypes. x1.1 per stack is a pretty midground between everything
			// Math.ceil((base - 0.5) * (1.1 ** stacks))
			effects: [StackingDamageMultiplicative(3, 0.10)]
		},

		[InventoryItemHashes.OneForAllTraitPlug]: {
			// Math.ceil((base - 0.5) * 1.35)
			effects: [Damage(0.35)],
		},

		[InventoryItemHashes.PrecisionInstrumentTraitPlug]: {
			// Math.ceil((base - 0.5) * (1 + (0.25 / 6) * stacks))
			effects: [StackingDamageAdditive(6, 0.25 / 6)],
		},
		[InventoryItemHashes.PrecisionInstrumentEnhancedTraitPlug]: {
			// Math.ceil((base - 0.5) * (1 + (0.3 / 6) * stacks))
			effects: [StackingDamageAdditive(6, 0.30 / 6)],
		},

	}
})
