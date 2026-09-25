import { AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

export const oidcConfig: AuthProviderProps = {
  authority: 'http://localhost:8081/realms/cybersecurity',
  client_id: 'fastapi-api',
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: (_user: any): void => {
    // Remove code & state params from URL after login redirect
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
