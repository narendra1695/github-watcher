export interface IConfig {
  mongoURL: string;
  server: {
    host: string;
    port: number;
  };
  hosts: {
    Frontend: string;
    Backend: string;
  };
  baseURL: string;
}
