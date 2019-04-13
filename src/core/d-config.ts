import { resolve, relative } from 'path';
import deepmerge from 'deepmerge';
import { DConfigError, DConfigOption, QuicktypeValidator } from './types';

const defaultOptions: DConfigOption<null> = {
  validator: null,
  useJsValidator: false,
  deepMerge: false,
  allowMergeObject: true,
  allowTypeError: false
};

export function configure<ConfigType>({
  validator,
  useJsValidator,
  deepMerge: useDeepMerge,
  allowMergeObject,
  allowTypeError
}: DConfigOption<ConfigType> = defaultOptions): ConfigType {
  if (!validator && !useJsValidator)
    throw new DConfigError('option validator or useJsValidator is required');

  const { NODE_ENV, D_CONFIG_ENV, D_CONFIG_DIR } = process.env;
  const configDir = D_CONFIG_DIR || resolve(process.cwd(), 'config');
  const configEnv = D_CONFIG_ENV || NODE_ENV || '';

  const config = readConfig<ConfigType>(
    configDir,
    configEnv,
    useDeepMerge,
    allowMergeObject
  );

  if (allowTypeError) return config;

  if (validator) {
    validator(JSON.stringify(config));

    return config;
  } else if (useJsValidator) {
    const { toConfig }: QuicktypeValidator<ConfigType> = require(relative(
      __dirname,
      resolve(configDir, 'validator')
    ));
    // configToJson(config);
    toConfig(JSON.stringify(config));

    return config;
  } else {
    throw new DConfigError('Unknown Error');
  }
}

function readConfig<ConfigType>(
  configDir: string,
  configEnv: string,
  useDeepMerge?: boolean,
  allowMergeObject?: boolean
): ConfigType {
  const fileNameWithoutExt = configEnv || 'config';

  const config: ConfigType = require(relative(
    __dirname,
    resolve(configDir, fileNameWithoutExt)
  ));

  if (configEnv && useDeepMerge) {
    const defaultConfig = require(relative(
      __dirname,
      resolve(configDir, 'config')
    ));
    return deepmerge<ConfigType>(defaultConfig, config, {
      isMergeableObject: allowMergeObject ? () => true : () => false
    });
  }

  return config;
}
