/**
 * MapLibre v2 protocol for Google Map Tiles API (createSession + 2dtiles).
 * Tile URLs: google://{mapType}/{z}/{x}/{y}?key=...&layerType=...&overlay=...
 *
 * MapLibre 2.x requires addProtocol handlers to use (params, callback) and
 * return { cancel }. The async Promise style is MapLibre 3+/4+ only.
 */

const sessions = {};

const ensureSession = async (sessionKey, url) => {
  let value = sessions[sessionKey];
  if (value && !(value instanceof Promise)) {
    return value;
  }

  if (value instanceof Promise) {
    await value;
    return sessions[sessionKey];
  }

  const createPromise = (async () => {
    const key = url.searchParams.get('key');
    const mapType = url.hostname;
    const layerType = url.searchParams.get('layerType');
    const overlay = url.searchParams.get('overlay');

    const sessionRequest = {
      mapType,
      language: 'es',
      region: 'CO',
      scale: 'scaleFactor2x',
      highDpi: true,
    };

    if (layerType) {
      sessionRequest.layerTypes = [layerType];
    }
    if (overlay != null) {
      sessionRequest.overlay = overlay === 'true';
    }

    try {
      const response = await fetch(
        `https://tile.googleapis.com/v1/createSession?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionRequest),
        }
      );

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(
          `Google Map Tiles createSession failed (${response.status}): ${errText || response.statusText}`
        );
      }

      const result = await response.json();
      if (!result.session) {
        throw new Error('Google Map Tiles createSession returned no session token');
      }

      sessions[sessionKey] = result.session;
      return result.session;
    } catch (err) {
      delete sessions[sessionKey];
      throw err;
    }
  })();

  sessions[sessionKey] = createPromise;
  await createPromise;
  return sessions[sessionKey];
};

/**
 * MapLibre 2.x addProtocol handler for google:// URLs.
 * @param {{ url: string }} params
 * @param {(error?: Error|null, data?: ArrayBuffer|null) => void} callback
 * @returns {{ cancel: () => void }}
 */
export const googleProtocol = (params, callback) => {
  const controller = new AbortController();
  let cancelled = false;

  (async () => {
    try {
      const url = new URL(params.url.replace(/^google:\/\//, 'https://'));
      const sessionKey = `${url.hostname}?${url.searchParams.toString()}`;
      const key = url.searchParams.get('key');

      if (!key) {
        throw new Error('google:// tile URL requires a key query parameter');
      }

      const session = await ensureSession(sessionKey, url);
      if (cancelled) return;

      const tileResponse = await fetch(
        `https://tile.googleapis.com/v1/2dtiles${url.pathname}?session=${encodeURIComponent(session)}&key=${encodeURIComponent(key)}`,
        { signal: controller.signal }
      );

      if (!tileResponse.ok) {
        throw new Error(`Google Map Tiles fetch failed (${tileResponse.status})`);
      }

      const data = await tileResponse.arrayBuffer();
      if (cancelled) return;
      callback(null, data);
    } catch (err) {
      if (cancelled || (err && err.name === 'AbortError')) {
        return;
      }
      callback(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return {
    cancel: () => {
      cancelled = true;
      controller.abort();
    },
  };
};
