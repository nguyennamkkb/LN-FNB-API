import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { Common } from 'helper/common/common';
import * as sharp from 'sharp';


@Injectable()
export class ImageUtil {
  static async saveImage(base64Data: string): Promise<string> {
    const matches = base64Data.match(/^data:image\/([a-z]+);base64,(.+)$/i);

    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 format');
    }

    const fileExtension = matches[1];
    const base64Image = matches[2];
    const fileName = `${Common.makeRandomStringWithLength(10)+Date.now()}`;
    const filePath = `upload/${fileName}.jpeg`;

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64Image, 'base64');

    // Compress the image
    const compressedImageBuffer = await sharp(fileBuffer)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();

    // Write the compressed image buffer to file
    await fs.writeFile(filePath, compressedImageBuffer);
    return fileName;
  }

  static async saveImageWithName(base64Data: string, name: string): Promise<string> {
    const matches = base64Data.match(/^data:image\/([a-z]+);base64,(.+)$/i);

    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 format');
    }
    
    const fileExtension = matches[1];
    const base64Image = matches[2];
    const fileName = `${name}`;
    const filePath = `upload/${fileName}.jpeg`;

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64Image, 'base64');

    // Compress the image
    const compressedImageBuffer = await sharp(fileBuffer)
      .resize({ width: 400, withoutEnlargement: true })
      .jpeg({ quality: 5 })
      .toBuffer();

    // Write the compressed image buffer to file
    await fs.writeFile(filePath, compressedImageBuffer);
    return fileName;
  }

  static async deleteImage(fileName: string): Promise<boolean> {
    var res: boolean = false
    try {
      console.log("name:"+fileName);
      const filePath = `upload/${fileName}.jpeg`;
      fs.unlinkSync(filePath);
      res = true
      console.log("Delete File successfully.");
      return res;
    } catch (error) {
      console.log(error);
    }
    return res;
  }

}
