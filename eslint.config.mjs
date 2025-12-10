import lint from 'lint'

export { lint }
export default [
	...lint(import.meta.dirname),
	{
		ignores: ['static/definitions/Enums.d.ts', 'docs/definitions/Enums.d.ts'],
	},
]
