const API = '/api'

function getToken() {
  return localStorage.getItem('dialekta_token')
}

export function setToken(token: string) {
  localStorage.setItem('dialekta_token', token)
}

export function clearToken() {
  localStorage.removeItem('dialekta_token')
}

export function isLoggedIn() {
  return !!getToken()
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API}${path}`, { ...options, headers })

  let data: any
  try {
    data = await res.json()
  } catch {
    throw new Error('Server nicht erreichbar. Starten Sie die App mit "npm run dev".')
  }

  if (!res.ok) {
    throw new Error(data.error || 'Ein Fehler ist aufgetreten.')
  }

  return data
}

function audioDataUrl(id: string) {
  return `${API}/audio/${id}/data`
}

export const api = {
  auth: {
    register: (email: string, password: string, name: string, adminCode?: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, adminCode }) }),
    login: (name: string, password: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ name, password }) }),
    me: () => request('/auth/me'),
  },
  words: {
    getAll: () => request('/words'),
    get: (id: string) => request(`/words/${id}`),
  },
  audio: {
    getAll: (search?: string) => request(`/audio${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    get: (id: string) => request(`/audio/${id}`),
    getDataUrl: (id: string) => audioDataUrl(id),
  },
  admin: {
    createWord: (data: Record<string, string>) =>
      request('/admin/words', { method: 'POST', body: JSON.stringify(data) }),
    updateWord: (id: string, data: Record<string, string>) =>
      request(`/admin/words/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteWord: (id: string) =>
      request(`/admin/words/${id}`, { method: 'DELETE' }),
    getUsers: () => request('/admin/users'),
    uploadAudio: (wordId: string, wordText: string, audioBase64: string) =>
      request('/admin/audio', { method: 'POST', body: JSON.stringify({ word_id: wordId, word_text: wordText, audio_base64: audioBase64 }) }),
    deleteAudio: (id: string) =>
      request(`/admin/audio/${id}`, { method: 'DELETE' }),
  },
}
