import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { VideoStreaming } from 'src/database/entities/video_streaming.entity';
import { IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { ListVideoStreamingInput } from './dto/listVideoStreaming.input';
import { GraphQLError } from 'graphql';
import { STATUS } from 'src/constants';
import { CreateVideoStreamingInput } from './dto/createVideoStreaming.input';
import * as md5 from 'md5';
import * as fs from 'fs';
import * as path from 'path';
import { AwsService } from 'src/aws/aws.service';
import { HelperService } from 'src/helper.service';

@Injectable()
export class VideoStreamingService {
  private uploadData = {};
  constructor(
    @Inject('VIDEO_STREAMING_REPOSITORY')
    private readonly videoStramingRepository: Repository<VideoStreaming>,
    private readonly awsService: AwsService,
    private readonly helperService: HelperService,
  ) {}

  /**
   * get all videos
   * @returns
   */
  async getAllVideos(listVideoStreamingInput: ListVideoStreamingInput) {
    const { page, pageSize, search, status } = listVideoStreamingInput;
    const skip = (page - 1) * pageSize;
    const queryBuilder: SelectQueryBuilder<VideoStreaming> =
      this.videoStramingRepository
        .createQueryBuilder('video_streaming')
        .skip(skip)
        .take(pageSize)
        .orderBy(`video_streaming.sequence_id`, 'ASC')
        .select(['video_streaming']);
    if (search) {
      queryBuilder.where(
        '(video_streaming.title LIKE :search OR video_streaming.description LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }
    if (status === STATUS.ACTIVE || status === STATUS.INACTIVE) {
      queryBuilder.where('(video_streaming.status = :status)', {
        status,
      });
    }
    const [videos, total] = await queryBuilder.getManyAndCount();
    return { videos, total };
  }

  /**
   * create streaming video
   * @returns
   */
  async createVideoForStreaming() {
    const [videos, total] = await this.videoStramingRepository.findAndCount();
    return { videos, total };
  }

  /**
   * Get video streaming by findData
   * @param whereOption
   * @returns
   */
  async getVideoByData(whereOption: Partial<VideoStreaming>) {
    const video = await this.videoStramingRepository.findOne({
      where: whereOption,
    });
    if (!video) {
      throw new GraphQLError('Video not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return video;
  }

  async saveVideoInChunk(
    createVideoStreamingInput: CreateVideoStreamingInput,
    ip: any,
  ) {
    const {
      chunk_video,
      current_chunk,
      description,
      title,
      total_chunks,
      file_name,
      upload_id,
      upload_path,
      file_size,
    } = createVideoStreamingInput;
    console.log('upload_id', upload_id);
    console.log('upload_path', upload_path);
    const totalVideoSize = file_size / (1024 * 1024);
    const firstChunk = Number(current_chunk) === 0;
    const lastChunk = Number(current_chunk) === Number(total_chunks) - 1;
    const ext = file_name.split('.').pop();
    let video_thumbnail = null;
    let duration = null;
    let sequence_id = 1;
    const url_data = [];

    if (firstChunk && totalVideoSize <= 5) {
      console.log(' inside of less mb video', 'location');

      const data = await this.awsService.uploadToAWS(
        'video',
        chunk_video,
        'video',
        ext,
      );
      console.log(data.Location, 'location');
      return { message: data.Location };
    }

    const dest = path.join(process.cwd(), 'uploads/');
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const data = chunk_video?.split(',')[1];
    let multipartUploadId = upload_id;
    let uploadPath = upload_path;
    if (firstChunk) {
      uploadPath = `video/video_${this.helperService.generateRandomString(5)}.${ext}`;
      multipartUploadId =
        await this.awsService.initiateMultipartUpload(uploadPath);
    }
    console.log(multipartUploadId, 'This is multipart id');
    const buffer = Buffer.from(data, 'base64');
    const tmpFilename = 'tmp_' + md5(file_name + ip) + '.' + ext;
    if (firstChunk && fs.existsSync(dest + tmpFilename)) {
      fs.unlinkSync(dest + tmpFilename);
    }
    fs.appendFileSync(dest + tmpFilename, buffer);
    const uploadArray = this.uploadData[upload_id];
    const uploadVideoMultipart = await this.awsService.uploadVideoMultipart(
      decodeURIComponent(uploadPath),
      buffer,
      multipartUploadId,
      current_chunk,
    );
    console.log(uploadVideoMultipart, 'This is upload data');

    if (uploadArray === undefined && uploadVideoMultipart !== undefined) {
      this.uploadData[multipartUploadId] = [uploadVideoMultipart];
    } else if (uploadVideoMultipart !== undefined) {
      this.uploadData[multipartUploadId] = [
        ...uploadArray,
        uploadVideoMultipart,
      ];
    }
    if (lastChunk) {
      console.log(this.uploadData[upload_id]);
      const finalFilename = `file_name-${Date.now()}.` + ext;
      fs.renameSync(dest + tmpFilename, dest + finalFilename);
      const data = await this.awsService.completeMultipartUpload(
        this.uploadData[upload_id],
        uploadPath,
        multipartUploadId,
      );
      console.log('This is required data', data.Location);

      const thumbnailFileName = `videoThumbnail_${this.helperService.generateRandomString(
        5,
      )}.png`;

      // Generating the video thumbnail
      const time = performance.now();
      await this.helperService.generateThumbnailFromVideo(
        data.Location,
        path.join(process.cwd(), process.env.THUMBNAIL_PATH),
        thumbnailFileName,
      );
      console.log(performance.now() - time);

      const filePath = path.join(
        process.cwd(),
        process.env.THUMBNAIL_PATH,
        `/${thumbnailFileName}`,
      );

      const time1 = performance.now();
      const thumbnailCreated = this.helperService.fileExists(filePath);
      if (thumbnailCreated) {
        const fileReadStream = fs.createReadStream(filePath);
        // Uploading thumbnail to AWS
        const thumbnailImage = await this.awsService.uploadReadStreadToAws(
          fileReadStream,
          `video_thumbnail/${thumbnailFileName}`,
          'image/png',
        );
        video_thumbnail = thumbnailImage.Location;
        await this.helperService.deleteFile(filePath);
      }
      console.log(performance.now() - time1);

      const time2 = performance.now();
      duration = await this.helperService.getVideoDuration(data.Location);
      console.log(performance.now() - time2);

      url_data.push({
        url: data.Location,
        duration,
        video_thumbnail,
      });

      const isLastVideoCreated = await this.videoStramingRepository.findOne({
        where: { deletedAt: IsNull() },
        order: { id: 'DESC' },
      });

      if (isLastVideoCreated) {
        sequence_id = isLastVideoCreated.sequence_id + 1;
      }

      await this.videoStramingRepository.save({
        title,
        description,
        url_data,
        sequence_id,
      });

      return { message: finalFilename };
    }
    return {
      // message: 'OK',
      upload_id: multipartUploadId,
      upload_path: uploadPath,
    };
  }
}
