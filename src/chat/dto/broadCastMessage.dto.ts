export class BroadcastMessageDto {
  message: string;
  user_data: { student_id: number; user_id: number }[];
  temp_time: string;
}
