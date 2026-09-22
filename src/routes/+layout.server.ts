declare global {
	var style: string;
	var theme: string;
}

export async function load() {
	console.log('inside layout server');
	return {
		style: globalThis.style,
		theme: globalThis.theme
	};
}
