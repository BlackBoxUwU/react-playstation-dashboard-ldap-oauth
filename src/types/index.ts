export interface Game {
  id: number;
  title: string;
  developer: string;
  release_year: number;
  genre: string;
  platform: string;
  rating: number;
  cover_url: string;
  description: string;
  added_by: string;
  created_at?: string;
}

export interface GameCreateInput {
  title: string;
  developer: string;
  release_year: number;
  genre: string;
  platform: string;
  rating: number;
  cover_url: string;
  description: string;
}

export interface UserProfile {
  message: string;
  subject: string;
  username: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  issuer: string;
  roles: string[];
}

export interface JwtLogEntry {
  id: string;
  timestamp: string;
  type: 'TOKEN_RECEIVED' | 'API_REQUEST' | 'API_RESPONSE' | 'ERROR';
  method?: string;
  url?: string;
  tokenSnippet?: string;
  fullToken?: string;
  details: string;
}
