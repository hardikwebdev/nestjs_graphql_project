export class CreateMessageDto {
  sender_id: number;
  receiver_id: number;
  student_id: number;
  message: string;
  chat_room_id: number;
  message_type: any;
}
