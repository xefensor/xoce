// Read bounded image headers; this is a dimension check, not a pixel decoder.
const PNG_SIGNATURE = Buffer.from('89504e470d0a1a0a', 'hex');
const JPEG_FRAMES = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

/** @param {Buffer} bytes @param {{ allowJpeg?: boolean }} [options] */
export function readImageDimensions(bytes, { allowJpeg = false } = {}) {
  if (!Buffer.isBuffer(bytes)) throw new Error('Image dimensions require a byte buffer');
  if (bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    if (bytes.length < 33 || bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR') throw new Error('Invalid or truncated PNG IHDR');
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    if (!width || !height || width > 0x7fffffff || height > 0x7fffffff) throw new Error('Invalid PNG dimensions');
    return { format: 'png', width, height };
  }
  if (bytes.length < 2 || bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('Unsupported image signature');
  if (!allowJpeg) throw new Error('JPEG is allowed only for packaged settings previews');
  if (bytes.length < 4 || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) throw new Error('JPEG is missing its end marker');

  let offset = 2;
  /** @type {{ format: 'jpeg', width: number, height: number, components: number } | undefined} */
  let frame;
  while (offset < bytes.length - 2) {
    if (bytes[offset++] !== 0xff) throw new Error('Invalid JPEG header marker');
    while (offset < bytes.length && bytes[offset] === 0xff) offset++;
    if (offset >= bytes.length) throw new Error('Truncated JPEG marker');
    const marker = bytes[offset++];
    if (marker === 0x01) continue; // Standalone TEM marker.
    if (marker === 0x00 || marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) throw new Error('Unexpected JPEG header marker');
    if (offset + 2 > bytes.length - 2) throw new Error('Truncated JPEG segment length');
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length - 2) throw new Error('Invalid or truncated JPEG segment');

    if (JPEG_FRAMES.has(marker)) {
      if (frame || length < 8) throw new Error('Invalid or repeated JPEG frame');
      const precision = bytes[offset + 2], height = bytes.readUInt16BE(offset + 3), width = bytes.readUInt16BE(offset + 5), components = bytes[offset + 7];
      if (!width || !height || !components || length !== 8 + 3 * components || precision < 2 || precision > 16 || (marker === 0xc0 && precision !== 8)) throw new Error('Invalid JPEG frame dimensions or components');
      frame = { format: 'jpeg', width, height, components };
    }
    if (marker === 0xda) {
      if (!frame || length < 6) throw new Error('JPEG scan is missing a valid frame');
      const components = bytes[offset + 2];
      if (!components || components > frame.components || length !== 6 + 2 * components || offset + length >= bytes.length - 2) throw new Error('Invalid or empty JPEG scan');
      return { format: frame.format, width: frame.width, height: frame.height };
    }
    offset += length;
  }
  throw new Error('JPEG is missing a valid frame or scan');
}
