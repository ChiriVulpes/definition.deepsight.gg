import Define from './Define'
import type { PromiseOr } from './Type'

const AsyncGenerator = (async function* () { })().constructor as { prototype: AsyncGenerator<unknown> }

declare global {
	interface AsyncGenerator<T = unknown, TReturn = any, TNext = any> {
		filter (fn: (value: T, index: number) => PromiseOr<unknown>): AsyncGenerator<T, TReturn, TNext>
		map<U> (fn: (value: T, index: number) => PromiseOr<U>): AsyncGenerator<U, TReturn, TNext>
		flat<U> (this: AsyncGenerator<U | Iterable<U> | AsyncIterable<U>, TReturn, TNext>): AsyncGenerator<U, TReturn, TNext>
		flatMap<U> (fn: (value: T, index: number) => PromiseOr<U[]>): AsyncGenerator<U, TReturn, TNext>
		reduce<U> (fn: (accumulator: U, value: T, index: number) => PromiseOr<U>, initialValue: U): Promise<U>
		toArray (): Promise<T[]>
		toSet (): Promise<Set<T>>
		toObject<K, V> (this: AsyncGenerator<readonly [K, V], TReturn, TNext>): Promise<Record<K & (string | number | symbol), V>>
		toObject<K, V> (mapper: (value: T, index: number) => PromiseOr<readonly [K, V]>): Promise<Record<K & (string | number | symbol), V>>
		toMap<K, V> (this: AsyncGenerator<readonly [K, V], TReturn, TNext>): Promise<Map<K, V>>
		toMap<K, V> (mapper: (value: T, index: number) => PromiseOr<readonly [K, V]>): Promise<Map<K, V>>
		groupBy<K> (keyMapper: (value: T, index: number) => PromiseOr<K>): Promise<Map<K, T[]>>
		groupBy<K, G> (keyMapper: (value: T, index: number) => PromiseOr<K>, groupMapper: (value: T[], index: number) => PromiseOr<G>): Promise<Map<K, G>>
	}
}

namespace Generators {
	export function applyPrototypes () {
		Define(AsyncGenerator.prototype, 'filter', async function* <T> (this: AsyncGenerator<T>, fn: (value: T, index: number) => unknown) {
			let index = 0
			for await (const value of this)
				if (await fn(value, index++))
					yield value
		})

		Define(AsyncGenerator.prototype, 'map', async function* <T, U> (this: AsyncGenerator<T>, fn: (value: T, index: number) => U) {
			let index = 0
			for await (const value of this)
				yield await fn(value, index++)
		})

		Define(AsyncGenerator.prototype, 'flat', async function* <T> (this: AsyncGenerator<T>) {
			for await (const iterable of this)
				if (typeof iterable === 'object' && iterable && Symbol.asyncIterator in iterable)
					for await (const value of iterable as AsyncIterable<T>)
						yield value
				else if (typeof iterable === 'object' && iterable && Symbol.iterator in iterable)
					for (const value of iterable as Iterable<T>)
						yield value
				else
					yield iterable
		})

		Define(AsyncGenerator.prototype, 'flatMap', function <T, U> (this: AsyncGenerator<T>, fn: (value: T, index: number) => PromiseOr<U | Iterable<U>>) {
			return this.map(fn).flat()
		})

		Define(AsyncGenerator.prototype, 'reduce', async function <T, U> (this: AsyncGenerator<T>, fn: (accumulator: U, value: T, index: number) => PromiseOr<U>, initialValue: U): Promise<U> {
			let accumulator = initialValue
			let index = 0
			for await (const value of this)
				accumulator = await fn(accumulator, value, index++)
			return accumulator
		})

		Define(AsyncGenerator.prototype, 'toArray', async function <T> (this: AsyncGenerator<T>): Promise<T[]> {
			const array: T[] = []
			for await (const value of this)
				array.push(value)
			return array
		})

		Define(AsyncGenerator.prototype, 'toSet', async function <T> (this: AsyncGenerator<T>): Promise<Set<T>> {
			const set = new Set<T>()
			for await (const value of this)
				set.add(value)
			return set
		})

		Define(AsyncGenerator.prototype, 'toObject', async function <T, K, V> (this: AsyncGenerator<T>, mapper?: (value: T, index: number) => PromiseOr<readonly [K, V]>): Promise<Record<K & (string | number | symbol), V>> {
			const object = {} as Record<K & (string | number | symbol), V>
			let index = 0
			for await (const value of this) {
				const [key, val] = mapper ? await mapper(value, index++) : (value as unknown as [K, V])
				object[key as K & (string | number | symbol)] = val
			}
			return object
		})

		Define(AsyncGenerator.prototype, 'toMap', async function <T, K, V> (this: AsyncGenerator<T>, mapper?: (value: T, index: number) => PromiseOr<readonly [K, V]>): Promise<Map<K, V>> {
			const map = new Map<K, V>()
			let index = 0
			for await (const value of this) {
				const [key, val] = mapper ? await mapper(value, index++) : (value as unknown as [K, V])
				map.set(key, val)
			}
			return map
		})

		Define(AsyncGenerator.prototype, 'groupBy', async function <T, K, G = T[]> (this: AsyncGenerator<T>, keyMapper: (value: T, index: number) => PromiseOr<K>, groupMapper?: (value: T[], index: number) => PromiseOr<G>): Promise<Map<K, G>> {
			const map = new Map<K, T[]>()
			let index = 0
			for await (const value of this) {
				const key = await keyMapper(value, index++)
				if (!map.has(key))
					map.set(key, [])
				map.get(key)!.push(value)
			}
			if (!groupMapper)
				return map as Map<K, G>

			const resultMap = new Map<K, G>()
			index = 0
			for (const [key, group] of map)
				resultMap.set(key, await groupMapper(group, index++))
			return resultMap
		})
	}
}

export default Generators
