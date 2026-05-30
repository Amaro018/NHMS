import { resolver } from "@blitzjs/rpc"
import { AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import { Role } from "types"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  console.log("[login] step 1: parsing input")
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })

  console.log("[login] step 2: looking up user", email)
  const user = await db.user.findFirst({ where: { email } })
  if (!user) {
    console.log("[login] step 2 FAILED: user not found")
    throw new AuthenticationError()
  }
  console.log("[login] step 2 OK: user found, id=", user.id)

  console.log("[login] step 3: verifying password")
  const result = await SecurePassword.verify(user.hashedPassword, password)
  console.log("[login] step 3 OK: verify result=", result)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    console.log("[login] step 3b: rehashing password")
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
    console.log("[login] step 3b OK: rehash done")
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  console.log("[login] resolver started")
  const user = await authenticateUser(email, password)
  console.log("[login] step 4: creating session")
  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  console.log("[login] step 4 OK: session created")
  return user
})
