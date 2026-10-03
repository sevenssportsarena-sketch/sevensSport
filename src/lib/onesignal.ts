import { env } from 'process';

export async function sendNewPostNotification(title: string, categorySlug: string, postSlug: string) {
  // Use the app ID from env or fallback to the one seen in the frontend component.
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'a6d3840e-b5a5-4a3d-9d95-72f36ee32adb';
  const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!restApiKey) {
    console.warn("OneSignal REST API Key (ONESIGNAL_REST_API_KEY) is not set. Cannot send push notification.");
    return;
  }

  const url = 'https://onesignal.com/api/v1/notifications';
  
  // Construct the target URL for the post. Note: adjust the base URL as necessary if process.env.NEXT_PUBLIC_SITE_URL is not set.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sevenssportsarena.com.ng';
  const postUrl = `${siteUrl}/${categorySlug}/${postSlug}`;

  const payload = {
    app_id: appId,
    included_segments: ["All"],
    contents: { 
      "en": `A new post "${title}" has been published!` 
    },
    headings: { 
      "en": "New Post Alert" 
    },
    url: postUrl
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${restApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to send OneSignal notification:', errorData);
      return;
    }

    const result = await response.json();
    console.log('OneSignal Notification sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending OneSignal notification:', error);
  }
}
