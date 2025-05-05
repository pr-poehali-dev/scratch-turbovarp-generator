
import { useState } from 'react';

// Типы для проектов Scratch
export interface ScratchProject {
  id: number;
  title: string;
  description: string;
  instructions: string;
  visibility: string;
  public: boolean;
  thumbnail_url: string;
  creator: {
    username: string;
    profile_url: string;
  };
  stats: {
    views: number;
    loves: number;
    favorites: number;
    remixes: number;
  };
  history: {
    created: string;
    modified: string;
    shared: string;
  };
}

export interface ScratchSearchResults {
  projects: ScratchProject[];
  total: number;
}

// Хук для работы с API Scratch
export function useScratchApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Базовый URL для API Scratch
  const API_BASE_URL = 'https://api.scratch.mit.edu';

  // Поиск проектов по ключевому слову
  const searchProjects = async (query: string, limit: number = 10): Promise<ScratchProject[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/search/projects?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Ошибка API Scratch: ${response.status}`);
      }
      
      const data: ScratchSearchResults = await response.json();
      return data.projects;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка при поиске проектов Scratch:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Получение информации о конкретном проекте по ID
  const getProjectById = async (projectId: number): Promise<ScratchProject | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
      
      if (!response.ok) {
        throw new Error(`Ошибка API Scratch: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка при получении проекта Scratch:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Получение популярных проектов
  const getFeaturedProjects = async (limit: number = 10): Promise<ScratchProject[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Используем эндпоинт для получения избранных проектов
      const response = await fetch(`${API_BASE_URL}/proxy/featured`);
      
      if (!response.ok) {
        throw new Error(`Ошибка API Scratch: ${response.status}`);
      }
      
      const data = await response.json();
      return data.community_featured_projects.slice(0, limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка при получении популярных проектов Scratch:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Получение проектов пользователя
  const getUserProjects = async (username: string, limit: number = 10): Promise<ScratchProject[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/users/${username}/projects?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Ошибка API Scratch: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка при получении проектов пользователя Scratch:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    searchProjects,
    getProjectById,
    getFeaturedProjects,
    getUserProjects,
    loading,
    error
  };
}
