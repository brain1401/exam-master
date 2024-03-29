export function handleEnterKeyPress<T extends () => void>(
  e: React.KeyboardEvent<HTMLElement>,
  callback: T,
): void {
  if (e.key === "Enter") {
    e.preventDefault();
    callback();
  }
}
