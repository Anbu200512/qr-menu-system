import sharp from "sharp"
import fs from "fs"

export const optimizeImage = async (
  inputPath,
  outputPath
) => {
  await sharp(inputPath)
    .resize({
      width: 800,
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
    })
    .toFile(outputPath)

  fs.unlinkSync(inputPath)
}