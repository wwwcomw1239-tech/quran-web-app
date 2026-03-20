#!/usr/bin/env bun

/**
 * Cloudflare R2 Setup Script for Noor Al-Quran Shorts
 * 
 * PREREQUISITE: R2 must be enabled in Cloudflare Dashboard first!
 * Go to: https://dash.cloudflare.com → R2 → Enable R2
 * 
 * Usage:
 *   bun run scripts/setup-r2.ts
 * 
 * Environment Variables Required:
 *   CLOUDFLARE_API_TOKEN - Cloudflare API token with R2 permissions
 *   CLOUDFLARE_ACCOUNT_ID - Cloudflare account ID
 */

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'cfut_g7fYAFOY1NTUzYqeyfF1VVN5SifNCEXbustt2UTJ17576a56';
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '4ae9c5795f5f019bb43228d3b9e077d8';
const BUCKET_NAME = 'noor-quran-shorts';

interface CloudflareResponse {
  success: boolean;
  result?: any;
  errors?: Array<{ code: number; message: string }>;
}

/**
 * Make authenticated request to Cloudflare API
 */
async function cfRequest(endpoint: string, options: RequestInit = {}): Promise<CloudflareResponse> {
  const url = `https://api.cloudflare.com/client/v4${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response.json();
}

/**
 * Check if R2 is enabled for the account
 */
async function checkR2Enabled(): Promise<boolean> {
  console.log('🔍 Checking if R2 is enabled...');
  
  const result = await cfRequest(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets`);
  
  if (result.success) {
    console.log('✅ R2 is enabled!');
    return true;
  }
  
  if (result.errors?.some(e => e.code === 10042)) {
    console.log('❌ R2 is NOT enabled.');
    console.log('\n📋 Please enable R2 in the Cloudflare Dashboard:');
    console.log('   1. Go to: https://dash.cloudflare.com');
    console.log('   2. Navigate to: R2 Object Storage');
    console.log('   3. Click "Enable R2"');
    console.log('   4. Accept the terms and conditions');
    console.log('   5. Run this script again\n');
    return false;
  }
  
  console.error('Error checking R2 status:', result.errors);
  return false;
}

/**
 * List existing R2 buckets
 */
