export function defineConstants<const Value extends object>(value: Value): Readonly<Value> {
  return Object.freeze(value);
}
