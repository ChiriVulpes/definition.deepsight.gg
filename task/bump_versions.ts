/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import ansi from 'ansicolor'
import fs from 'fs-extra'
import { diff } from 'json-diff'
import path from 'path'
import { Task } from 'task'
import { DESTINY_MANIFEST_VERSION } from './destiny_manifest'
import Env from './utility/Env'
import Hash from './utility/Hash'
import Log from './utility/Log'
import Time from './utility/Time'

async function readData (file: string) {
	switch (path.extname(file)) {
		case '.json':
			return fs.readJson(file)
				.catch(err => {
					throw new Error(`Failed to parse ${file}: ${err.message}`)
				})
		case '.ts': {
			const basename = path.basename(file)
			if (basename === 'Enums.d.ts')
				return fs.readFile(file, 'utf8')
					.then(contents => contents
						.replace(/\/\*.*?\*\//gs, '')
						.replace(/export declare const enum (\w+)|([$\w]+) =/g, '"$1$2":').replace(/ =/g, ':')
						.replace(/(?<=})\n+(?=")/g, ',\n')
						.replace(/,(?=\s+})/g, '')
					)
					.then(async jsonText => {
						jsonText = `{${jsonText}}`
						if (Env.DEEPSIGHT_ENVIRONMENT === 'dev')
							await fs.writeFile(path.join(path.dirname(file), 'Enums.json'), jsonText)
						return JSON.parse(jsonText)
					})
					.catch(err => {
						throw new Error(`Failed to parse ${file}: ${err.message}`)
					})

			return fs.readFile(file, 'utf8')
		}
	}
}

const DEFAULT_VERSION = Env.DEEPSIGHT_ENVIRONMENT === 'dev' ? Date.now() : -1

export default Task('bump_versions', async () => {
	const isDev = Env.DEEPSIGHT_ENVIRONMENT === 'dev'
	if (!isDev && !await fs.pathExists('definitions'))
		throw new Error('No output folder detected')

	const dir = `${isDev ? 'docs/' : ''}definitions/`
	const versionsFilePath = `${dir}manifest.json`
	const versions = await fs.readJson(versionsFilePath).catch(() => ({}))
	const files = await fs.readdir('docs/definitions')

	let bumped = false
	const bumpMap: Record<string, true> = {}

	for (const file of files) {
		if (file === 'manifest.json')
			continue

		const newPath = `docs/definitions/${file}`
		if (!isDev) {
			const oldPath = `definitions/${file}`
			const jsonOld = await readData(oldPath).catch(() => undefined)
			const jsonNew = await readData(newPath)
			if (jsonOld && (typeof jsonNew === 'string' ? jsonOld === jsonNew : !diff(jsonOld, jsonNew)))
				continue

			await fs.copyFile(newPath, oldPath)
		}
		else {
			await readData(newPath)
			if (!await Hash.fileChanged(newPath))
				continue
		}

		let basename = path.basename(file, path.extname(file))
		basename = path.basename(basename, path.extname(basename))
		if (bumpMap[basename])
			continue

		bumpMap[basename] = true
		versions[basename] = (versions[basename] ?? DEFAULT_VERSION) + 1
		Log.info(`Bumped ${ansi.lightGreen(basename)} version to ${ansi.lightYellow(versions[basename].toString(36).toUpperCase())}`)
		bumped = true
	}

	let interfacesFile = await fs.readFile('docs/definitions/Interfaces.d.ts', 'utf8')
	interfacesFile = interfacesFile.replace('// @inject:versions', Object.keys(bumpMap)
		.map(key => `\t'${key}': number`)
		.join('\n')
		.slice(1))
	await fs.writeFile('docs/definitions/Interfaces.d.ts', interfacesFile)

	if (bumped) {
		versions.deepsight = (versions.deepsight ?? DEFAULT_VERSION) + 1
		versions.updated = Time.iso()

		const packageJson = JSON.parse(await fs.readFile(`${dir}package.json`, 'utf8').catch(() => '{ "name": "deepsight.gg", "version": "1.0.0", "types": "Interfaces.d.ts" }')) as { version: string }
		const packageJsonVersionMinor = packageJson.version.slice(0, packageJson.version.lastIndexOf('.'))
		packageJson.version = `${packageJsonVersionMinor}.${versions.deepsight}`
		await fs.writeFile(`${dir}package.json`, JSON.stringify(packageJson, null, '\t'))
	}

	versions['Destiny2/Manifest'] = DESTINY_MANIFEST_VERSION
	await fs.writeJson(versionsFilePath, versions, { spaces: '\t' })
})
