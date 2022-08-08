import * as Yup from "yup";

export function YupSequentialStringSchema(schemas: Yup.StringSchema[]) {
  return Yup.string().test(async (value, context) => {
    try {
      for (const schema of schemas) {
        // eslint-disable-next-line no-await-in-loop
        await schema.validate(value);
      }
    } catch (error: unknown) {
      const message = (error as Yup.ValidationError).message;
      return context.createError({message});
    }
    return true;
  });
}
