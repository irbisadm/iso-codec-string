# ISO codec string parser

## Supported codecs
- [x] vp8
- [x] vp9
- [x] av1
- [ ] h264
- [ ] h265

## Examples

```ts
import {codecInfoFactory} from '@irbisadm/iso-codec-string'


const vp9CodecInfo = codecInfoFactory('vp09.00.51.08')
console.log(vp9CodecInfo.level) // VpxLevel.LEVEL_5_1
```

```ts
import {Vp9Info, VpxLevel} from '@irbisadm/iso-codec-string'

const vp9CodecInfo = new Vp9Info();
vp9CodecInfo.level = VpxLevel.LEVEL_5_1;
console.log(vp9CodecInfo.toString()) // vp09.00.51.08
```
