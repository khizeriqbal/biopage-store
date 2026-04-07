import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirm({ email, productName, productUrl, sellerName }: { email: string; productName: string; productUrl: string; sellerName: string }) {
    try {
        await resend.emails.send({
            from: "bio page store <delivery@biopage.store>",
            to: email,
            subject: `Your purchase: ${productName} ✨`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h2 style="color: #5C4EFA;">Thanks for your purchase!</h2>
          <p>Hi there,</p>
          <p>You just purchased <strong>${productName}</strong> from <strong>${sellerName}</strong>.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${productUrl}" style="background-color: #5C4EFA; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Access Your Product
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link: <br/> ${productUrl}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;"/>
          <p style="font-size: 12px; color: #999;">Powered by <a href="https://biopage.store" style="color: #5C4EFA;">bio page.store</a></p>
        </div>
      `,
        });
    } catch (err) {
        console.error("Email Delivery Error:", err);
    }
}

export async function sendWelcome({ email, creatorName, bioLink }: { email: string; creatorName: string; bioLink: string }) {
    try {
        await resend.emails.send({
            from: "bio page store <hi@biopage.store>",
            to: email,
            subject: `You're subscribed to ${creatorName} 🌟`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h2 style="color: #5C4EFA;">You're on the list!</h2>
          <p>Hi there,</p>
          <p>You've successfully subscribed to updates from <strong>${creatorName}</strong>.</p>
          <p>You can view their full page here:</p>
          <div style="margin: 30px 0; text-align: center;">
             <a href="${bioLink}" style="background-color: #5C4EFA; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
               View ${creatorName}'s Page
             </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;"/>
          <p style="font-size: 12px; color: #999;">Powered by <a href="https://biopage.store" style="color: #5C4EFA;">bio page.store</a></p>
        </div>
      `
        });
    } catch (err) {
        console.error("Welcome email error:", err);
    }
}
