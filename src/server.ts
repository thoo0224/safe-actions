import { revalidatePath } from "next/cache";
import { ZodTypeAny, z } from "zod";

export type SafeActionResponse<ResponeType> =
  | ResponeType
  | (ResponeType & {
      revalidate?: boolean;
    });

export type SafeAction<InputType extends ZodTypeAny, ResponseType> = (
  input: z.infer<InputType>,
  revalidationPaths: string[]
) => Promise<SafeActionResponse<ResponseType>>;

type SafeActionOptions<InputType extends ZodTypeAny, ResponseType> = {
  inputValidation?: InputType;
  action: SafeAction<InputType, ResponseType>;
};

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
