export interface Schema {
  skipInstall: boolean;
  project: string;
  port: number;
  dir: string;
  log: string;
  pactBinaryLocation?: string;
  pactDoNotTrack?: boolean;
}
