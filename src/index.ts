import arg from 'arg'

import {parseI18nFromConfluence} from './lib'

const parseArgumentsIntoOptions = (rawArgs: string[]) => {
	const args = arg(
		{
			'--domain': String,
			'--pageid': String,
			'--username': String,
			'--password': String,
			'--typescript': Boolean,
			'--outputdir': String,
			'-d': '--domain',
			'-i': '--pageid',
			'-u': '--username',
			'-p': '--password',
			'-t': '--typescript',
			'-o': '--outputdir',
		},
		{
			argv: rawArgs.slice(2),
		}
	)
	return {
		domain: args['--domain'],
		pageId: args['--pageid'],
		username: args['--username'],
		password: args['--password'],
		useTypeScript: Boolean(args['--typescript']),
		outputDir: args['--outputdir'] || '.',
	}
}

export const cli = (args: string[]) => {
	const options = parseArgumentsIntoOptions(args)

	parseI18nFromConfluence(
		options.domain,
		options.pageId,
		options.username,
		options.password,
		options.useTypeScript,
		options.outputDir
	)
		.then(() => console.log('Successfully written i18n files'))
		.catch((err) => console.error('Error while parsing i18 from Confluence', err))
}
