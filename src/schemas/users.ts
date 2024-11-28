export interface RegisterData {
  username: string;
  password: string;
  dni: string;
  name1: string;
  name2: string;
  surname1: string;
  surname2: string;
  email: string;
  gender: string;
  address: string;
  birthPlace: string;
  birthDate: Date;
  user_image?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface Admin {
  username: string;
  email: string;
}

export interface ChangePassword {
  username: string;
  currentPassword: string;
  newPassword: string;
}