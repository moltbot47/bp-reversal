import sharp from "sharp";
import path from "path";

const SIZES = [192, 512];

// Heart icon with BP pulse line — warm parchment background
function generateSVG(size: number): string {
  const padding = Math.round(size * 0.15);
  const heartSize = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;
  const s = heartSize / 100; // scale factor

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#EEEFE9"/>

    <!-- Heart shape -->
    <g transform="translate(${cx}, ${cy + s * 5}) scale(${s})">
      <path d="M0 30 C0 30, -50 -15, -25 -30 C-10 -40, 0 -25, 0 -15 C0 -25, 10 -40, 25 -30 C50 -15, 0 30, 0 30 Z"
        fill="#EF4444" opacity="0.9"/>
    </g>

    <!-- Pulse line across the heart -->
    <g transform="translate(${cx}, ${cy + s * 2})">
      <polyline
        points="${-s * 30},0 ${-s * 15},0 ${-s * 8},${-s * 18} ${0},${s * 12} ${s * 8},${-s * 10} ${s * 15},0 ${s * 30},0"
        fill="none"
        stroke="white"
        stroke-width="${Math.max(3, s * 4)}"
        stroke-linecap="round"
        stroke-linejoin="round"/>
    </g>

    <!-- BP text at bottom -->
    <text x="${cx}" y="${size - padding * 0.6}"
      font-family="Arial, Helvetica, sans-serif"
      font-weight="800"
      font-size="${Math.round(s * 16)}"
      fill="#1D2939"
      text-anchor="middle"
      opacity="0.7">BP</text>
  </svg>`;
}

async function main() {
  for (const size of SIZES) {
    const svg = generateSVG(size);
    const outputPath = path.join(
      process.cwd(),
      "public",
      "icons",
      `icon-${size}x${size}.png`
    );
    await sharp(Buffer.from(svg)).png().toFile(outputPath);
    console.log(`Generated ${outputPath}`);
  }

  // Also generate apple-touch-icon at 180x180
  const appleSvg = generateSVG(180);
  const applePath = path.join(process.cwd(), "public", "apple-touch-icon.png");
  await sharp(Buffer.from(appleSvg)).png().toFile(applePath);
  console.log(`Generated ${applePath}`);

  // Generate favicon at 32x32
  const faviconSvg = generateSVG(32);
  const faviconPath = path.join(process.cwd(), "public", "favicon.png");
  await sharp(Buffer.from(faviconSvg)).png().toFile(faviconPath);
  console.log(`Generated ${faviconPath}`);
}

main().catch(console.error);
