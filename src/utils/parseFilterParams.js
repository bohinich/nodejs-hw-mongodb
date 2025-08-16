const ALLOWED_TYPES = ['work', 'home', 'personal'];

function parseType(value) {
  if (!value) return undefined;
  return ALLOWED_TYPES.includes(value) ? value : undefined;
}

function parseIsFavourite(value) {
  if (!value) return undefined;

  if (value === 'true') return true;
  if (value === 'false') return false;

  return undefined; // все інше відкидаємо
}

export function parseFilterParams(query) {
  const { type, isFavourite } = query;

  return {
    type: parseType(type),
    isFavourite: parseIsFavourite(isFavourite),
  };
}
