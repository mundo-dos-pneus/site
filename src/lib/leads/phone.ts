export function normalizePhoneBR(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const original = raw.trim();
  const digits = original.replace(/\D/g, "");
  let e164: string | null = null;
  
  if (original.startsWith("+")) {
    e164 = /^\d{8,15}$/.test(digits) ? `+${digits}` : null;
  } else if (digits.length === 12 || digits.length === 13) {
    e164 = digits.startsWith("55") ? `+${digits}` : null;
  } else if (digits.length === 10 || digits.length === 11) {
    e164 = `+55${digits}`;
  }
  
  if (!e164) return null;
  
  // Apply canonicalPhoneBR logic (ensuring 9th digit for BR mobiles)
  const d = e164.replace(/\D/g, "");
  if (!d.startsWith("55")) return e164;
  
  const ddd = d.slice(2, 4);
  const local = d.slice(4);
  if (ddd.length !== 2 || !/^[1-9][0-9]$/.test(ddd)) return e164;
  
  // 12 digits: missing 9th digit on mobile
  if (local.length === 8) {
    if (!/^[6-9]/.test(local)) return e164;
    return `+55${ddd}9${local}`;
  }
  
  // 13 digits: keep it (it already has the 9th digit)
  if (local.length === 9 && local.startsWith("9") && /^[6-9]/.test(local.slice(1))) {
    return e164;
  }
  
  return e164;
}
