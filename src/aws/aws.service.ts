import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { HelperService } from 'src/helper.service';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  UploadPartCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class AwsService {
  private awsS3: S3Client;
  private modifiedLink: string = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
  constructor(private helperService: HelperService) {
    this.awsS3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  /**
   * Upload file to aws bucket
   * @param type
   * @param file
   * @param path
   * @returns
   */
  async uploadToAWS(
    type: any,
    file: string,
    path: string,
    extensionOfFile?: string,
  ) {
    try {
      const contentType = {
        paperworks: {
          type: 'application',
          regex:
            /^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/,
        },
        paperwork_pdf: {
          type: 'application',
          regex: /^data:application\/pdf;base64,/,
        },
        child_profile: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        teacher_profile: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        parent_teacher_profile: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        product: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        qrcode: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        pdf: {
          type: 'application',
          regex: /^data:application\/pdf;base64,/,
        },
        chat_image: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        chat_video: {
          type: 'video',
          regex: /^data:video\/\w+;base64,/,
        },
        chat_audio: {
          type: 'audio',
          regex: /^data:audio\/\w+;base64,/,
        },
        reimbursment_pdf: {
          type: 'application',
          regex: /^data:application\/pdf;base64,/,
        },
        reimbursment_image: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        event_image: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        event_video: {
          type: 'video',
          regex: /^data:video\/\w+;base64,/,
        },
        onboarding_pdf: {
          type: 'application',
          regex: /^data:application\/pdf;base64,/,
        },
        log_event_image: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        log_event_video: {
          type: 'video',
          regex: /^data:video\/\w+;base64,/,
        },
        video: {
          type: 'video',
          regex: /^data:application\/octet-stream\/\w+;base64,/,
        },
        subject: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        log_event_type_image: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        lesson_plan: {
          type: 'application',
          regex: /^data:application\/pdf;base64,/,
        },
        class: {
          type: 'image',
          regex: /^data:image\/\w+;base64,/,
        },
        newsletter_pdf: {
          type: 'application',
          regex: /^data:application\/pdf;base64,/,
        },
        bulletin_board: {
          type: 'application',
          regex: /^data:application\/pdf;base64,/,
        },
      };

      const isProduction = process.env.NODE_ENV === 'prod';
      const parsedFile = this.helperService.isJson(file)
        ? JSON.parse(file)
        : file;

      const base64Data = Buffer.from(
        parsedFile.replace(contentType[type].regex, ''),
        'base64',
      );

      let extension = parsedFile.split(';')[0].split('/')[1];
      if (
        extension ==
        'vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        extension = 'docx';
      }
      if (extension === 'quicktime') {
        extension = 'mov';
      }
      if (extensionOfFile) {
        extension = extensionOfFile;
      }
      const filePath = path.toLowerCase();

      const uploadPath = `${type}${filePath === 'news' || filePath === 'blog' ? `/${filePath}` : ''}/${filePath}_${this.helperService.generateRandomString(5)}.${extension}`;
      const params: any = {
        Bucket: isProduction
          ? process.env.AWS_PROD_BUCKET
          : process.env.AWS_BUCKET,
        Key: uploadPath,
        Body: base64Data,
        ACL: 'public-read',
        ContentType: `${contentType[type].type}/${extension}`,
      };
      await this.awsS3.send(new PutObjectCommand(params));
      const modifiedLink = this.modifiedLink.concat(uploadPath);

      return {
        Location: modifiedLink,
        type,
      };
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  /**
   * Upload createRead stream file in aws
   * @param fileReadStream
   * @param path
   * @param mimetype
   * @returns
   */
  async uploadReadStreadToAws(
    fileReadStream: any,
    path: string,
    mimetype: string,
  ) {
    const isProduction = process.env.NODE_ENV === 'prod';
    const upload = new Upload({
      client: this.awsS3,
      params: {
        Bucket: isProduction
          ? process.env.AWS_PROD_BUCKET
          : process.env.AWS_BUCKET,
        Key: path,
        Body: fileReadStream,
        ACL: 'public-read',
        ContentType: mimetype,
      },
    });
    const { Location } = await upload.done();
    return {
      Location: Location,
    };
  }

  /**
   * Remove file from aws bucket
   * @param path
   */
  async removeFromBucket(path: string) {
    try {
      const url = this.helperService.splitURL(path);
      const isProduction = process.env.NODE_ENV === 'prod';
      await this.awsS3.send(
        new DeleteObjectCommand({
          Bucket: isProduction
            ? process.env.AWS_PROD_BUCKET
            : process.env.AWS_BUCKET,
          Key: url,
        }),
      );
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async initiateMultipartUpload(uploadPath: string) {
    try {
      const isProduction = process.env.NODE_ENV === 'prod';
      const params = {
        Bucket: isProduction
          ? process.env.AWS_PROD_BUCKET
          : process.env.AWS_BUCKET,
        Key: decodeURI(uploadPath),
        ACL: ObjectCannedACL.public_read,
      };
      const createCommand = new CreateMultipartUploadCommand(params);
      const { UploadId } = await this.awsS3.send(createCommand);
      return UploadId;
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async uploadVideoMultipart(
    awsFilePath: string,
    buffer: any,
    uploadId: string,
    partNumber: number,
  ) {
    try {
      const isProduction = process.env.NODE_ENV === 'prod';

      const partParams = {
        Bucket: isProduction
          ? process.env.AWS_PROD_BUCKET
          : process.env.AWS_BUCKET,
        Key: awsFilePath,
        PartNumber: partNumber + 1,
        UploadId: uploadId,
        Body: buffer,
        ACL: ObjectCannedACL.public_read,
      };
      const partCommand = new UploadPartCommand(partParams);
      const partPromise = await this.awsS3.send(partCommand);
      return partPromise;
    } catch (err) {
      console.error('Error uploading to S3:', err);
    }
  }

  async completeMultipartUpload(
    uploadedParts: any,
    awsFilePath: string,
    uploadId: string,
  ) {
    const isProduction = process.env.NODE_ENV === 'prod';
    const completeParams = {
      Bucket: isProduction
        ? process.env.AWS_PROD_BUCKET
        : process.env.AWS_BUCKET,
      Key: awsFilePath,
      MultipartUpload: {
        Parts: uploadedParts.map((part, index) => ({
          ETag: part.ETag,
          PartNumber: index + 1,
        })),
      },
      UploadId: uploadId,
      ACL: 'public-read',
    };
    const completeCommand = new CompleteMultipartUploadCommand(completeParams);
    const result = await this.awsS3.send(completeCommand);
    return result;
  }
}
