import sharp from "sharp";
import path from "path";

async function main() {
  const src = path.join(process.cwd(), "public", "icons", "icon-192x192.png");

  // App dir icon.png (replaces favicon.ico)
  await sharp(src)
    .resize(32, 32)
    .png()
    .toFile(path.join(process.cwd(), "app", "icon.png"));
  console.log("Generated app/icon.png");

  // Apple icon for link previews
  await sharp(src)
    .resize(180, 180)
    .png()
    .toFile(path.join(process.cwd(), "app", "apple-icon.png"));
  console.log("Generated app/apple-icon.png");

  // OG image (1200x630) for social sharing / link previews
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#EEEFE9"/>
    <g transform="translate(600, 240)">
      <path d="M0 80 C0 80, -130 -40, -65 -80 C-25 -105, 0 -65, 0 -40 C0 -65, 25 -105, 65 -80 C130 -40, 0 80, 0 80 Z" fill="#EF4444" opacity="0.9"/>
      <polyline points="-70,0 -35,0 -18,-50 0,35 18,-28 35,0 70,0" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="600" y="400" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="56" fill="#1D2939" text-anchor="middle">BP Reversal</text>
    <text x="600" y="455" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="28" fill="#667085" text-anchor="middle">Reverse high blood pressure naturally in 90 days</text>
    <rect x="340" y="490" width="120" height="32" rx="16" fill="#FEE2E2"/>
    <text x="400" y="512" font-family="Arial" font-size="14" font-weight="600" fill="#EF4444" text-anchor="middle">Vascular</text>
    <rect x="480" y="490" width="110" height="32" rx="16" fill="#DBEAFE"/>
    <text x="535" y="512" font-family="Arial" font-size="14" font-weight="600" fill="#3B82F6" text-anchor="middle">Nervous</text>
    <rect x="610" y="490" width="90" height="32" rx="16" fill="#D1FAE5"/>
    <text x="655" y="512" font-family="Arial" font-size="14" font-weight="600" fill="#22C55E" text-anchor="middle">Blood</text>
    <rect x="720" y="490" width="100" height="32" rx="16" fill="#F3E8FF"/>
    <text x="770" y="512" font-family="Arial" font-size="14" font-weight="600" fill="#A855F7" text-anchor="middle">Kidney</text>
    <text x="600" y="580" font-family="Arial" font-size="18" fill="#667085" text-anchor="middle">Free forever. Science-backed. 21 daily habits.</text>
  </svg>`;

  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(path.join(process.cwd(), "public", "og-image.png"));
  console.log("Generated public/og-image.png");
}

main().catch(console.error);
