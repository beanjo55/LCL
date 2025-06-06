export function extractDateFromUuidV7(uuid: string): Date {
  // strip hyphens and basic sanity check
  const hex = uuid.replace(/-/g, "");
  if (hex.length !== 32) throw new Error("Invalid UUID format");

  // ensure it’s version 7 (the first nibble of the 3rd group)
  const version = parseInt(hex[12], 16);
  if (version !== 7) throw new Error("Not a UUID-v7");

  // first 12 hex digits = 48-bit milliseconds since Unix epoch
  const tsHex = hex.slice(0, 12);
  const ms = parseInt(tsHex, 16);

  return new Date(ms);
}
