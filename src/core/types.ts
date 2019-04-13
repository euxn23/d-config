export type DConfigOption<ConfigType = null> = {
  validator?:
    | (ConfigType extends null ? null : ((str: string) => ConfigType))
    | null;
  useJsValidator?: boolean;
  deepMerge?: boolean;
  allowMergeObject?: boolean;
  allowTypeError?: boolean;
};

export type QuicktypeValidator<ConfigType> = {
  toConfig: (json: string) => ConfigType;
};

export class DConfigError extends Error {}
