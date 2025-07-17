# 🧱 Basic Result

**Basic Result** is a lightweight utility for improving runtime safety by standardizing error handling through a simple `Result` pattern. Inspired by languages like Rust, this pattern avoids exceptions by explicitly modeling both success and failure.

---

## 🚀 Features

* Consistent handling of asynchronous and synchronous errors
* Eliminates the need for repetitive `try/catch` blocks
* Composable with utilities like `all(...)` for aggregating multiple results
* Fully type-safe and lightweight

---

## 📦 Installation

```bash
npm install basic-result
```

---

## ✨ Usage

### 1. Define a function that returns a `Result`

The `Result<T>` type wraps your successful value (`Ok`) or error (`Err`). Here's how to fetch a GitHub profile using the `Result` pattern:

```ts
import { Ok, Err, convertToError, type Result } from "basic-result";

export async function getGithubProfile(
  username: string
): Promise<Result<{ name: string; id: number }>> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);

    if (!res.ok) {
      return Err(new Error(`Failed to fetch ${username}: ${res.statusText}`));
    }

    const data = await res.json() as { name: string; id: number };
    return Ok({ name: data.name, id: data.id });

  } catch (e) {
    return Err(convertToError(e));
  }
}
```

---

### 2. Handle the result

You can now consume your function without `try/catch`:

```ts
import { getGithubProfile } from "./getGithubProfile";

async function main() {
  const result = await getGithubProfile("octocat");

  if (result.ok) {
    console.log("User profile:", result.value);
  } else {
    console.error("Error fetching profile:", result.error.message);
  }
}
```

---

### 3. Execute multiple `Result`-returning functions in parallel

Use the built-in `all(...)` utility to run multiple `Result`-returning promises in parallel. If any one fails, it returns the first error.

```ts
import { all } from "basic-result";
import { getGithubProfile } from "./getGithubProfile";

async function main() {
  const result = await all([
    getGithubProfile("octocat"),
    getGithubProfile("asynchroza"),
  ]);

  if (result.ok) {
    const [octocat, asynchroza] = result.value;
    console.log("Octocat:", octocat);
    console.log("Asynchroza:", asynchroza);
  } else {
    console.error("One of the fetches failed:", result.error.message);
  }
}
```
---

## 🛠️ Contributing

Pull requests and improvements are welcome! Feel free to open issues for ideas or bugs.

---

## 📄 License

MIT

