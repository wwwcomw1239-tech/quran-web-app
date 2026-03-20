#!/usr/bin/env bun
/**
 * R2 Infrastructure Initialization Script for Noor Al-Quran Shorts
 * 
 * This script:
 * 1. Creates the R2 bucket (noor-quran-shorts)
 * 2. Downloads real Quranic videos from Archive.org
 * 3. Uploads them to R2
 * 4. Creates a manifest.json for the frontend
 * 
 * PREREQUISITE: R2 must be enabled in Cloudflare Dashboard!
 * Go to: https://dash.cloudflare.com → R2 → Enable R2
 * 
 * Usage:
 *   bun run scripts/init-r2.ts
 */

import { S3Client, CreateBucketCommand, PutObjectCommand, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3';

// Configuration
const CLOUDFLARE_ACCOUNT_ID = '4ae9c5795f5f019bb43228d3b9e077d8';
const BUCKET_NAME = 'noor-quran-shorts';

// R2 API Credentials (need to be created in Cloudflare Dashboard)
// Go to: R2 → Manage R2 API Tokens → Create API token
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';

// R2 S3-compatible endpoint
const R2_ENDPOINT = `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// Public R2.dev URL (configured after bucket creation)
const R2_PUBLIC_URL = `https://pub-${CLOUDFLARE_ACCOUNT_ID}.r2.dev`;

// Real Quranic videos from Archive.org (Sheikh Abdul Basit Abdul Samad)
const QURAN_VIDEOS = [
  {
    filename: 'surah_al_anbiya_abdul_basit.mp4',
    title: 'سورة الأنبياء - تلاوة خاشعة',
    author: 'الشيخ عبدالباسط عبدالصمد',
    sourceUrl: 'https://archive.org/download/a0251204aaaaaaaaaaa/%C2%AB%20%D8%A3%D9%8E%D8%A5%D9%8B%D9%84%D9%8E%D9%B0%D9%87%D9%8C%20%D9%85%D9%8E%D9%91%D8%B9%D9%8E%20%D8%A7%D9%84%D9%84%D9%8E%D9%91%D9%87%D9%8B%20%C2%BB%20%D8%AA%D9%84%D8%A7%D9%88%D8%A9%20%D8%AE%D8%A7%D8%B4%D8%B9%D8%A9%20%D8%AC%D8%AF%D8%A7%D9%8B%20%D8%A8%D8%B5%D9%88%D8%AA%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B5%D9%85%D8%AF.mp4',
    duration: 60,
    type: 'quran' as const,
  },
  {
    filename: 'alam_najal_lahu_ainayn_abdul_basit.mp4',
    title: 'ألم نجعل له عينين - مرئيات',
    author: 'الشيخ عبدالباسط عبدالصمد',
    sourceUrl: 'https://archive.org/download/a0251204aaaaaaaaaaa/%C2%AB%20%D8%A3%D9%8E%D9%84%D9%8E%D9%85%D9%92%20%D9%86%D9%8E%D8%AC%D9%8E%D8%B9%D9%8E%D9%84%D9%92%20%D9%84%D9%8E%D9%87%D9%8F%20%D8%B9%D9%8E%D9%8A%D9%92%D9%86%D9%8E%D9%8A%D9%92%D9%86%D9%8E%20%D9%88%D9%8E%D9%84%D9%90%D8%B3%D9%8E%D8%A7%D9%86%D9%8B%D8%A7%20%D9%88%D9%8E%D8%B4%D9%8E%D9%81%D9%8E%D8%AA%D9%8E%D9%8A%D9%92%D9%86%D9%8E%20%C2%BB%20%D9%85%D9%86%20%D8%A3%D8%AC%D9%85%D9%84%20%D9%85%D8%B1%D8%A6%D9%8A%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B5%D9%85%D8%AF.mp4',
    duration: 60,
    type: 'quran' as const,
  },
];

interface VideoInfo {
  id: string;
  filename: string;
  title: string;
  author: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number;
  type: 'quran' | 'sermon';
}

// Initialize S3 client for R2
function createS3Client(): S3Client | null {
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error('❌ R2 credentials not found!');
    console.log('\n📋 To create R2 API credentials:');
    console.log('   1. Go to: https://dash.cloudflare.com');
    console.log('   2. Navigate to: R2 → Manage R2 API Tokens');
    console.log('   3. Click: Create API token');
    console.log('   4. Select: Object Read & Write permissions');
    console.log('   5. Set environment variables:');
    console.log('      export R2_ACCESS_KEY_ID=your_access_key');
    console.log('      export R2_SECRET_ACCESS_KEY=your_secret_key');
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

// Check if bucket exists
async function bucketExists(client: S3Client, bucketName: string): Promise<boolean> {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch {
    return false;
  }
}

// Create bucket
async function createBucket(client: S3Client, bucketName: string): Promise<boolean> {
  console.log(`🪣 Creating bucket '${bucketName}'...`);
  
  try {
    await client.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`✅ Bucket '${bucketName}' created successfully!`);
    return true;
  } catch (error: any) {
    if (error.name === 'BucketAlreadyExists' || error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`✅ Bucket '${bucketName}' already exists.`);
      return true;
    }
    console.error('❌ Failed to create bucket:', error.message);
    return false;
  }
}

