// export function toComma(value: number | string): string {
//   return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
// }

type Value = number | string | undefined;

export function toComma(value: Value): string {
  let new_value: Value;
  {
    typeof value === "string"
      ? (new_value =
          value !== undefined
            ? value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
            : "null")
      : (new_value =
          value !== undefined
            ? value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
            : "null");
  }
  return new_value;
}

export function deComma(value: string): string {
  let new_value = value.replace(/,/g, "");
  return new_value;
}
