export interface SendMailData {
  to: string;
  subject: string;
  body: string;
}

export interface MailProvider {
  sendMail(data: SendMailData): Promise<void>;
}
