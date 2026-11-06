import { afterEach, expect, it, vi } from 'vitest';
import { fetchLocalFolders } from './folder-bridge';

afterEach(() => vi.unstubAllGlobals());

it('loads only top-level folder paths with the connection token', async () => {
	const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ vault: 'Notes', folders: ['工具', '工具/开发'] })));
	vi.stubGlobal('fetch', fetchMock);
	expect(await fetchLocalFolders('secret')).toEqual({ vault: 'Notes', folders: ['工具'] });
	expect(fetchMock.mock.calls[0][1].headers['X-Folder-Bridge-Token']).toBe('secret');
});

it('rejects an invalid response', async () => {
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ vault: 'Notes', folders: [1] }))));
	await expect(fetchLocalFolders('secret')).rejects.toThrow('Invalid Folder Bridge response');
});
