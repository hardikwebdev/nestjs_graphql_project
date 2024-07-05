import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';
import * as QrCode from 'qrcode';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
@Injectable()
export class HelperService {
  constructor() {}

  isJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate random string with given length
   * @param length
   * @returns
   */
  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  /**
   * split url
   * @param value
   * @returns
   */
  splitURL(value: string): string {
    const URLsplit = value.split('/');
    const host = `${URLsplit[0]}//${URLsplit[2]}/`;
    const newURL = value.replace(host, '');
    return newURL;
  }

  /**
   * Check provided string is base64 or not
   * @param str
   * @returns
   */
  isBase64(str: string) {
    try {
      // Extract the MIME type from the base64 string
      const mime = str.split(',')[0].match(/:(.*?);/)[1];

      // Check if it's an image
      if (mime.startsWith('image/')) {
        return {
          type: 'image',
        };
      }

      // Check if it's a video
      if (mime.startsWith('video/')) {
        return {
          type: 'video',
        };
      }

      // Check if it's a PDF
      if (mime.startsWith('application/pdf')) {
        return {
          type: 'pdf',
        };
      }

      // Check if it's a audio
      if (mime.startsWith('audio/')) {
        return {
          type: 'audio',
        };
      }

      //check if it's a docx
      if (
        mime ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        return {
          type: 'application',
        };
      }

      // Not an image or video
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Ensure this is https or add https
   * @param link
   * @returns
   */
  ensureHttps(link: string) {
    // Check if the link starts with "https://"
    if (!link.startsWith('https://')) {
      // If not, append "https://" to the beginning of the link
      link = 'https://' + link;
    }
    return link;
  }

  /**
   * Password Hashing
   * @param password
   * @returns
   */
  passwordHash(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
  }

  /**
   * Generate Random Password
   * @returns
   */
  generateRandomPassword(): string {
    const password = generator.generate({
      length: 12,
      lowercase: true,
      numbers: true,
      uppercase: true,
      symbols: true,
      excludeSimilarCharacters: true,
    });

    return password;
  }

  /**
   * Generate QR Code
   * @param data
   * @param size
   * @returns
   */
  async generateQrCode(data: object, size: number = 200): Promise<string> {
    const options: QrCode.QRCodeRenderersOptions = {
      width: size,
    };
    return await QrCode.toDataURL(JSON.stringify(data), options);
  }

  generateOTP(): string {
    let otp = '';

    otp += Math.floor(Math.random() * 9) + 1;

    for (let i = 1; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    return otp;
  }

  /**
   * Generate video thumbnail
   * @param videoPath
   * @param folderPath
   * @param fileName
   * @returns
   */
  async generateThumbnailFromVideo(
    videoPath: string,
    folderPath: string,
    fileName: string,
  ) {
    try {
      await new Promise((resolve) => {
        ffmpeg(videoPath)
          .on('end', () => resolve(''))
          .on('error', (err) => {
            throw err;
          })
          .screenshots({
            count: 1,
            folder: folderPath,
            filename: fileName,
            size: '640x480', // Set the desired thumbnail size
          });
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * delete file
   * @param filePath
   * @returns
   */
  deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get video duration
   * @param link
   * @returns
   */
  async getVideoDuration(link: any) {
    const durationInSeconds = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(link, (err: any, metadata: any) => {
        if (!err) {
          // resolve(metadata.format.duration.toFixed(2));
          const totalSeconds = metadata.format.duration;
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = Math.floor(totalSeconds % 60);

          const formattedDuration = `${minutes}:${seconds
            .toString()
            .padStart(2, '0')}`;
          resolve(formattedDuration);
        } else {
          console.error('Error retrieving video duration:', err);
          reject(0);
        }
      });
    });
    return durationInSeconds;
  }

  fileExists(filePath: string) {
    // Check if the file exists
    return fs.existsSync(filePath);
  }

  async convert12hrTo24hr(timeOf12Hr: string) {
    // Split the time string into hours, minutes, and AM/PM
    const timeParts = timeOf12Hr.split(' ');
    const time = timeParts[0].split(':');
    let hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);
    const amPm = timeParts[1].toUpperCase();

    if (amPm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (amPm === 'AM' && hours === 12) {
      hours = 0;
    }

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');

    return hoursStr + ':' + minutesStr + ':00';
  }
}
