const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

function getKeyMaterial(): CryptoKey {
  const base64Key = process.env.NEXT_PRIVATE_ENCRYPTION_KEY;
  if (!base64Key) {
    throw new Error("Missing NEXT_PRIVATE_ENCRYPTION_KEY env");
  }
  const raw = Uint8Array.from(Buffer.from(base64Key, "base64"));
  if (raw.byteLength !== 32) {
    throw new Error("Encryption key must be 32 bytes base64");
  }
  return (globalThis.crypto as Crypto).subtle.importKey(
    "raw",
    raw,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  ) as unknown as CryptoKey;
}

async function deriveKey(): Promise<CryptoKey> {
  return getKeyMaterial();
}

export async function encryptString(plaintext: string): Promise<string> {
  const key = await deriveKey();
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const data = TEXT_ENCODER.encode(plaintext);
  const cipherBuf = await (globalThis.crypto as Crypto).subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );
  const cipher = new Uint8Array(cipherBuf);
  const out = new Uint8Array(iv.byteLength + cipher.byteLength);
  out.set(iv, 0);
  out.set(cipher, iv.byteLength);
  return Buffer.from(out).toString("base64");
}

export async function decryptString(payload: string): Promise<string> {
  if (!payload) return "";
  const key = await deriveKey();
  const raw = Uint8Array.from(Buffer.from(payload, "base64"));
  const iv = raw.slice(0, 12);
  const cipher = raw.slice(12);
  const plainBuf = await (globalThis.crypto as Crypto).subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher,
  );
  return TEXT_DECODER.decode(plainBuf);
}
