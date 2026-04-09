import { Resend } from "resend";

// Lazy initialize Resend to avoid issues at build time
let _resend: Resend | null = null;

export function getResend() {
    if (!_resend) {
        const apiKey = process.env.RESEND_API_KEY || "";
        _resend = new Resend(apiKey);
    }
    return _resend;
}

export const resend = {
    emails: {
        send: async (params: any) => {
            const client = getResend();
            return client.emails.send(params);
        }
    }
};
