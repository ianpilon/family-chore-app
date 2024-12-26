export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'parent' | 'contributor' | 'coach' | 'admin';
  points: number;
}