// Download video from URL
async function downloadVideo(url: string): Promise<Buffer | null> {
  console.log(`📥 Downloading from: ${url.substring(0, 60)}...`);
  
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(120000), // 2 minute timeout
    });

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log(`✅ Downloaded ${Math.round(arrayBuffer.byteLength / 1024 / 1024)}MB`);
    return Buffer.from(arrayBuffer);
  } catch (error: any) {
    console.error('❌ Download failed:', error.message);
    return null;
  }
}

// Upload video to R2
async function uploadVideo(
  client: S3Client,
  bucketName: string,
  filename: string,
  content: Buffer
): Promise<boolean> {
  console.log(`📤 Uploading '${filename}' to R2...`);
  
  try {
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: content,
      ContentType: 'video/mp4',
      Metadata: {
        'uploaded-by': 'noor-quran-app',
        'upload-date': new Date().toISOString(),
      },
    }));
    console.log(`✅ Uploaded '${filename}' successfully!`);
    return true;
  } catch (error: any) {
    console.error('❌ Upload failed:', error.message);
    return false;
  }
}

// Upload manifest.json to R2
async function uploadManifest(client: S3Client, bucketName: string, videos: VideoInfo[]): Promise<boolean> {
  console.log('📄 Creating manifest.json...');
  
  const manifest = {
    generated: new Date().toISOString(),
    videos: videos,
  };

  try {
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: 'manifest.json',
      Body: JSON.stringify(manifest, null, 2),
      ContentType: 'application/json',
      CacheControl: 'public, max-age=3600',
    }));
    console.log('✅ manifest.json uploaded!');
    return true;
  } catch (error: any) {
    console.error('❌ Manifest upload failed:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 R2 Infrastructure Initialization for Noor Al-Quran\n');
  console.log('=' .repeat(60));
  
  // Check credentials
  const client = createS3Client();
  if (!client) {
    process.exit(1);
  }

  // Step 1: Create bucket
  console.log('\n📦 Step 1: Setting up bucket...');
  const exists = await bucketExists(client, BUCKET_NAME);
  
  if (!exists) {
    const created = await createBucket(client, BUCKET_NAME);
    if (!created) {
      console.log('\n⚠️  Please enable R2 in the Cloudflare Dashboard first:');
      console.log('   https://dash.cloudflare.com → R2 → Enable R2\n');
      process.exit(1);
    }
  }

  // Step 2: Download and upload videos
  console.log('\n📥 Step 2: Processing Quranic videos...');
  const uploadedVideos: VideoInfo[] = [];

  for (const video of QURAN_VIDEOS) {
    console.log(`\n--- Processing: ${video.title} ---`);
    
    // Download
    const content = await downloadVideo(video.sourceUrl);
    if (!content) {
      console.log(`⚠️  Skipping ${video.filename} due to download error`);
      continue;
    }

    // Upload
    const uploaded = await uploadVideo(client, BUCKET_NAME, video.filename, content);
    if (uploaded) {
      uploadedVideos.push({
        id: video.filename.replace('.mp4', ''),
        filename: video.filename,
        title: video.title,
        author: video.author,
        videoUrl: `${R2_PUBLIC_URL}/${video.filename}`,
        thumbnail: '/icons/icon-512x512.png',
        duration: video.duration,
        type: video.type,
      });
    }
  }

  // Step 3: Create manifest
  if (uploadedVideos.length > 0) {
    console.log('\n📄 Step 3: Creating manifest...');
    await uploadManifest(client, BUCKET_NAME, uploadedVideos);
  }

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('✅ R2 Setup Complete!\n');
  console.log(`📦 Bucket: ${BUCKET_NAME}`);
  console.log(`🌐 Public URL: ${R2_PUBLIC_URL}`);
  console.log(`📹 Videos uploaded: ${uploadedVideos.length}`);
  console.log('\n📋 Next steps:');
  console.log('   1. Enable public access in R2 bucket settings');
  console.log('   2. Configure custom domain (optional)');
  console.log('   3. Frontend will auto-fetch from manifest.json\n');
}

main().catch(console.error);
