import Define from './Define'

declare global {
	interface Map<K, V> {
		compute (key: K, ifAbsent: (key: K) => V): V
	}
}

namespace Maps {
	export function applyPrototypes () {
		Define(Map.prototype, 'compute', function <K, V> (this: Map<K, V>, key: K, ifAbsent: (key: K) => V) {
			let value = this.get(key)
			if (value !== undefined)
				return value
			value = ifAbsent(key)
			this.set(key, value)
			return value
		})
	}
}

export default Maps
