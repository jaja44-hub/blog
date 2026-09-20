# Google Ads and AdSense Onboarding Runbook

**Prepared:** 2026-09-20  
**Properties:** `blog.addiscrown.et` and `addiscrown.et`  
**Purpose:** Prevent the advertiser signup flow from being mistaken for the publisher monetization path.

## Executive conclusion

The account flow that opened for customer `7251926003` is a **Google Ads advertiser signup**. It is designed for a business that wants to pay Google to show campaigns. It is not the connection required for Addis Crown to display ads on its own website or receive publisher revenue.

The correct website-monetization product is **Google AdSense**. AdSense reviews the site, connects the publisher account to the site, provides Auto ads, and pays the publisher when eligible ads are served. Google Ads may be one source of advertiser demand buying AdSense inventory, but the Addis Crown publisher does not need to create a Google Ads campaign to earn AdSense revenue. Google states that AdSense Auto ads use one piece of code and automatically place ads after the site is ready and the publisher enables the formats.[1] Google’s revenue-share documentation also describes the publisher share for AdSense for Content, including when advertisers buy display ads through Google Ads.[2]

The **Google Partners** program is a separate program for agencies or third parties managing Google Ads accounts for clients. It is not a prerequisite for website ad monetization.[3] Google’s **Certified Publishing Partners** are vetted service providers that help publishers; joining or using one is also optional.[4]

## What the current customer means

The signed-in UI opened customer `725-192-6003` in a **New campaign** wizard with `mode=signup`. The form showed a prefilled business name, `briliance`. Direct navigation to account preferences and account settings returned to the same signup flow. The API independently returned `CUSTOMER_NOT_ENABLED`.

Together, these observations indicate that the customer is an incomplete or draft advertiser signup, not an active advertiser account ready for API use. Completing the advertiser flow is not needed for AdSense monetization. The flow was intentionally left unchanged.

## Product separation

| Goal | Correct product | Does customer `7251926003` need to be completed? | What Addis Crown should do |
|---|---|---:|---|
| Show ads on the blog and earn publisher revenue | AdSense | No | Complete AdSense site connection and review for the chosen publisher property, then enable Auto ads after approval. |
| Buy traffic for the blog or legal app | Google Ads | Yes, for the advertiser account used to buy traffic | Create or activate an advertiser account, choose billing settings, and create campaigns only when a paid acquisition decision exists. |
| Manage multiple advertiser accounts or apply for Ads API access | Google Ads API and possibly a manager account | Not necessarily this customer | Use a Google Cloud project, OAuth, and the current API access process. A manager account is needed only when managing multiple accounts. |
| Earn a Google Partners badge or agency benefits | Google Partners | No | Ignore unless Addis Crown becomes an advertising agency managing client accounts. |
| Obtain help optimizing publisher inventory | Certified Publishing Partner | No | Optional third-party service; not required for AdSense. |

## AdSense path for the blog

The practical publisher path is as follows. These steps do not require starting a paid Google Ads campaign.

### 1. Choose the publisher property

AdSense rejected the blog subdomain in the earlier Add Site form and suggested the top-level property `addiscrown.et`. The current legal app contains the AdSense account meta tag for publisher ID `ca-pub-2006507251466560`, so the root-domain property is the supported working assumption. The blog remains the canonical publication, while the legal app remains a separate application.

The account owner should confirm in AdSense that the connected site is the intended root domain. Do not add the legal application as an ad-serving property merely because it hosts the root domain. The current plan keeps ad placements blog-scoped.

### 2. Prepare the site-review materials

Google’s eligibility guidance requires original, high-quality content, policy compliance, and an applicant who is at least 18.[5] Google’s site-readiness guidance emphasizes useful original content, clear navigation, and a good user experience.[6] The owner should have the following ready:

- The final canonical site URL and the property chosen in AdSense.
- A stable public site with working navigation and useful original articles.
- Privacy policy, terms, contact, corrections, and accessibility pages. The blog already exposes these reader-facing routes.
- A clear ownership and publisher identity in the Google account.
- Accurate payments-profile name and address. The address must later be able to receive Google’s PIN mail; Google requires address verification before issuing payments.[7]
- Identity and payment verification documents if Google requests them. These are account-owner materials and must not be placed in the repository or sent through chat.

### 3. Complete AdSense site connection and review

The owner completes the AdSense site connection in the signed-in AdSense account. Google then reviews the site. No application code should claim that approval has occurred until the AdSense dashboard shows the site as ready.

### 4. Publish ads.txt at the root domain

