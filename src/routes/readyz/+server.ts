// api endpoint: /model-base/<helm-release-tag>/readyz
// used for readiness probe by kublet
export function GET({ url }) {
	// response : {"status":"ok"}
	return new Response(JSON.stringify({ status: 'ok' }));
}
