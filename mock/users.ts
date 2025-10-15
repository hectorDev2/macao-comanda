export interface User {
  email: string;
  password: string;
  role: "mesero" | "cocina" | "admin";
}

export const usersMock: User[] = [
  { email: "mesero@local.com", password: "1234", role: "mesero" },
  { email: "cocina@local.com", password: "1234", role: "cocina" },
  { email: "admin@local.com", password: "1234", role: "admin" },
];
