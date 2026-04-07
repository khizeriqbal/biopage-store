# This script pushes all required env vars to Vercel production

$vars = @{
    "NEXTAUTH_SECRET"       = "f6e72c019d084d59ab5f79a9e22709f6"
    "NEXTAUTH_URL"          = "https://biopage-store.vercel.app"
    "NEXT_PUBLIC_APP_URL"   = "https://biopage-store.vercel.app"
    "NEXT_PUBLIC_APP_NAME"  = "bio page.store"
    "WHOP_API_KEY"          = "apik_gj2BSjBuILuXY_C4723917_C_ad9a0cefd6f1a3750010c4eda6c0a26faafcee63c168d0b31019f79a1261ff"
    "WHOP_COMPANY_ID"       = "biz_JDLvuy8GpmRGS"
    "WHOP_CLIENT_ID"        = "app_AwyYTm0NDY7Te3"
    "WHOP_CLIENT_SECRET"    = "apik_F4SIX138nqeQv_A2033049_C_a38f2f53bfbbe2a980060e7709695d4cf436c385701143e6ae425690091b5f"
    "WHOP_WEBHOOK_SECRET"   = "ws_07dd0909a35ea12747d7ff4dcf74bc755ad96eaa374cd5a81175446f7e11db9b"
    "WHOP_PLAN_STARTER"     = "plan_mH1BU206Vwljc"
    "WHOP_PLAN_CREATOR"     = "plan_8C7an3EiaENYt"
    "RESEND_API_KEY"        = "re_..."
    "EMAIL_FROM"            = "noreply@biopage.store"
    "GEMINI_API_KEY"        = "AIza..."
}

foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    Write-Host "Setting $key..."
    echo $value | vercel env add $key production --force
}

Write-Host "All env vars pushed!"
