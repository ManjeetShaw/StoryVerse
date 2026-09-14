/**
 * StoryVerse API Service
 * Real backend communication only.
 *
 * Backend:
 * https://storyverse-jsq5.onrender.com
 */

// ======================================================
// API URL
// ======================================================

export const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://storyverse-jsq5.onrender.com';

console.log('StoryVerse API:', API_URL);

// ======================================================
// RENDER BACKEND WARM-UP
// ======================================================

// Wake up Render free-tier backend
export function pingBackend() {
  fetch(`${API_URL}/health`).catch(() => {});
}

pingBackend();

// ======================================================
// ROBUST FETCH WITH RETRIES
// ======================================================

export async function fetchWithRetry(
  url,
  options = {},
  retries = 2
) {
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504
      ) {
        if (attempt < retries) {
          console.warn(
            `[API] Server status ${response.status} on attempt ${
              attempt + 1
            }, retrying in 2s...`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );

          continue;
        }
      }

      return response;
    } catch (err) {
      lastErr = err;

      if (attempt < retries) {
        console.warn(
          `[API] Fetch error on attempt ${
            attempt + 1
          }: ${err.message}. Retrying in 2.5s...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 2500)
        );
      }
    }
  }

  throw (
    lastErr ||
    new Error(
      'Network request failed. Please ensure backend is active.'
    )
  );
}

// ======================================================
// IMAGE URL HELPER
// ======================================================

export function getImageUrl(image) {
  if (!image) return null;

  if (typeof image === 'string') {
    // Fix legacy mangled strings
    if (
      image.includes('http://') ||
      image.includes('https://')
    ) {
      const httpIndex = image.indexOf('http');
      return image.substring(httpIndex);
    }

    if (
      image.startsWith('data:') ||
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {
      return image;
    }

    if (image.startsWith('/images/')) {
      return `${API_URL}${image}`;
    }

    // Raw base64
    if (
      image.length > 50 &&
      !image.includes(' ')
    ) {
      return `data:image/jpeg;base64,${image}`;
    }

    return image;
  }

  if (
    typeof image === 'object' &&
    image !== null
  ) {
    const target =
      image.url ||
      image.base64 ||
      image.image ||
      image.src ||
      (image.result && image.result.image) ||
      null;

    return getImageUrl(target);
  }

  return null;
}

// ======================================================
// FALLBACK STORY SVG
// ======================================================

export function createCraftStorySVG({
  title,
  pageNumber = 1,
  style,
  promptText,
}) {
  const isDark =
    style === 'comic_bw' ||
    style === 'ink';

  const isComic =
    style === 'comic_color' ||
    style === 'comic';

  const bg1 = isDark
    ? '#181E29'
    : isComic
    ? '#FFF4E0'
    : '#FAF3E0';

  const bg2 = isDark
    ? '#0D1117'
    : isComic
    ? '#FAD09C'
    : '#EAD7C3';

  const accent = isDark
    ? '#E2C044'
    : isComic
    ? '#E05A47'
    : '#B85B35';

  const textColor = isDark
    ? '#F5F5F7'
    : '#2D231E';

  const cleanTitle = (
    title || 'Illustrated Storybook'
  )
    .replace(/[<>&'"]/g, '')
    .slice(0, 40);

  const cleanSnippet = (
    promptText || 'Story Illustration'
  )
    .replace(/[<>&'"]/g, '')
    .slice(0, 70);

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="600"
      viewBox="0 0 600 600"
    >
      <defs>
        <linearGradient
          id="bgGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stop-color="${bg1}"
          />
          <stop
            offset="100%"
            stop-color="${bg2}"
          />
        </linearGradient>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#bgGrad)"
      />

      <rect
        x="24"
        y="24"
        width="552"
        height="552"
        rx="28"
        fill="none"
        stroke="${accent}"
        stroke-width="2"
        stroke-dasharray="6 6"
        opacity="0.5"
      />

      <circle
        cx="300"
        cy="240"
        r="100"
        fill="${accent}"
        opacity="0.12"
      />

      <circle
        cx="300"
        cy="240"
        r="60"
        fill="none"
        stroke="${accent}"
        stroke-width="2"
        opacity="0.3"
      />

      <text
        x="300"
        y="225"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="22"
        font-weight="bold"
        fill="${textColor}"
      >
        ${cleanTitle}
      </text>

      <text
        x="300"
        y="260"
        text-anchor="middle"
        font-family="sans-serif"
        font-size="13"
        font-weight="600"
        fill="${accent}"
        letter-spacing="2"
      >
        CHAPTER ${pageNumber} • ILLUSTRATION
      </text>

      <text
        x="300"
        y="340"
        text-anchor="middle"
        font-family="Georgia, serif"
        font-size="13"
        fill="${textColor}"
        opacity="0.85"
      >
        "${cleanSnippet}..."
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    svg
  )}`;
}

// ======================================================
// LOCAL STORAGE KEYS
// ======================================================

const TOKEN_KEY = 'storyverse_token';
const USER_KEY = 'storyverse_user';

// ======================================================
// TOKEN / USER HELPERS
// ======================================================

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(
    TOKEN_KEY,
    token
  );
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getUser() {
  try {
    const raw =
      localStorage.getItem(USER_KEY);

    return raw
      ? JSON.parse(raw)
      : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

// ======================================================
// LOGIN
// ======================================================

/**
 * POST /auth/login
 *
 * Body:
 * {
 *   email,
 *   password
 * }
 */

export async function loginUser(
  email,
  password
) {
  const cleanEmail =
    email.trim();

  if (!cleanEmail) {
    throw new Error(
      'Email is required.'
    );
  }

  if (!password) {
    throw new Error(
      'Password is required.'
    );
  }

  const url =
    `${API_URL}/auth/login`;

  console.log(
    'LOGIN →',
    url
  );

  try {
    const response =
      await fetchWithRetry(
        url,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    let data;

    if (
      contentType.includes(
        'application/json'
      )
    ) {
      data =
        await response.json();
    } else {
      const text =
        await response.text();

      throw new Error(
        text ||
          'Server returned an invalid response.'
      );
    }

    console.log(
      'LOGIN ←',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Login failed (${response.status})`
      );
    }

    if (!data.token) {
      throw new Error(
        'Login succeeded but the backend did not return a token.'
      );
    }

    setToken(data.token);

    if (data.user) {
      setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error(
      'LOGIN ERROR:',
      error
    );

    throw error;
  }
}

// ======================================================
// REGISTER
// ======================================================

/**
 * POST /auth/register
 *
 * Body:
 * {
 *   username,
 *   email,
 *   password
 * }
 */

export async function registerUser(
  username,
  email,
  password
) {
  const cleanUsername =
    username.trim();

  const cleanEmail =
    email.trim();

  if (!cleanUsername) {
    throw new Error(
      'Username is required.'
    );
  }

  if (!cleanEmail) {
    throw new Error(
      'Email is required.'
    );
  }

  if (!password) {
    throw new Error(
      'Password is required.'
    );
  }

  const url =
    `${API_URL}/auth/register`;

  console.log(
    'REGISTER →',
    url
  );

  try {
    const response =
      await fetchWithRetry(
        url,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            username:
              cleanUsername,

            email:
              cleanEmail,

            password,
          }),
        }
      );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    let data;

    if (
      contentType.includes(
        'application/json'
      )
    ) {
      data =
        await response.json();
    } else {
      const text =
        await response.text();

      throw new Error(
        text ||
          'Server returned an invalid response.'
      );
    }

    console.log(
      'REGISTER ←',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Registration failed (${response.status})`
      );
    }

    if (!data.token) {
      throw new Error(
        'Registration succeeded but the backend did not return a token.'
      );
    }

    setToken(data.token);

    if (data.user) {
      setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error(
      'REGISTER ERROR:',
      error
    );

    throw error;
  }
}

// ======================================================
// GET STYLES
// ======================================================

export async function getStyles() {
  const url =
    `${API_URL}/api/styles`;

  console.log(
    'STYLES →',
    url
  );

  try {
    const response =
      await fetchWithRetry(url);

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    if (
      !contentType.includes(
        'application/json'
      )
    ) {
      throw new Error(
        'Styles endpoint returned a non-JSON response.'
      );
    }

    const data =
      await response.json();

    console.log(
      'STYLES ←',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Failed to load styles (${response.status})`
      );
    }

    if (
      !data.styles ||
      !Array.isArray(data.styles)
    ) {
      throw new Error(
        'Backend returned an invalid styles response.'
      );
    }

    return data;
  } catch (error) {
    console.error(
      'STYLES ERROR:',
      error
    );

    throw error;
  }
}

// ======================================================
// GET ALL BOOKS
// ======================================================

/**
 * GET /books
 *
 * Authorization:
 * Bearer <token>
 */

export async function getBooks() {
  const token =
    getToken();

  if (!token) {
    throw new Error(
      'You must be logged in to load books.'
    );
  }

  const url =
    `${API_URL}/books`;

  console.log(
    'GET BOOKS →',
    url
  );

  try {
    const response =
      await fetchWithRetry(
        url,
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    if (
      !contentType.includes(
        'application/json'
      )
    ) {
      throw new Error(
        'Books endpoint returned a non-JSON response.'
      );
    }

    const data =
      await response.json();

    console.log(
      'GET BOOKS ←',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Failed to load books (${response.status})`
      );
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (
      data.books &&
      Array.isArray(data.books)
    ) {
      return data.books;
    }

    throw new Error(
      'Backend returned an invalid books response.'
    );
  } catch (error) {
    console.error(
      'GET BOOKS ERROR:',
      error
    );

    throw error;
  }
}

// ======================================================
// GET SINGLE BOOK
// ======================================================

/**
 * GET /books/:id
 */

export async function getBookById(id) {
  if (!id) {
    throw new Error(
      'Book ID is required.'
    );
  }

  const token =
    getToken();

  const url =
    `${API_URL}/books/${id}`;

  console.log(
    'GET BOOK →',
    url
  );

  try {
    const headers = {};

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    const response =
      await fetchWithRetry(
        url,
        {
          method: 'GET',
          headers,
        }
      );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    if (
      !contentType.includes(
        'application/json'
      )
    ) {
      throw new Error(
        'Book endpoint returned a non-JSON response.'
      );
    }

    const data =
      await response.json();

    console.log(
      'GET BOOK ←',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Failed to load book (${response.status})`
      );
    }

    return data.book || data;
  } catch (error) {
    console.error(
      'GET BOOK ERROR:',
      error
    );

    throw error;
  }
}

// ======================================================
// DELETE BOOK
// ======================================================

/**
 * DELETE /books/:id
 */

export async function deleteBook(id) {
  if (!id) {
    throw new Error(
      'Book ID is required.'
    );
  }

  const token =
    getToken();

  if (!token) {
    throw new Error(
      'You must be logged in to delete a book.'
    );
  }

  const url =
    `${API_URL}/books/${id}`;

  console.log(
    'DELETE BOOK →',
    url
  );

  try {
    const response =
      await fetchWithRetry(
        url,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    let data = {};

    if (
      contentType.includes(
        'application/json'
      )
    ) {
      data =
        await response.json();
    }

    console.log(
      'DELETE BOOK ←',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Failed to delete book (${response.status})`
      );
    }

    return data;
  } catch (error) {
    console.error(
      'DELETE BOOK ERROR:',
      error
    );

    throw error;
  }
}

// ======================================================
// GENERATE BOOK
// ======================================================

/**
 * POST /books/generate
 *
 * Authorization:
 * Bearer <token>
 *
 * Body:
 * {
 *   prompt,
 *   pageCount,
 *   style,
 *   language
 * }
 */

export async function generateBook({
  prompt,
  pageCount = 8,
  style = 'watercolor',
  language = 'English',
}) {
  const token =
    getToken();

  if (!token) {
    throw new Error(
      'You must be logged in to generate a book.'
    );
  }

  if (
    !prompt ||
    !prompt.trim()
  ) {
    throw new Error(
      'Prompt is required.'
    );
  }

  const url =
    `${API_URL}/books/generate`;

  console.log(
    'GENERATE BOOK →',
    url,
    'Language:',
    language
  );

  try {
    const response =
      await fetchWithRetry(
        url,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            prompt:
              prompt.trim(),

            pageCount,

            style,

            language,
          }),
        }
      );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    let data;

    if (
      contentType.includes(
        'application/json'
      )
    ) {
      data =
        await response.json();
    } else {
      const text =
        await response.text();

      throw new Error(
        text ||
          'Server returned an invalid response.'
      );
    }

    console.log(
      'GENERATE BOOK ←',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Book generation failed (${response.status})`
      );
    }

    return data.book || data;
  } catch (error) {
    console.error(
      'GENERATE BOOK ERROR:',
      error
    );

    throw error;
  }
}

// ======================================================
// TEXT TO SPEECH
// ======================================================

/**
 * POST /books/tts
 *
 * Synthesizes voice audio for story text.
 */

export async function fetchStoryAudio(
  text,
  language = 'English',
  voiceId = null,
  apiKey = null
) {
  const token =
    getToken();

  if (!token) {
    throw new Error(
      'Authentication required'
    );
  }

  if (!text || !text.trim()) {
    throw new Error(
      'Story text is required'
    );
  }

  const url =
    `${API_URL}/books/tts`;

  try {
    const response =
      await fetchWithRetry(
        url,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            text,
            language,
            voiceId,
            apiKey,
          }),
        }
      );

    const contentType =
      response.headers.get(
        'content-type'
      ) || '';

    // Backend returned JSON
    if (
      contentType.includes(
        'application/json'
      )
    ) {
      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error ||
            json.message ||
            'TTS request failed'
        );
      }

      if (json.fallback) {
        return {
          fallback: true,
          message:
            json.message,
        };
      }

      return json;
    }

    // Backend returned audio
    if (
      response.ok &&
      contentType.includes('audio')
    ) {
      const blob =
        await response.blob();

      return {
        audioUrl:
          URL.createObjectURL(blob),
      };
    }

    return {
      fallback: true,
    };
  } catch (error) {
    console.error(
      'TTS ERROR:',
      error
    );

    throw error;
  }
}