declare module "#auth-utils" {
  interface User {
    id: string;
    email: string;
    username: string | null;
    role: "USER" | "PROGRAM_ADMIN" | "GLOBAL_ADMIN";
  }
}

export {};
