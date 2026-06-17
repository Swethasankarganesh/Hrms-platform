import { readFile, writeFile } from "node:fs/promises";
import * as cheerio from "cheerio";

async function migrate(inputPath: string, outputPath: string) {
  const html = await readFile(inputPath, "utf8");
  const $ = cheerio.load(html);
  $("script, style, nav").remove();

  const title = $("h1").first().text().trim() || "Imported policy";
  const paragraphs = $("main p, article p")
    .map((_, element) => $(element).text().trim())
    .get()
    .filter(Boolean);

  const mdx = `---\ntitle: ${JSON.stringify(title)}\nupdated: ${new Date().toISOString().slice(0, 10)}\n---\n\n${paragraphs.join("\n\n")}\n`;
  await writeFile(outputPath, mdx, "utf8");
}

const [, , input, output] = process.argv;
if (!input || !output) {
  throw new Error("Usage: pnpm migrate <input.html> <output.mdx>");
}

await migrate(input, output);
