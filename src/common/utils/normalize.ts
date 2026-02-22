/**
 * Normalizes a MongoDB document by mapping `_id` to `id`.
 * Handles the inconsistency where paginated list endpoints return `_id`
 * (due to `.lean()`) while single-document endpoints return `id`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeId<T>(doc: any): T {
  if (!doc || typeof doc !== "object") return doc;
  const normalized = { ...doc };
  if ("_id" in normalized && !("id" in normalized)) {
    normalized.id = String(normalized._id);
    delete normalized._id;
  }
  if ("__v" in normalized) {
    delete normalized.__v;
  }
  return normalized as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeResponse<T>(response: any): { data: T[] } {
  const data = Array.isArray(response.data)
    ? response.data.map((doc: T) => normalizeId<T>(doc))
    : [];
  return { ...response, data };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeSingleResponse<T>(response: any): { data: T } {
  return { ...response, data: normalizeId<T>(response.data) };
}
