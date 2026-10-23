
const STORAGE_KEY = 'azureready_progress';
const MAX_ATTEMPTS = 25;

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function getProgress() {
  const data = readStorage();
  return data.progress ?? {};
}

export function saveProgress(progress) {
  const data = readStorage();
  data.progress = progress;
  return writeStorage(data);
}

export function getAttempts() {
  const data = readStorage();
  return Array.isArray(data.attempts) ? data.attempts : [];
}

export function saveAttempt(attempt) {
  const data = readStorage();
  const attempts = Array.isArray(data.attempts) ? data.attempts : [];

  data.attempts = [attempt, ...attempts].slice(0, MAX_ATTEMPTS);
  return writeStorage(data);
}

export function clearProgress() {
  const data = readStorage();
  delete data.progress;
  return writeStorage(data);
}

export function clearAttempts() {
  const data = readStorage();
  data.attempts = [];
  return writeStorage(data);
}
