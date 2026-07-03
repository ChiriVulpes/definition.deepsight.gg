import { Log } from 'task'

const PROGRESS_BAR_SIZE = 20
const PROGRESS_HEARTBEAT_MS = 3000

export class ProgressLogger {
	private completed = 0
	private loggedProgressFraction = 0
	private lastLogTime = Date.now()

	constructor (
		private readonly operationLabel: string,
		private readonly total: number,
		private readonly itemLabel = operationLabel,
	) {}

	start () {
		this.log('Starting')
	}

	advance (stage: string, itemName?: string) {
		this.completed++

		const progressFraction = this.progressFraction()
		const now = Date.now()
		if (this.completed !== this.total && progressFraction <= this.loggedProgressFraction && now - this.lastLogTime < PROGRESS_HEARTBEAT_MS)
			return

		this.log(stage, itemName)
		this.loggedProgressFraction = progressFraction
		this.lastLogTime = now
	}

	private log (stage: string, itemName?: string) {
		const progressFraction = this.progressFraction()
		Log.info(
			stage === 'Starting' ? `${stage} ${this.operationLabel}` : `${stage} ${this.itemLabel}`,
			`[${'#'.repeat(progressFraction)}${' '.repeat(PROGRESS_BAR_SIZE - progressFraction)}]`,
			`${this.completed}/${this.total}`,
			itemName ?? '',
		)
	}

	private progressFraction () {
		return this.total ? Math.floor((this.completed / this.total) * PROGRESS_BAR_SIZE) : PROGRESS_BAR_SIZE
	}
}

export async function runConcurrent<T> (items: readonly T[], concurrency: number, run: (item: T) => Promise<void>) {
	let index = 0
	const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
		while (index < items.length) {
			const item = items[index++]
			await run(item)
		}
	})

	await Promise.all(workers)
}
