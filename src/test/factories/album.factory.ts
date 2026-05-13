import { AlbumStatus, type Album, type AlbumImage } from '@/features/album/types/album.types';

let albumCounter = 0;
let imageCounter = 0;

export function createAlbum(overrides?: Partial<Album>): Album {
  const id = `album-${++albumCounter}`;
  return {
    id,
    classId: 'class-1',
    name: `Test Album ${albumCounter}`,
    description: 'Test album description',
    status: AlbumStatus.DRAFT,
    creatorId: 'user-1',
    boxFolderId: `box-folder-${albumCounter}`,
    coverImageId: undefined,
    imageCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createAlbumImage(overrides?: Partial<AlbumImage>): AlbumImage {
  const id = `album-image-${++imageCounter}`;
  return {
    id,
    albumId: 'album-1',
    boxFileId: `box-file-${imageCounter}`,
    originalName: `image-${imageCounter}.jpg`,
    mimeType: 'image/jpeg',
    size: 1024 * 100, // 100KB
    orderIndex: imageCounter,
    uploaderId: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}