Google says ads.txt is optional but highly recommended. When used, it belongs at the root URL, for example `https://addiscrown.et/ads.txt`, and the publisher line must use the publisher ID supplied by the AdSense account.[8] The known publisher ID from the existing legal-app verification marker is `ca-pub-2006507251466560`; the ads.txt form uses the corresponding `pub-2006507251466560` value.

A reversible publisher-side fix has been prepared in the legal app at `public/ads.txt`:

```text
google.com, pub-2006507251466560, DIRECT, f08c47fec0942fa0
```

This line authorizes the publisher identity. It does not place ads, create a campaign, or charge money. It should still be reviewed against the live AdSense account before production deployment.

### 5. Enable Auto ads only after approval

After AdSense reports the site as ready, the owner can enable Auto ads and the relevant formats in AdSense. The site then needs the AdSense code on the intended pages. Auto ads are controlled from AdSense and can be adjusted or disabled there.[1] The legal app should remain free of ad placements unless a separate product decision authorizes them.

### 6. Complete payment verification later

Payment profile, identity verification, and address PIN verification are not the same as website ownership verification. Google may request identity or payment information, and it requires payments-address verification before sending payments.[7] These steps require the owner’s exact legal and financial details. They cannot safely be guessed or bypassed.

## Google Ads path, only if advertiser/API capability is actually wanted

If the real goal later becomes buying traffic or building a read-only Ads reporting integration, the required materials differ from AdSense.

Google’s current API documentation says new API access is managed through the Google Cloud project rather than a new developer-token application in the old Ads API Center.[9] The API access level is associated with the Google Cloud project. Test access is for test accounts; Explorer, Basic, and Standard access have progressively broader production and quota capabilities.[10]

For a future read-only integration, prepare:

- The Google Cloud project that will own the OAuth client.
- The OAuth client configuration and redirect policy, kept outside the repository.
- The intended customer ID, with hyphens removed when used in API configuration.
- Administrator access to the target Ads customer.
- A clear decision whether one customer is enough or a manager account is needed. Google says a manager account is needed only when the application must link to and manage multiple accounts.[9]
- A read-only reporting purpose. Google’s API access model distinguishes reporting use from campaign creation and management.[10]

The blog’s current Google Ads module is only a local database scaffold. It should not be connected to real Google Ads credentials until the target customer is active and the intended API scope is approved. No code change is required to solve the current AdSense revenue blocker.

## What can be bypassed and what cannot

The following advertiser steps can be avoided because they are unrelated to publisher monetization: creating a campaign, selecting a campaign goal, setting an advertising budget, and entering a Google Ads payment method. Google’s own Ads signup guide says an account can be created without a campaign, but that remains an advertiser account and still does not create AdSense publisher revenue.[11]

The following steps cannot be bypassed lawfully or safely: AdSense site ownership and review, Google policy compliance, identity/payment verification when requested, payments-address verification before payout, and accurate publisher declarations. They are account controls, not branding or domain-merging requirements.

The blog and legal app should remain separate applications, databases, and visitor systems. A root-domain AdSense property does not require shared cookies, shared login, shared audience data, or Google Ads campaigns on the legal app.

## Recommended next sequence

The immediate sequence is to review and deploy the root-domain `ads.txt` line, confirm the root-domain site in AdSense, submit or monitor the site review, and enable Auto ads only after AdSense marks the site ready. The Google Ads customer should remain untouched. If the owner later wants an Ads API reporting connection, the next step is a separate Google Cloud API-access review rather than completing a paid campaign wizard.

## References

[1]: https://support.google.com/adsense/answer/9261805?hl=en "About Auto ads - Google AdSense Help"
[2]: https://support.google.com/adsense/answer/180195?hl=en "AdSense revenue share"
[3]: https://business.google.com/us/support/become-a-partner/ "Google Partners program"
[4]: https://www.google.com/ads/publisher/partners/ "Certified Publishing Partner program"
[5]: https://support.google.com/adsense/answer/9724?hl=en "Eligibility requirements for AdSense"
[6]: https://support.google.com/adsense/answer/7299563?hl=en "Make sure your site's pages are ready for AdSense"
[7]: https://support.google.com/adsense/answer/157667?hl=en "Address verification PIN overview"
[8]: https://support.google.com/adsense/answer/12171612?hl=en "Ads.txt guide for AdSense"
[9]: https://developers.google.com/google-ads/api/docs/api-policy/developer-token "Google Ads API developer token and current API access onboarding"
[10]: https://developers.google.com/google-ads/api/docs/api-policy/access-levels "Google Ads API access levels and permissible use"
[11]: https://support.google.com/google-ads/answer/6366720?hl=en "Create a Google Ads account: How to sign up"
