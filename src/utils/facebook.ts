// Utility functions for social media integrations will go here.

import axios from 'axios';

// Facebook OAuth URLs and App Config
const FB_OAUTH_BASE = 'https://www.facebook.com/v23.0/dialog/oauth';
const FB_TOKEN_URL = 'https://graph.facebook.com/v23.0/oauth/access_token';
const FB_GRAPH_API = 'https://graph.facebook.com/v23.0';

// These should be set in your environment variables
const FB_CLIENT_ID = "798558289364023";
const FB_CLIENT_SECRET = "dba5b2c171816590a2ae3bcd3489fa9d";
const FB_REDIRECT_URI = process.env.FB_REDIRECT_URI;

/**
 * Generate Facebook OAuth authorization URL
 */
export function getFacebookAuthUrl(state = ''): string {
  const params = new URLSearchParams({
    client_id: FB_CLIENT_ID!,
    redirect_uri: FB_REDIRECT_URI!,
    response_type: 'code',
    scope: 'public_profile,email,instagram_basic,instagram_content_publish,pages_manage_posts,pages_show_list,pages_read_engagement,publish_to_groups',
    state
  });
  return `${FB_OAUTH_BASE}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForAccessToken(code: string): Promise<any> {
  const params = new URLSearchParams({
    client_id: FB_CLIENT_ID!,
    redirect_uri: FB_REDIRECT_URI!,
    client_secret: FB_CLIENT_SECRET!,
    code
  });
  const response = await axios.get(`${FB_TOKEN_URL}?${params.toString()}`);
  return response.data; // { access_token, token_type, expires_in }
}

/**
 * Refresh a Facebook long-lived access token
 */
export async function refreshFacebookAccessToken(longLivedToken: string): Promise<any> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: FB_CLIENT_ID!,
    client_secret: FB_CLIENT_SECRET!,
    fb_exchange_token: longLivedToken
  });
  const response = await axios.get(`${FB_TOKEN_URL}?${params.toString()}`);
  return response.data; // { access_token, token_type, expires_in }
}

/**
 * Get Facebook user profile info
 */
export async function getFacebookUserProfile(accessToken: string): Promise<any> {
  const response = await axios.get(`${FB_GRAPH_API}/me`, {
    params: { access_token: accessToken, fields: 'id,name,email' }
  });
  return response.data;
}

/**
 * Get Facebook pages managed by the user
 */
export async function getFacebookPages(accessToken: string): Promise<any> {
  const response = await axios.get(`${FB_GRAPH_API}/me/accounts`, {
    params: { access_token: accessToken }
  });
  return response.data; // { data: [ { id, name, access_token, ... } ] }
}

/**
 * Post to a Facebook Page using the Meta Graph API
 * @param pageId Facebook Page ID
 * @param pageAccessToken Page access token (not user token)
 * @param message The post message
 * @param link Optional link to include in the post
 */
export async function postToFacebookPage(pageId: string, pageAccessToken: string, message: string, link?: string, imageUrl?: string): Promise<any> {
  const params: any = { message, access_token: pageAccessToken };
  if (imageUrl) {
    const params = {
      url: imageUrl,
      caption: message,
      access_token: pageAccessToken,
    };
    const response = await axios.post(`${FB_GRAPH_API}/${pageId}/photos`, null, { params });
    return response.data; // { id: 'post_id' }
  }
  
  if (link) params.link = link;
  const response = await axios.post(`${FB_GRAPH_API}/${pageId}/feed`, null, { params });
  return response.data; // { id: 'post_id' }
}

/**
 * Get Instagram Business Accounts connected to Facebook Pages
 * @param pageAccessToken Facebook Page access token
 */
export async function getInstagramBusinessAccounts(pageAccessToken: string): Promise<any> {
  try {
    const response = await axios.get(`${FB_GRAPH_API}/me/accounts`, {
      params: { 
        access_token: pageAccessToken,
        fields: 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram business accounts:', error);
    throw error;
  }
}

/**
 * Post to Instagram using the Instagram Graph API
 * @param instagramBusinessAccountId Instagram Business Account ID
 * @param pageAccessToken Facebook Page access token (not user token)
 * @param caption The post caption
 * @param imageUrl URL of the image to post (must be publicly accessible)
 */
export async function postToInstagram(instagramBusinessAccountId: string, pageAccessToken: string, caption: string, imageUrl: string): Promise<any> {
  try {
    // Step 1: Create a container for the media
    const containerResponse = await axios.post(`${FB_GRAPH_API}/${instagramBusinessAccountId}/media`, null, {
      params: {
        access_token: pageAccessToken,
        image_url: imageUrl,
        caption: caption
      }
    });

    const containerId = containerResponse.data.id;

    // Step 2: Publish the container
    const publishResponse = await axios.post(`${FB_GRAPH_API}/${instagramBusinessAccountId}/media_publish`, null, {
      params: {
        access_token: pageAccessToken,
        creation_id: containerId
      }
    });

    return publishResponse.data;
  } catch (error) {
    console.error('Error posting to Instagram:', error);
    throw error;
  }
}

/**
 * Get Instagram media insights
 * @param mediaId Instagram media ID
 * @param pageAccessToken Facebook Page access token
 */
export async function getInstagramMediaInsights(mediaId: string, pageAccessToken: string): Promise<any> {
  try {
    const response = await axios.get(`${FB_GRAPH_API}/${mediaId}/insights`, {
      params: {
        access_token: pageAccessToken,
        metric: 'impressions,reach,engagement'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Instagram media insights:', error);
    throw error;
  }
}

export function exampleSocialMediaUtil() {
  // TODO: Implement utility logic
  return 'This is a social media utility function.';
} 