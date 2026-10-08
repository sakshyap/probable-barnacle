import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'src/assets/images');
const backupDir = path.join(process.cwd(), 'src/assets/images/backup');

const heavyImages = [
  'sakshi_hero_portrait_1790060105063.jpg',
  'project_ai_video_studio_1790317956809.jpg',
  'project_arcade_game_1790317939580.jpg',
];

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function compressImage(filename) {
  const inputPath = path.join(imagesDir, filename);
  const backupPath = path.join(backupDir, filename);
  const outputPath = path.join(imagesDir, filename.replace('.jpg', '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`File not found: ${filename}`);
    return;
  }

  fs.copyFileSync(inputPath, backupPath);
  console.log(`Backed up: ${filename} -> backup/`);

  await sharp(inputPath)
    .webp({ quality: 85, effort: 6 })
    .toFile(outputPath);

  const originalSize = fs.statSync(inputPath).size;
  const compressedSize = fs.statSync(outputPath).size;
  const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

  console.log(`${filename}: ${(originalSize/1024).toFixed(0)}KB -> ${(compressedSize/1024).toFixed(0)}KB (${savings}% saved)`);
}

for (const img of heavyImages) {
  await compressImage(img);
}

console.log('\nCompression complete!');