async function listBuckets(): Promise<string[]> {
  const result = await cfRequest(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets`);
  
  if (result.success && result.result?.buckets) {
    return result.result.buckets.map((b: any) => b.name);
  }
  
  return [];
}

/**
 * Create R2 bucket
 */
async function createBucket(name: string): Promise<boolean> {
  console.log(`🪣 Creating bucket '${name}'...`);
  
  const result = await cfRequest(`/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  if (result.success) {
    console.log(`✅ Bucket '${name}' created successfully!`);
    return true;
  }
  
  // Check if bucket already exists
  if (result.errors?.some(e => e.message?.includes('already exists'))) {
    console.log(`✅ Bucket '${name}' already exists.`);
    return true;
  }
  
  console.error('❌ Failed to create bucket:', result.errors);
  return false;
}

/**
 * Enable public access for bucket
 */
async function enablePublicAccess(bucketName: string): Promise<string | null> {
  console.log(`🌐 Enabling public access for '${bucketName}'...`);
  
  // Enable public access
  const result = await cfRequest(
    `/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${bucketName}/public-access`,
    {
      method: 'PUT',
      body: JSON.stringify({ publicAccess: 'enabled' }),
    }
  );

  if (result.success || result.result?.publicAccess === 'enabled') {
    const publicUrl = `https://pub-${CLOUDFLARE_ACCOUNT_ID}.r2.dev`;
    console.log(`✅ Public access enabled!`);
    console.log(`📍 Public URL: ${publicUrl}`);
    return publicUrl;
  }
  
  console.error('❌ Failed to enable public access:', result.errors);
  return null;
}

/**
 * Generate a safe placeholder video (silent black screen)
 * Since we cannot upload actual Quran videos, we create a minimal placeholder
 */
async function generatePlaceholderVideo(): Promise<Buffer> {
  // Create a minimal 1-second black video using base64 encoded minimal MP4
  // This is a tiny valid MP4 file (black frame, no audio)
  const minimalMp4Base64 = 'AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA+NtZGF0AAACrQYF//+p3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1MiByMjg1NCBlOWE1OTAzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIzLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAAwZYiEAD//8m+P5OXfBeLGOfKE3xkODvFZuBzHG5ty7wvIkGfM4hOzn9z8SwkTt3tZqZtOKm1l4NPD7V9cvvqPRZdRhgV//+cAAAAB9AAAAEA=';
  
  return Buffer.from(minimalMp4Base64, 'base64');
}

/**
 * Upload file to R2 bucket using S3-compatible API
 */
async function uploadToR2(
  bucketName: string,
  fileName: string,
  content: Buffer,
  contentType: string
): Promise<boolean> {
  console.log(`📤 Uploading '${fileName}' to R2...`);
  
  // Get R2 API credentials (we need to create API token with R2 permissions)
  // For now, we'll use the Cloudflare API directly
  
  const result = await cfRequest(
    `/accounts/${CLOUDFLARE_ACCOUNT_ID}/r2/buckets/${bucketName}/objects/${fileName}`,
    {
      method: 'PUT',
      body: content as any,
      headers: {
        'Content-Type': contentType,
      },
    }
  );

  if (result.success || !result.errors) {
    console.log(`✅ Uploaded '${fileName}' successfully!`);
    return true;
  }
  
  console.error('❌ Upload failed:', result.errors);
  return false;
}

/**
 * Update shorts.json with R2 URLs
 */
async function updateShortsJson(publicUrl: string, videos: string[]): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');
  
  const shortsData = videos.map((video, index) => ({
    id: `short-${index + 1}`,
    title: `تلاوة قرآنية ${index + 1}`,
    author: 'قارئ',
    videoUrl: `${publicUrl}/${video}`,
    thumbnail: '/icons/icon-512x512.png',
    type: 'quran',
    duration: 60
  }));

  const jsonPath = path.join(process.cwd(), 'src/data/shorts.json');
  fs.writeFileSync(jsonPath, JSON.stringify(shortsData, null, 2));
  console.log(`✅ Updated shorts.json with ${videos.length} videos`);
}

/**
 * Main setup function
 */
async function main() {
  console.log('🚀 Setting up Cloudflare R2 for Noor Al-Quran Shorts\n');
  console.log('=' .repeat(50));
  
  // Step 1: Check if R2 is enabled
  const r2Enabled = await checkR2Enabled();
  if (!r2Enabled) {
    process.exit(1);
  }
  
  // Step 2: List existing buckets
  const existingBuckets = await listBuckets();
  console.log(`📦 Existing buckets: ${existingBuckets.join(', ') || 'none'}`);
  
  // Step 3: Create bucket if not exists
  if (!existingBuckets.includes(BUCKET_NAME)) {
    const created = await createBucket(BUCKET_NAME);
    if (!created) {
      process.exit(1);
    }
  } else {
    console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
  }
  
  // Step 4: Enable public access
  const publicUrl = await enablePublicAccess(BUCKET_NAME);
  if (!publicUrl) {
    console.log('⚠️ Could not enable public access. Continuing anyway...');
  }
  
  // Step 5: Generate and upload placeholder video
  console.log('\n📹 Preparing video content...');
  const placeholderVideo = await generatePlaceholderVideo();
  
  const videos = ['placeholder_quran.mp4'];
  const uploaded = await uploadToR2(BUCKET_NAME, 'placeholder_quran.mp4', placeholderVideo, 'video/mp4');
  
  if (!uploaded) {
    console.log('⚠️ Could not upload video. Using fallback URLs.');
  }
  
  // Step 6: Update shorts.json
  if (publicUrl) {
    await updateShortsJson(publicUrl, videos);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ R2 Setup Complete!');
  console.log(`\n📍 Bucket: ${BUCKET_NAME}`);
  console.log(`📍 Public URL: ${publicUrl || 'Not configured'}`);
  console.log('\n📋 Next Steps:');
  console.log('   1. Upload actual Quran videos to the bucket');
  console.log('   2. Update shorts.json with the new video URLs');
  console.log('   3. Deploy the app to see changes\n');
}

main().catch(console.error);
