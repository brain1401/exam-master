export interface Token {
  type: string;
  value: string;
}

function processStringToken(
  input: string,
  current: number,
): { token: Token | null; current: number } {
  let value = "";
  let danglingQuote = false;

  let char = input[++current];

  while (char !== '"') {
    if (current === input.length) {
      danglingQuote = true;
      break;
    }

    if (char === "\\") {
      current++;
      if (current === input.length) {
        danglingQuote = true;
        break;
      }
      value += char + input[current];
      char = input[++current];
    } else {
      value += char;
      char = input[++current];
    }
  }

  char = input[++current];

  if (!danglingQuote) {
    return { token: { type: "string", value }, current };
  }

  return { token: null, current };
}

export function tokenize(input: string): Token[] {
  let current = 0;
  const tokens: Token[] = [];

  while (current < input.length) {
    let char = input[current];

    switch (char) {
      case "\\":
        current++;
        continue;
      case "{":
        tokens.push({ type: "brace", value: "{" });
        current++;
        continue;
      case "}":
        tokens.push({ type: "brace", value: "}" });
        current++;
        continue;
      case "[":
        tokens.push({ type: "paren", value: "[" });
        current++;
        continue;
      case "]":
        tokens.push({ type: "paren", value: "]" });
        current++;
        continue;
      case ":":
        tokens.push({ type: "separator", value: ":" });
        current++;
        continue;
      case ",":
        tokens.push({ type: "delimiter", value: "," });
        current++;
        continue;
      case '"': {
        const { token, current: newCurrent } = processStringToken(
          input,
          current,
        );
        if (token) {
          tokens.push(token);
        }
        current = newCurrent;
        continue;
      }
      default:
        const WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
          current++;
          continue;
        }

        const NUMBERS = /[0-9]/;
        if (NUMBERS.test(char) || char === "-" || char === ".") {
          let value = "";

          if (char === "-") {
            value += char;
            char = input[++current];
          }

          while (NUMBERS.test(char) || char === ".") {
            value += char;
            char = input[++current];
          }

          tokens.push({ type: "number", value: value });
          continue;
        }

        const LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
          let value = "";

          while (LETTERS.test(char)) {
            if (current === input.length) {
              break;
            }
            value += char;
            char = input[++current];
          }

          if (value == "true" || value == "false") {
            tokens.push({ type: "name", value: value });
          } else {
            throw new Error(
              "Invalid token: " + value + " is not a valid token!",
            );
          }
          continue;
        }

        current++;
    }
  }

  return tokens;
}

export function strip(tokens: Token[]): Token[] {
  if (tokens.length === 0) {
    return tokens;
  }

  const lastToken = tokens[tokens.length - 1];

  switch (lastToken.type) {
    case "separator":
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
    case "number":
      const lastCharacterOfLastToken =
        lastToken.value[lastToken.value.length - 1];
      if (
        lastCharacterOfLastToken === "." ||
        lastCharacterOfLastToken === "-"
      ) {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
    case "string": {
      const tokenBeforeTheLastToken = tokens[tokens.length - 2];
      if (tokenBeforeTheLastToken.type === "delimiter") {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      } else if (
        tokenBeforeTheLastToken.type === "brace" &&
        tokenBeforeTheLastToken.value === "{"
      ) {
        tokens = tokens.slice(0, tokens.length - 1);
        return strip(tokens);
      }
    }
    case "delimiter":
      tokens = tokens.slice(0, tokens.length - 1);
      return strip(tokens);
  }

  return tokens;
}

export function unstrip(tokens: Token[]): Token[] {
  const tail: string[] = [];

  tokens.forEach((token) => {
    if (token.type === "brace") {
      if (token.value === "{") {
        tail.push("}");
      } else {
        tail.splice(tail.lastIndexOf("}"), 1);
      }
    }
    if (token.type === "paren") {
      if (token.value === "[") {
        tail.push("]");
      } else {
        tail.splice(tail.lastIndexOf("]"), 1);
      }
    }
  });

  if (tail.length > 0) {
    tail.reverse().forEach((item) => {
      if (item === "}") {
        tokens.push({ type: "brace", value: "}" });
      } else if (item === "]") {
        tokens.push({ type: "paren", value: "]" });
      }
    });
  }

  return tokens;
}

export function generate(tokens: Token[]): string {
  let output = "";

  tokens.forEach((token) => {
    switch (token.type) {
      case "string":
        output += '"' + token.value + '"';
        break;
      default:
        output += token.value;
        break;
    }
  });

  return output;
}

function isEmptyObj(obj: any): boolean {
  return obj.constructor === Object && Object.keys(obj).length === 0;
}

function isEmptyArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

function isValidData(data: any): boolean {
  return (
    data !== null &&
    data !== undefined &&
    !isEmptyObj(data) &&
    !isEmptyArray(data)
  );
}

function filterEmptyValues(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.filter(isValidData);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        filterEmptyValues(value),
      ]),
    );
  }
  return obj;
}

export default function partialParse(input: string): any {
  const parsed = JSON.parse(generate(unstrip(strip(tokenize(input)))));
  return filterEmptyValues(parsed);
}
