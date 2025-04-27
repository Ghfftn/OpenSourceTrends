
import { format } from 'date-fns';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

export async function fetchWithRetry(url, retries = 0) {
  try {
    const response = await fetch(url);
    
    if (response.status === 403 || response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || 60;
      throw new Error(`Rate limit exceeded. Please wait ${retryAfter} seconds.`);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
}

export async function fetchGithubProjects(query) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const cacheKey = `github_projects_${query}_${today}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    const { data, date } = JSON.parse(cachedData);
    if (date === today) {
      return data;
    }
  }

  try {
    const data = await fetchWithRetry(
      `https://api.github.com/search/repositories?q=${query}`
    );
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      date: today
    }));
    
    return data;
  } catch (error) {
    const cachedData = Object.keys(localStorage)
      .filter(key => key.startsWith('github_projects_'))
      .map(key => {
        const { data, date } = JSON.parse(localStorage.getItem(key));
        return { data, date };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (cachedData) {
      return cachedData.data;
    }
    throw error;
  }
}
