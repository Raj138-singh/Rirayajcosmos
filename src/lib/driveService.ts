export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';

// Search files in user's Google Drive
export async function listDriveFiles(
  accessToken: string,
  searchQuery: string = '',
  mimeTypeFilter: string = ''
): Promise<DriveFile[]> {
  try {
    let q = "trashed = false";
    if (mimeTypeFilter === 'video') {
      q += " and (mimeType contains 'video/' or name contains '.mp4' or name contains '.mkv' or name contains '.webm')";
    } else if (mimeTypeFilter === 'json') {
      q += " and mimeType = 'application/json'";
    }
    if (searchQuery.trim()) {
      q += ` and name contains '${searchQuery.replace(/'/g, "\\'")}'`;
    }

    const fields = 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink)';
    const url = `${DRIVE_API_URL}/files?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}&pageSize=30&orderBy=modifiedTime desc`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Drive API error: ${res.status}`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error('Failed to list Drive files:', error);
    throw error;
  }
}

// Find or create 'Rirayajcosmos Movies' app folder in Google Drive
export async function getOrCreateAppFolder(accessToken: string): Promise<string> {
  const folderName = 'Rirayajcosmos Movies';
  const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`;
  
  const searchRes = await fetch(`${DRIVE_API_URL}/files?q=${encodeURIComponent(q)}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    throw new Error('Failed to create app folder in Google Drive');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
}

// Backup Watchlist to Drive
export async function backupWatchlistToDrive(
  accessToken: string,
  watchlistIds: string[],
  movieTitles: string[]
): Promise<DriveFile> {
  const folderId = await getOrCreateAppFolder(accessToken);
  const fileName = 'rirayajcosmos_watchlist.json';

  // Check if file exists
  const q = `'${folderId}' in parents and name = '${fileName}' and trashed = false`;
  const searchRes = await fetch(`${DRIVE_API_URL}/files?q=${encodeURIComponent(q)}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const searchData = await searchRes.json().catch(() => ({ files: [] }));
  const existingFile = searchData.files?.[0];

  const fileData = {
    appName: 'Rirayajcosmos Movies',
    updatedAt: new Date().toISOString(),
    watchlistIds,
    movieTitles,
  };

  const fileContent = JSON.stringify(fileData, null, 2);

  if (existingFile) {
    // Update existing file
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`;
    const res = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: fileContent,
    });
    if (!res.ok) throw new Error('Failed to update Watchlist file in Google Drive');
    return await res.json();
  } else {
    // Create new file via multipart upload
    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      parents: [folderId],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileContent], { type: 'application/json' }));

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });

    if (!res.ok) throw new Error('Failed to save Watchlist to Google Drive');
    return await res.json();
  }
}

// Restore Watchlist from Drive
export async function restoreWatchlistFromDrive(
  accessToken: string
): Promise<{ watchlistIds: string[]; updatedAt: string } | null> {
  const folderId = await getOrCreateAppFolder(accessToken);
  const fileName = 'rirayajcosmos_watchlist.json';

  const q = `'${folderId}' in parents and name = '${fileName}' and trashed = false`;
  const searchRes = await fetch(`${DRIVE_API_URL}/files?q=${encodeURIComponent(q)}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const searchData = await searchRes.json().catch(() => ({ files: [] }));
  const existingFile = searchData.files?.[0];

  if (!existingFile) {
    return null;
  }

  const fileRes = await fetch(`${DRIVE_API_URL}/files/${existingFile.id}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!fileRes.ok) throw new Error('Failed to download Watchlist backup from Drive');
  const data = await fileRes.json();
  return {
    watchlistIds: data.watchlistIds || [],
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

// Save Movie Note / Review to Google Drive
export async function saveMovieNoteToDrive(
  accessToken: string,
  movieTitle: string,
  rating: number,
  reviewText: string
): Promise<DriveFile> {
  const folderId = await getOrCreateAppFolder(accessToken);
  const sanitizedTitle = movieTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Note_${sanitizedTitle}.txt`;

  const noteContent = `=== Movie Review: ${movieTitle} ===\nRating: ${rating}/10\nDate: ${new Date().toLocaleString()}\n\nNotes:\n${reviewText}\n\n---\nSaved via Rirayajcosmos Movies App`;

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    parents: [folderId],
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([noteContent], { type: 'text/plain' }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) throw new Error('Failed to save note to Google Drive');
  return await res.json();
}

// Delete file from Google Drive
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete file from Google Drive');
  }
}
