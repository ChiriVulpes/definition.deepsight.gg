import fs from 'fs/promises'

export default async function getDestinyManifestComponents () {
	const testiny = await fs.readdir('static/testiny')
	return testiny
		.filter(file => file !== '.v')
		.map(file => file.replace('.json', ''))
}
