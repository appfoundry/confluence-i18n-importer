export default interface Translation {
	TechnicalId: string
	PageName: string
	Image: string
	// translations
	[index:string]: string
}