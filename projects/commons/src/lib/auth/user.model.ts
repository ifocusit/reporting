export const DEFAULT_USER = {
  uid: '',
  email: 'unknown@nobody.com',
  displayName: 'Invité',
  lastProject: 'Default'
};

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  lastProject: string;
}
