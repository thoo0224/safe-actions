import { revalidatePath } from "next/cache";
import { ZodTypeAny, z } from "zod";

export type SafeAction<InputType extends ZodTypeAny, ResponseType> = (
  input: z.infer<InputType>,
  revalidationPaths: string[]
) => Promise<SafeActionResponse<ResponseType>>;

type SafeActionResponse<ResponeType> =
  | ResponeType
  | (ResponeType & {
      revalidate?: boolean;
    });

type SafeActionOptions<InputType extends ZodTypeAny, ResponseType> = {
  inputValidation?: InputType;
  action: SafeAction<InputType, ResponseType>;
};

/**
 * @param {SafeActionOptions<InputType, ResponseType>} Options
 * @returns {SafeAction<InputType, ResponseType>} Validated Server Action
 *
 * @example
 * // Usage:
 * export const sendAlertAction = safeAction({
 *   inputValidation: z.object({
 *     from: z.string(),
 *     alert: z.string();
 *   });
 *   actions: async ({ from, alert }) => {
 *     // ... your server action
 *   };
 * });
 */
export function safeAction<InputType extends ZodTypeAny, ResponseType>(
  options: SafeActionOptions<InputType, ResponseType>
): SafeAction<InputType, ResponseType> {
  return async function (
    input: InputType,
    revalidationPaths: string[] = []
  ): Promise<ResponseType> {
    const passthrough = { parse: (i: any) => i };
    const { inputValidation, action } = options;

    const validatedInput = (inputValidation ?? passthrough).parse(input);
    const result = await action(validatedInput, revalidationPaths);

    if (revalidationPaths.length > 0 && "revalidate" in (result as any)) {
      for (const path of revalidationPaths) {
        revalidatePath(path);
      }
    }

    return result;
  };
}
