export async function fetchLocalFolders(token: string): Promise<{ vault: string; folders: string[] }> {
	const response = await fetch('http://127.0.0.1:27124/folders', {
		headers: { 'X-Folder-Bridge-Token': token },
		signal: AbortSignal.timeout(2000),
	});
	if (!response.ok) throw new Error(`Folder Bridge returned ${response.status}`);
	const data: unknown = await response.json();
	if (!data || typeof data !== 'object' ||
		typeof (data as { vault?: unknown }).vault !== 'string' ||
		!Array.isArray((data as { folders?: unknown }).folders) ||
		!(data as { folders: unknown[] }).folders.every(folder => typeof folder === 'string')) {
		throw new Error('Invalid Folder Bridge response');
	}
	const result = data as { vault: string; folders: string[] };
	return { ...result, folders: result.folders.filter(folder => !folder.includes('/')) };
}
