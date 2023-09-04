"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ZodTypeAny, z } from "zod";

import { SafeAction as RevalidatedSafeAction } from "./server";

export type SafeAction<InputType extends ZodTypeAny, ResponseType> = (
  input: z.infer<InputType>
) => Promise<ResponseType>;

type UseSafeActionOptions<InputType extends ZodTypeAny, ResponseType> = {
  action: RevalidatedSafeAction<InputType, ResponseType>;
  persistData?: boolean;
  revalidateCurrentPage?: boolean;
  revalidationPaths?: string[];
};

type SafeActionData<ResponseType> = Omit<ResponseType, "revalidate"> | null;

/**
 *
 * @example
 * // Usage:
 * // When the action finishes successfully, it will revalidate [/, /somePath, /someOtherPath]
 * const { run, data, error, isRunning } = useSafeAction({
 *   action: sendAlertAction,
 *   persistData: true, // When false, `data` will be set to null before the action is ran. When true, `data` will only change if the action is finished.
 *   revalidationPaths: ["/somePath", "/someOtherPaths"],
 *   revalidateCurrentPath: true, // Revalidates the current path (`usePathname()`) Default: false
 * });
 */
export function useSafeAction<InputType extends ZodTypeAny, ResponseType>(
  action:
    | RevalidatedSafeAction<InputType, ResponseType>
    | UseSafeActionOptions<InputType, ResponseType>
) {
  const hasOptions = "action" in action;
  const doAction = useRef(hasOptions ? action.action : action);

  const [data, setData] = useState<SafeActionData<ResponseType> | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (hasOptions && action.revalidateCurrentPage) {
    const currentPath = usePathname();
    if (!action.revalidationPaths) action.revalidationPaths = [];

    action.revalidationPaths.push(currentPath);
  }

  const run: SafeAction<InputType, SafeActionData<ResponseType> | null> =
    useMemo(
      () => async (input: z.infer<InputType>) => {
        setIsRunning(true);
        setError(null);

        if (hasOptions && !action.persistData) {
          setData(null);
        }

        try {
          const result = await doAction.current(
            input,
            hasOptions && action.revalidationPaths
              ? action.revalidationPaths
              : []
          );
          setData(result);
          setIsRunning(false);

          return data;
        } catch (e) {
          setError(e as Error);
          setIsRunning(false);
          if (hasOptions && action.persistData) {
            setData(null);
          }

          return null;
        }
      },
      []
    );

  return {
    run,
    data,
    isRunning,
    error,
  };
}
