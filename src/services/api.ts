import axios from 'axios';
import { Game, GameCreateInput, UserProfile } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const logJwtEvent = (type: string, details: string, token?: string) => {
  const time = new Date().toLocaleTimeString();
  const tokenSnippet = token ? `${token.substring(0, 25)}...${token.substring(token.length - 15)}` : undefined;
  
  // Explicit console.log required by professor!
  console.log(`%c[OIDC JWT LOG - ${time}] ${type}`, 'color: #00d4ff; font-weight: bold;', {
    details,
    token: token || 'No token',
  });

  // Dispatch custom DOM event for UI JwtLoggerViewer
  window.dispatchEvent(
    new CustomEvent('jwt-log-event', {
      detail: {
        id: Math.random().toString(36).substring(7),
        timestamp: time,
        type,
        details,
        tokenSnippet,
        fullToken: token,
      },
    })
  );
};

export const createApiClient = (accessToken?: string) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      logJwtEvent(
        'API_REQUEST',
        `Sending ${config.method?.toUpperCase()} request to ${config.url} with Bearer Token`,
        accessToken
      );
    } else {
      console.warn('[JWT Warning]: Making request without access token');
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      logJwtEvent(
        'API_RESPONSE',
        `Received ${response.status} from ${response.config.url}`,
        accessToken
      );
      return response;
    },
    (error) => {
      logJwtEvent(
        'ERROR',
        `Error ${error.response?.status || 'Network Error'} on ${error.config?.url}: ${error.message}`,
        accessToken
      );
      return Promise.reject(error);
    }
  );

  return client;
};

export const fetchProfile = async (accessToken: string): Promise<UserProfile> => {
  const api = createApiClient(accessToken);
  const response = await api.get<UserProfile>('/api/profile');
  return response.data;
};

export const fetchGames = async (accessToken: string): Promise<Game[]> => {
  const api = createApiClient(accessToken);
  const response = await api.get<{ status: string; count: number; games: Game[] }>('/api/games');
  return response.data.games;
};

export const createGame = async (accessToken: string, newGame: GameCreateInput): Promise<Game> => {
  const api = createApiClient(accessToken);
  const response = await api.post<{ status: string; game: Game }>('/api/games', newGame);
  return response.data.game;
};

export const deleteGame = async (accessToken: string, gameId: number): Promise<void> => {
  const api = createApiClient(accessToken);
  await api.delete(`/api/games/${gameId}`);
};
