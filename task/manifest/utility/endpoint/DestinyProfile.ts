import type { DestinyProfileResponse } from 'bungie-api-ts/destiny2'
import fs from 'fs-extra'
import Env from '../../../utility/Env'
import Log from '../../../utility/Log'
import Model from '../../../utility/Model'
import DestinyComponents from './DestinyComponents'
import DestinyRequest from './DestinyRequest'

const membershipId = Env.DEEPSIGHT_MANIFEST_USER_MEMBERSHIP_ID
const membershipType = Env.DEEPSIGHT_MANIFEST_USER_MEMBERSHIP_TYPE
const cachePath = 'static/testiny/profile.json'

export default Model(async () => {
	const profile = await DestinyRequest<DestinyProfileResponse>(`Destiny2/${membershipType}/Profile/${membershipId}/?components=${DestinyComponents.join(',')}`)
	if (profile) {
		await fs.ensureDir('static/testiny')
		await fs.writeJson(cachePath, profile)
		return profile
	}

	const cached = await fs.readJson(cachePath)
		.catch(() => undefined) as DestinyProfileResponse | undefined
	if (cached) {
		Log.info(`Using cached Destiny profile from ${cachePath}`)
		return cached
	}

	return undefined
})
