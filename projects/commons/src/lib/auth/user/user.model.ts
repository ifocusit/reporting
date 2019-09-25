export const DEFAULT_USER = {
  uid: '',
  email: 'unknown@nobody.com',
  displayName: 'Invité',
  lastProject: 'Default',
  isMultiProject: false,
  admin: false,
  lang: 'fr'
};

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  phoneNumber?: string;
  lastProject: string;
  isMultiProject: boolean;
  admin: boolean;
  lang: string;
}
