"use server";

import { safeAction } from "@thoo0224/safe-actions/server";

import { z } from "zod";

export const sendAlertAction = safeAction({
  inputValidation: z.object({
    from: z.string(),
    alert: z.string(),
  }),
  action: async ({ from, alert }) => {
    if (from === "Ethan") {
      return {
        failure: {
          message: `Ethan is not allowed to send alerts!`,
        },
      };
    }

    return {
      message: `From: ${from}\nAlert: ${alert}`,
      revalidate: true,
    };
  },
});
