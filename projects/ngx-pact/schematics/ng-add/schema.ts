export interface Schema {
  skipInstall: boolean;
  project: string;
  port: number;
  consumer?: string;
  provider: string;
  dir: string;
  log: string;
  pactBinaryLocation?: string;
  pactDoNotTrack?: boolean;
}
