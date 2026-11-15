import test from 'node:test';
import assert from 'node:assert/strict';
import { readImageDimensions } from '../scripts/image-dimensions.mjs';

// Real images generated once for these tests; no image library is needed to run them.
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGBgAAAABQABpfZFQAAAAABJRU5ErkJggg==', 'base64');
const baselineJpeg = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAADAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDlKKKK+vPlT//Z', 'base64');
const progressiveJpeg = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAACAAMDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUAQEAAAAAAAAAAAAAAAAAAAAF/9oADAMBAAIQAxAAAAGSFyv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAn//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AX//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AX//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/An//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IX//2gAMAwEAAgADAAAAEPv/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/EH//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/EH//2Q==', 'base64');

const soi = Buffer.from([0xff, 0xd8]);
const eoi = Buffer.from([0xff, 0xd9]);

// Structural fixtures exercise marker bounds, not JPEG pixel decoding.
function segment(marker, payload) {
  const header = Buffer.from([0xff, marker, 0, 0]);
  header.writeUInt16BE(payload.length + 2, 2);
  return Buffer.concat([header, payload]);
}

function frame({ width = 512, height = 880, components = 3, marker = 0xc0 } = {}) {
  const payload = Buffer.alloc(6 + 3 * components);
  payload[0] = 8;
  payload.writeUInt16BE(height, 1);
  payload.writeUInt16BE(width, 3);
  payload[5] = components;
  for (let index = 0; index < components; index++) {
    payload[6 + 3 * index] = index + 1;
    payload[7 + 3 * index] = 0x11;
  }
  return segment(marker, payload);
}

function scan(components = 3) {
  const payload = Buffer.alloc(4 + 2 * components);
  payload[0] = components;
  for (let index = 0; index < components; index++) payload[1 + 2 * index] = index + 1;
  payload[payload.length - 2] = 63;
  return segment(0xda, payload);
}

function structuralJpeg(...headers) {
  return Buffer.concat([soi, ...headers, Buffer.from([0x12, 0xff, 0x00, 0x34]), eoi]);
}

test('real PNG dimensions remain available without enabling JPEG', () => {
  assert.deepEqual(readImageDimensions(png), { format: 'png', width: 1, height: 1 });
});

test('real baseline and progressive JPEGs report their frame dimensions when permitted', () => {
  assert.deepEqual(readImageDimensions(baselineJpeg, { allowJpeg: true }), { format: 'jpeg', width: 2, height: 3 });
  assert.deepEqual(readImageDimensions(progressiveJpeg, { allowJpeg: true }), { format: 'jpeg', width: 3, height: 2 });
});

test('JPEG requires explicit permission and is identified by bytes rather than filename assumptions', () => {
  assert.throws(() => readImageDimensions(baselineJpeg));
  assert.throws(() => readImageDimensions(baselineJpeg, { allowJpeg: false }));
  const wrongMagic = Buffer.from(baselineJpeg);
  wrongMagic[0] = 0;
  assert.throws(() => readImageDimensions(wrongMagic, { allowJpeg: true }));
  assert.throws(() => readImageDimensions(Buffer.from('not an image'), { allowJpeg: true }));
});

test('PNG rejects truncated headers, invalid IHDR declarations and zero dimensions', () => {
  for (const length of [0, 7, 8, 23, 32]) assert.throws(() => readImageDimensions(png.subarray(0, length)));
  const badLength = Buffer.from(png);
  badLength.writeUInt32BE(12, 8);
  assert.throws(() => readImageDimensions(badLength));
  const badChunk = Buffer.from(png);
  badChunk.write('JHDR', 12, 'ascii');
  assert.throws(() => readImageDimensions(badChunk));
  for (const offset of [16, 20]) {
    const zero = Buffer.from(png);
    zero.writeUInt32BE(0, offset);
    assert.throws(() => readImageDimensions(zero));
  }
});

test('JPEG skips metadata payloads even when they contain fake SOF marker bytes', () => {
  const appPayload = Buffer.concat([Buffer.from('metadata'), frame({ width: 9, height: 7 })]);
  const image = structuralJpeg(segment(0xe1, appPayload), frame(), scan());
  assert.deepEqual(readImageDimensions(image, { allowJpeg: true }), { format: 'jpeg', width: 512, height: 880 });
});

test('JPEG rejects missing frame, scan, end marker and duplicate frame headers', () => {
  const images = [
    structuralJpeg(scan()),
    Buffer.concat([soi, frame(), eoi]),
    structuralJpeg(frame(), scan()).subarray(0, -2),
    structuralJpeg(frame(), frame(), scan()),
  ];
  for (const image of images) assert.throws(() => readImageDimensions(image, { allowJpeg: true }));
});

test('JPEG rejects zero dimensions and inconsistent frame component lengths', () => {
  for (const dimensions of [{ width: 0 }, { height: 0 }]) {
    assert.throws(() => readImageDimensions(structuralJpeg(frame(dimensions), scan()), { allowJpeg: true }));
  }
  const inconsistent = frame({ components: 2 });
  inconsistent[9] = 3;
  assert.throws(() => readImageDimensions(structuralJpeg(inconsistent, scan()), { allowJpeg: true }));
});

test('JPEG rejects malformed scan component declarations and empty scans', () => {
  const inconsistent = scan(2);
  inconsistent[4] = 3;
  assert.throws(() => readImageDimensions(structuralJpeg(frame(), inconsistent), { allowJpeg: true }));
  assert.throws(() => readImageDimensions(Buffer.concat([soi, frame(), scan(), eoi]), { allowJpeg: true }));
});

test('JPEG segment bounds fail cleanly before native Buffer range errors', () => {
  const malformed = [
    Buffer.concat([soi, Buffer.from([0xff]), eoi]),
    Buffer.concat([soi, Buffer.from([0xff, 0xe0, 0]), eoi]),
    Buffer.concat([soi, Buffer.from([0xff, 0xe0, 0, 1]), frame(), scan(), eoi]),
    Buffer.concat([soi, Buffer.from([0xff, 0xe0, 0xff, 0xff]), eoi]),
    Buffer.concat([soi, Buffer.from([0xff, 0xc0, 0, 8, 8, 0]), eoi]),
  ];
  for (const image of malformed) {
    assert.throws(() => readImageDimensions(image, { allowJpeg: true }), error => error instanceof Error && !(error instanceof RangeError));
  }
});
