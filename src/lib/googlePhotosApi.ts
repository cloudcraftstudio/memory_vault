import { Photo, Album, SyncStatus } from '../types';

export interface GoogleMediaItem {
  id: string;
  description?: string;
  baseUrl: string;
  mimeType: string;
  mediaMetadata?: {
    creationTime: string;
    width?: string;
    height?: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
      focalLength?: number;
      apertureFNumber?: number;
      isoEquivalent?: number;
      exposureTime?: string;
    };
  };
  filename: string;
}

export interface GoogleAlbum {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount?: string;
  coverPhotoBaseUrl?: string;
}

/**
 * Fetch photos from Google Photos Library API using the authenticated OAuth token
 */
export async function fetchGooglePhotos(accessToken: string): Promise<Photo[]> {
  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=50', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      console.warn('Google Photos API responded with error status:', response.status, errJson);
      throw new Error(errJson.error?.message || `Google Photos API error (${response.status})`);
    }

    const data = await response.json();
    const mediaItems: GoogleMediaItem[] = data.mediaItems || [];

    return mediaItems.map((item, idx): Photo => {
      const meta = item.mediaMetadata;
      const photoMeta = meta?.photo;
      const dateStr = meta?.creationTime ? meta.creationTime.split('T')[0] : new Date().toISOString().split('T')[0];
      const timeStr = meta?.creationTime ? meta.creationTime.split('T')[1]?.substring(0, 5) : '12:00';

      return {
        id: `gp_${item.id}`,
        googlePhotoId: item.id,
        url: `${item.baseUrl}=w1600-h1200`,
        thumbnailUrl: `${item.baseUrl}=w400-h400-c`,
        title: item.filename || `Photo ${idx + 1}`,
        description: item.description || '',
        date: dateStr,
        time: timeStr,
        timestamp: meta?.creationTime ? new Date(meta.creationTime).getTime() : Date.now() - idx * 86400000,
        location: {
          name: 'Cloud Location',
        },
        albumIds: [],
        tags: ['google-photos', 'synced'],
        faces: [],
        metadata: {
          camera: photoMeta ? `${photoMeta.cameraMake || ''} ${photoMeta.cameraModel || ''}`.trim() || 'Google Camera' : 'Camera',
          lens: 'Standard',
          aperture: photoMeta?.apertureFNumber ? `f/${photoMeta.apertureFNumber}` : 'f/2.0',
          iso: photoMeta?.isoEquivalent || 100,
          shutterSpeed: photoMeta?.exposureTime || '1/250s',
          resolution: meta?.width && meta?.height ? `${meta.width} × ${meta.height}` : '4032 × 3024',
          fileSize: '4.2 MB',
        },
        isFavorite: false,
        isBackedUp: true,
        source: 'google_photos',
      };
    });
  } catch (error) {
    console.error('Error in fetchGooglePhotos:', error);
    throw error;
  }
}

/**
 * Fetch albums from Google Photos Library API
 */
export async function fetchGoogleAlbums(accessToken: string): Promise<Album[]> {
  try {
    const response = await fetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=20', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google Photos Albums error (${response.status})`);
    }

    const data = await response.json();
    const albums: GoogleAlbum[] = data.albums || [];

    return albums.map((alb): Album => ({
      id: `gpalbum_${alb.id}`,
      googlePhotosAlbumId: alb.id,
      title: alb.title || 'Untitled Album',
      description: `Synced from Google Photos (${alb.mediaItemsCount || 0} items)`,
      theme: 'editorial',
      coverPhotoUrl: alb.coverPhotoBaseUrl ? `${alb.coverPhotoBaseUrl}=w800-h600` : '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      tags: ['Google Photos', 'Synced'],
      customAccentColor: '#3B82F6',
      isShared: false,
      shareLink: alb.productUrl || `https://memoryvault.app/album/${alb.id}`,
      collaborators: [],
      comments: [],
    }));
  } catch (error) {
    console.error('Error in fetchGoogleAlbums:', error);
    throw error;
  }
}
