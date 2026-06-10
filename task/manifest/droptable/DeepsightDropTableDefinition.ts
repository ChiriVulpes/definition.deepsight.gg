import type { ActivityHashes } from '@deepsight.gg/Enums'
import type { DeepsightDropTableDefinition as DeepsightDropTableDefinitionBase, DeepsightDropTableRotationsDefinition as DeepsightDropTableRotationsDefinitionBase, ISOString } from '../../../static/definitions/Interfaces'
import type { PromiseOr } from '../../utility/Type'
import type DestinyManifestReference from '../DestinyManifestReference'
import CrotasEnd from './CrotasEnd'
import DeepStoneCrypt from './DeepStoneCrypt'
import DesertPerpetual from './DesertPerpetual'
import Duality from './Duality'
import GardenOfSalvation from './GardenOfSalvation'
import GhostsOfTheDeep from './GhostsOfTheDeep'
import GraspOfAvarice from './GraspOfAvarice'
import KingsFall from './KingsFall'
import LastWish from './LastWish'
import PitOfHeresy from './PitOfHeresy'
import Prophecy from './Prophecy'
import RootOfNightmares from './RootOfNightmares'
import SalvationsEdge from './SalvationsEdge'
import SpireOfTheWatcher from './SpireOfTheWatcher'
import SunderedDoctrine from './SunderedDoctrine'
import TheShatteredThrone from './TheShatteredThrone'
import VaultOfGlass from './VaultOfGlass'
import VespersHost from './VespersHost'
import VowOfTheDisciple from './VowOfTheDisciple'
import WarlordsRuin from './WarlordsRuin'

export interface DeepsightDropTableDefinition extends Omit<DeepsightDropTableDefinitionBase, 'displayProperties' | 'rotations' | 'type' | 'typeDisplayProperties' | 'hash'> {
	hash: ActivityHashes
	displayProperties?: DestinyManifestReference.DisplayPropertiesDefinition
	rotations?: DeepsightDropTableRotationsDefinition
	type?: DeepsightDropTableDefinitionBase['type']
	typeDisplayProperties?: DeepsightDropTableDefinitionBase['typeDisplayProperties']
	pgcrImage?: string
}

export interface DeepsightDropTableRotationsDefinition extends Omit<DeepsightDropTableRotationsDefinitionBase, 'interval' | 'current' | 'next'> {
	interval?: 'daily'
	current?: number
	next?: ISOString
}

export type DeepsightDropTableDefinitionFactory = () => PromiseOr<DeepsightDropTableDefinition>
export type DeepsightDropTableDefinitionModule = DeepsightDropTableDefinition | DeepsightDropTableDefinitionFactory

const dropTableModules: DeepsightDropTableDefinitionModule[] = [
	SunderedDoctrine,
	VespersHost,
	WarlordsRuin,
	GhostsOfTheDeep,
	SpireOfTheWatcher,
	Duality,
	GraspOfAvarice,
	Prophecy,
	PitOfHeresy,
	TheShatteredThrone,

	DesertPerpetual,
	SalvationsEdge,
	CrotasEnd,
	RootOfNightmares,
	KingsFall,
	VowOfTheDisciple,
	VaultOfGlass,
	DeepStoneCrypt,
	GardenOfSalvation,
	LastWish,
]

export default async function getDeepsightDropTableDefinition () {
	const definitions = await Promise.all(dropTableModules.map(resolveDropTableModule))
	return Object.fromEntries(definitions.map(definition => [definition.hash, definition])) as Partial<Record<ActivityHashes, DeepsightDropTableDefinition>>
}

async function resolveDropTableModule (module: DeepsightDropTableDefinitionModule) {
	return typeof module === 'function' ? await module() : module
}
