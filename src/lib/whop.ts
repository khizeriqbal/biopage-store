import Whop from "@whop/sdk";

// Initialize the Whop SDK for Platform API calls
// The WHOP_API_KEY environment variable should be your Whop Personal/Company API Key
export const whop = new Whop({
    apiKey: process.env.WHOP_API_KEY || "dummy_key_for_build",
});
