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
			'--noEmpty': Boolean,
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
		noEmptyValues: Boolean(args['--noEmpty']),
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
		options.noEmptyValues,
		options.outputDir
	)
		.then(() => console.log('Successfully written i18n files'))
		.catch((err) => console.error('Error while parsing i18n from Confluence', err))
}
