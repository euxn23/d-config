import { argv } from 'yargs';
import { DConfigError } from '../core/types';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export async function dConfig() {
  if (argv._.length > 1)
    throw new DConfigError(
      'arguments are too many, only 1 source file path is required.'
    );
  const sourceFilePath = argv._[0];
  if (!sourceFilePath)
    throw new DConfigError('source file path defining config is required');

  const cwd = process.cwd();
  const quicktype = `npx quicktype ${sourceFilePath}`;
  const topLevel = argv['top-level'];
  const overwrite = argv['overwrite'] === true || false;
  const out = argv['out'];
  const outJs = argv['out-js'];

  const command = [
    quicktype,
    topLevel ? `--top-level ${topLevel}` : null,
    `--lang ${outJs ? 'js' : 'ts'}`,
    overwrite || out || outJs ? `--out ${overwrite ? sourceFilePath : out}` : null
  ]
    .filter(v => v)
    .join(' ');

  const { stdout } = await execAsync(command, { cwd });

  return stdout
}
