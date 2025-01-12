import { resend } from "@/lib/resend";
import WelcomeEmail from "../../emails/WelcomeEmail";
import { ApiResponse } from "@/types/ApiResponse";

/**
 * Sends a welcome email to the user upon successful registration.
 * 
 * @param {string} email - The recipient's email address.
 * @param {string} username - The recipient's username.
 * @returns {Promise<ApiResponse>} The result of the email-sending operation.
 */
export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<ApiResponse> {
  try {
    // Sending the welcome email using Resend's email API
    await resend.emails.send({
      from: "welcome@codelio.dev",
      to: email,
      subject: "Welcome to Codelio!",
      react: WelcomeEmail({ username }),
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending welcome email", emailError);
    return {
      success: false,
      message: "Failed to send welcome email",
    };
  }
}
