import { readFile } from "fs/promises";
import { join } from "path";

export async function readAppContentMdx(locale: string, fileName: string): Promise<string> {
  const localizedFilePath = join(process.cwd(), "app", "content", locale, fileName);
  try {
    return await readFile(localizedFilePath, "utf-8");
  } catch {
    const defaultFilePath = join(process.cwd(), "app", "content", fileName);
    return readFile(defaultFilePath, "utf-8");
  }
}
