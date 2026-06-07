import fs from 'fs-extra'
import Errors from './Errors'

namespace JSON5 {
	export async function readFile<T = unknown> (path: string): Promise<T> {
		let text: string
		try {
			text = await fs.readFile(path, 'utf8')
		}
 catch (err) {
			throw Errors.create(`Failed to read ${path}`, err)
		}

		try {
			return parse<T>(text)
		}
 catch (err) {
			throw Errors.create(`Failed to parse ${path}`, err)
		}
	}

	export function convertToJSON (text: string): string {
		return text
			.replace(/\s*\/\/[^\n"]*(?=\n)/g, '')
			.replace(/(?<=\n)\s*\/\/[^\n]*(?=\n)/g, '')
			.replace(/,(?=[^}\]"\d\w_-]*?[}\]])/gs, '')
			.replace(/(?<=[{,]\s*)([\w_]+)(?=:)/g, '"$1"')
	}

	export function parse<T = unknown> (text: string): T {
		text = convertToJSON(text)
		return JSON.parse(text) as T
	}
}

export default JSON5
