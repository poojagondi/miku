import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const stickersDirectory = path.join(process.cwd(), "public", "stickers");

    // Check if stickers directory exists
    try {
      await fs.access(stickersDirectory);
    } catch {
      // If directory doesn't exist, return empty array
      return NextResponse.json({ success: true, stickers: [] });
    }

    // Read all files from the stickers directory
    const files = await fs.readdir(stickersDirectory);

    // Filter for PNG files and create sticker objects
    const stickers = files
      .filter((file) => file.toLowerCase().endsWith(".png"))
      .sort((a, b) => {
        // Custom sort to handle Frame numbers properly
        const frameRegex = /Frame (\d+)\.png/i;
        const aMatch = a.match(frameRegex);
        const bMatch = b.match(frameRegex);

        if (aMatch && bMatch) {
          // Both are frame files, sort by frame number
          return parseInt(aMatch[1]) - parseInt(bMatch[1]);
        } else if (aMatch && !bMatch) {
          // a is frame, b is not - frames come last
          return 1;
        } else if (!aMatch && bMatch) {
          // b is frame, a is not - non-frames come first
          return -1;
        } else {
          // Neither are frames, sort alphabetically
          return a.localeCompare(b);
        }
      })
      .map((file) => {
        const name = path.parse(file).name;
        return {
          src: `/stickers/${file}`,
          alt: `${name} sticker`,
          name:
            name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, " "),
        };
      });

    return NextResponse.json({ success: true, stickers });
  } catch (error) {
    console.error("Error reading stickers directory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load stickers" },
      { status: 500 }
    );
  }
}
