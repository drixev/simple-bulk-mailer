import Type, { Static } from "typebox";

export const AuthSchema = Type.Object({
  user: Type.String(),
  password: Type.String(),
});

export type AuthPayload = Static<typeof AuthSchema>;
