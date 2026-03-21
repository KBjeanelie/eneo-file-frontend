import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'https://sso-auth.eneogroup.site',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'eneogroup-si',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'eneo-file-web'
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = () => {
  return keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  });
};

export const login = () => keycloak.login({ 
  redirectUri: window.location.origin + '/callback' 
});

export const logout = () => keycloak.logout({ 
  redirectUri: window.location.origin 
});
export const getToken = () => keycloak.token;
export const isAuthenticated = () => keycloak.authenticated;
export const getUserProfile = () => keycloak.loadUserProfile();

export default keycloak;
