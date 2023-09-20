type CodemodOptions = {
  projectRoot: string;
};

type Context = Entry[];
type Entry = {
  entityName: string,
  oldPath: string,
  newPath: string,
  jsPath: string,
  hbsPath: string,
  hasHbsUsage: boolean,
};

type Options = {
  __styles__: string;
  projectRoot: string;
};

export type {
  CodemodOptions,
  Context,
  Entry,
  Options,
};
