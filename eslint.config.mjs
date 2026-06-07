import lint from 'lint'

export { lint }
export default [
	...lint(import.meta.dirname, {
		allowDefaultProject: ['*.mjs'],
	}),
	{
		ignores: ['static/definitions/Enums.d.ts', 'docs/definitions/Enums.d.ts'],
	},
]
