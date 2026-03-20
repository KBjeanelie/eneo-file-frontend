import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'https://sso-auth.eneogroup.site',
  realm: 'eneogroup-si',
  clientId: 'eneo-file-web'
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = () => {
  return keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  });
};

export const login = () => keycloak.login();
export const logout = () => keycloak.logout();
export const getToken = () => keycloak.token;
export const isAuthenticated = () => keycloak.authenticated;
export const getUserProfile = () => keycloak.loadUserProfile();

export default keycloak;
