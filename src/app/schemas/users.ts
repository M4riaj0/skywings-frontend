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
  password: string;
}

export interface UserFormDataType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name1: string;
  name2: string;
  surname1: string;
  surname2: string;
  dni: string;
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    numberStreet: string;
    number: string;
  };
  birthplace: {
    country: string;
    state: string;
    city: string;
  };
  birthDate: string;
  gender: string;
  user_image: string;
}