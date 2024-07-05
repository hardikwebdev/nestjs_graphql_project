import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatSessionManager {
  private readonly sessions: Map<any, any[]> = new Map();

  /**
   * @param key
   * @param value
   * @returns
   */
  setRoomDataOrUserSocket(key: any, value: any) {
    const sessionData = this.getUserSession(key);
    if (sessionData) {
      sessionData.push(value);
      this.sessions.set(key, [...new Set(sessionData)]);
      return;
    }
    this.sessions.set(key, [value]);
    return;
  }

  /**
   * setSession data for room or user socket
   * @param id
   * @param data
   */
  setSession(id: any, data: any[]) {
    this.sessions.set(id, data);
  }

  /**
   * get user session by id
   * @param id
   * @returns
   */
  getUserSession(id: any) {
    return this.sessions.get(id);
  }

  /**
   * delete key
   * @param key
   * @returns
   */
  removeUserKeyData(key: any) {
    return this.sessions.delete(key);
  }

  /**
   * Get all sessions
   * @returns
   */
  getAllSession(): Map<string, string[]> {
    return this.sessions;
  }
}
