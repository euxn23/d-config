# d-config

## Install

`$ npm install -S d-config`

or

`$ yarn add d-config`

## Usage

### CLI

CLI での validator ファイル生成を事前に行います。

```
Usage: npx d-config [options] [path/to/config/type]

Options:
  --top-level
    引数に指定されたファイル内で config として使用するトップレベルの型名を指定します
  --out
    生成した TypeScript ファイルの出力先を指定します
  --out-js
    生成した JavaScript ファイルの出力先を指定します
  --overwrite
    生成した TypeScript ファイルを、引数に指定した config ファイルに上書きします。--out/--out-js よりも優先されます
    指定ファイルで export されている interface/type/class 以外のコードは消滅し、生成された validation 関数が追加されます
      type は interface に変換されます
    上記の問題を避けるために上書きしたくない場合は、 `--out` で別ディレクトリを指定するか、 `--out-js` オプションを指定し、実行時に `useJsVaidator` を指定してください

Example:
  $ npx d-config ./path/to/config/type.ts --top-level Config --overwrite
  $ npx d-config ./path/to/config/type.ts --top-level Config --out-js config/validator.js
```


### API

```typescript
import { configure } from 'd-config';

const config = configure();
```

オプションは以下の通りです。

```
validator: Config => Config (default: null)
  config を渡す validation 関数を指定します。通常、 cli で生成されたファイルを指定してください
  useJsValidator より優先されます。また、 validator か useJsValidator のうち片方は必須パラメータとなります
deepMerge: boolean (default: false)
  true の場合、環境別 config を default を deepmerge します
allowMergeObject: boolean (default: true)
  deemMerge: true の場合のみ有効
  true の場合、 deepmerge ライブラリと同様の挙動になります
  false の場合、deepmerge 時に Object をマージしません(deepmerge の option isMergeableObject に空関数を渡した場合と同様)
allowTypeError: boolean (default: false)
  [production 非推奨] alidator による実行時型チェックを無視します
useJsValidator: boolean (default: false)
  D_CONFIG_VALIDATOR (defualt: config/validator.js) を動的に require し configure 時に validation を実行します
```


## Example

### Basic

```bash
$ npx d-config ./path/to/config/type.ts --top-level Config --overwrite
```

```typescript
import { configure } from 'd-config';
import { toConfig as validator } from './path/to/config/type';

const config = configure({ validator });
```

### Use deepmerge but not merge Object

```bash
$ npx d-config ./path/to/config/type.ts --top-level Config --overwrite
```

```typescript
import { configure } from 'd-config';
import { toConfig as validator } from './path/to/config/type';

const config = configure({
  validator,
  deepMerge: true,
  allowMergeObject: false,
});
```


### Use JS validator

```bash
$ npx d-config ./path/to/config/type.ts --top-level Config --out-js config/validator.js
```

```typescript
import { configure } from 'd-config';

const config = configure({ useJsValidator: true });
```
