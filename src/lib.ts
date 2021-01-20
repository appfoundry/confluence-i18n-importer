import htmlTableToJson from 'html-table-to-json'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import prettier from 'prettier'

import {Translation, ConfluencePage} from './types'

const ignoredTranslationProperties = ['TechnicalId', 'PageName', 'Image']

const getFileExtension = (useTypeScript: boolean) => (useTypeScript ? 'ts' : 'js')

const parseTableStringToJson = (value: string): Translation[] => htmlTableToJson.parse(value).results[0]

const translationToTuple = (translation: Translation, translationKey: string) => [
	translation.TechnicalId,
	translation[translationKey],
]

const buildTranslationDictionary = (json: Translation[]) => {
	const translationsDictionary = new Map()

	for (const translation of json) {
		// Get the language keys
		const translationsKeys = Object.keys(translation).filter((t) => !ignoredTranslationProperties.includes(t))

		for (const translationKey of translationsKeys) {
			// Add translation tuple of [technicalId, translationValue] to dictionary
			if (translationsDictionary.has(translationKey)) {
				translationsDictionary.set(translationKey, [
					...translationsDictionary.get(translationKey),
					translationToTuple(translation, translationKey),
				])
			} else {
				translationsDictionary.set(translationKey, [translationToTuple(translation, translationKey)])
			}
		}
	}

	return translationsDictionary
}

const translationsToJSFile = (translations: [string, string], noEmptyValues: boolean) => {
	return prettier.format(
		`export default {${translations
			.filter(([_, value]) => !noEmptyValues || (noEmptyValues && value))
			.map(([key, value]) => `${key}: ${`\`${value.replace(/\s/g, ' ')}\``}`)}}`,
		{parser: 'babel'}
	)
}

const writeI18nFiles = (
	json: Translation[],
	useTypeScript: boolean,
	noEmptyValues: boolean,
	outputDirectory: string
) => {
	const translationsDictionary = buildTranslationDictionary(json)

	for (const languageEntry of translationsDictionary) {
		const [translationLanguage, translations] = languageEntry
		const extension = getFileExtension(useTypeScript)

		fs.writeFileSync(
			`${outputDirectory}${path.sep}${translationLanguage}.${extension}`,
			translationsToJSFile(translations, noEmptyValues)
		)
	}
}

export const parseI18nFromConfluence = async (
	domain: string,
	pageId: string,
	username: string,
	password: string,
	useTypeScript: boolean,
	noEmptyValues: boolean,
	outputDirectiory: string
) => {
	try {
		const restResponse = await fetch(`${domain}/rest/api/content/${pageId}?expand=body.storage`, {
			headers: {
				Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
			},
		})

		const jsonResponse: ConfluencePage = await restResponse.json()

		writeI18nFiles(
			parseTableStringToJson(jsonResponse.body.storage.value),
			useTypeScript,
			noEmptyValues,
			outputDirectiory
		)
	} catch (error) {
		throw error
	}
}
