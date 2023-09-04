<div align="center">
  <h1>Safe Actions</h1>
  <p>Safe actions with zod and revalidation for server actions in Next.JS</p>

  <p align="center">
    <a aria-label="License" href="https://github.com/thoo0224/safe-actions">
      <img src="https://img.shields.io/npm/l/@thoo0224/safe-actions?color=blue">
    </a>
    <a aria-label="NPM version" href="https://www.npmjs.com/package/@thoo0224/safe-actions">
      <img alt="" src="https://img.shields.io/npm/v/@thoo0224/safe-actions?color=success">
    </a>
    <a aria-label="GH Stars" href="https://www.npmjs.com/package/@thoo0224/safe-actions">
      <img alt="" src="https://img.shields.io/github/stars/thoo0224/safe-actions?style=social">
    </a>
  </p>
</div>

### Installation

```console
pnpm add @thoo0224/safe-actions zod
yarn add @thoo0224/safe-actions zod
npm install @thoo0224/safe-actions zod
```

### Get Started

Create the action.

```ts
"use server";

import { safeAction } from "@thoo0224/safe-actions/server";
import { z } from "zod";

export const sendAlertAction = safeAction({
  inputValidation: z.object({
    from: z.string(),
    alert: z.string(),
  }),
  action: async ({ from, alert }) => {
    if(from === "Ethan") {
      return {
        failure: {
          message: "Ethan can't send alerts!"
        };
      }
    }

    return {
      message: `From: ${from}\nMessage: ${alert}`,
      revalidate: true // This will call revalidatePath() on the revalidation paths if they are provided in the useSafeAction hook.
    }
  },
});
```

Use the action.

```tsx
"use client";

import { useSafeAction } from "@thoo0224/safe-actions/client";
import { sendAlertAction }from "./actions";

export default function AlertForm() {
  // When the action finishes successfully, it will revalidate [/, /somePath, /someOtherPath]
  const { run, data, error, isRunning } = useSafeAction({
    sendAlertAction,
    persistDate: true // When false, `data` will be set to null before the action is ran. When true, `data` will only change if the action is finished.
    revalidationPaths: ["/somePath", "/someOtherPaths"],
    revalidateCurrentPath: true, // Revalidates the current path (`usePathname()`) Default: false
  });

  // OR

  const { run, data, error, isRunning } = useSafeAction(sendAlertAction);

  return <button onClick={async () => {
    const data2 = await run();
  }}>
    Alert
  </button>
}
```

### Contribution

Any type of contribution is greatly appreciated!
