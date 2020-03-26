export interface Schema {
  skipInstall: boolean;
  project: string;
  skipWorkspaceUpdate: boolean;
  port: number;
  consumer?: string;
  provider: string;
  dir: string;
  log: string;
  pactBinaryLocation?: string;
  pactDoNotTrack?: boolean;
}
