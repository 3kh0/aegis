import { generateOTP, storeOTP } from "../../utils/otp";
import { sendOTPEmail } from "../../utils/email";
import { parseBody } from "../../utils/api";
import { emailSchema } from "../../utils/schemas";

export default defineEventHandler(async (event) => {
  const { email } = await parseBody(event, emailSchema);

  const code = generateOTP();
  const token = await storeOTP(email, code);

  await sendOTPEmail(event, email, code, token);

  return { success: true };
});
