export default function candidateNumber(number:number) {
  let result = "";

  switch (number) {
    case 1:
      result = "①";
      break;
    case 2:
      result = "②";
      break;
    case 3:
      result = "③";
      break;
    case 4:
      result = "④";
      break;
    case 5:
      result = "⑤";
      break;
    case 6:
      result = "⑥";
      break;
  }

  return result;
}
