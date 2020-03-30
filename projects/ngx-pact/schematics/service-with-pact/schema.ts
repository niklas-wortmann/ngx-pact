export interface Schema {
  withPact: boolean;
  port: number;
  consumer: string;
  provider: string;
}
