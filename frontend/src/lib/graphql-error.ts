const TECHNICAL =
  /unknown argument|is required, but it was not provided|cannot query field|did you mean|failed to fetch|network request failed|load failed/i

export function graphqlErrorMessage(err: unknown, fallback: string) {
  const message = err instanceof Error ? err.message : ''
  if (!message || TECHNICAL.test(message)) return fallback
  return message
}
