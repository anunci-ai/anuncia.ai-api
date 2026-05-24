import { Resend } from "resend";
import { MailProvider, SendMailData } from "../../domain/application/providers/mail-provider";
import { env } from "../env";

export class ResendMailProvider implements MailProvider {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendMail({ to, subject, body }: SendMailData): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: "Equipe Anuncia.ai <onboarding@resend.dev>",
      to,
      subject,
      html: body,
    });

    if (error) {
      console.error("[ResendMailProvider] Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
