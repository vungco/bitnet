// src/redis/redis.service.ts
import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis'; // Import kiểu Redis từ ioredis

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Đảm bảo đóng kết nối Redis khi ứng dụng tắt
  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  // --- Các phương thức CRUD cơ bản cho Redis Key-Value ---

  /**
   * Đặt một giá trị vào Redis với thời gian sống (TTL) tùy chọn.
   * @param key Khóa để lưu trữ.
   * @param value Giá trị (string hoặc object sẽ được JSON.stringify).
   * @param ttlSeconds Thời gian sống tính bằng giây (tùy chọn).
   */
  async set(
    key: string,
    value: any,
    ttlSeconds?: number,
  ): Promise<string | null> {
    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (ttlSeconds) {
      return this.redisClient.set(key, stringValue, 'EX', ttlSeconds);
    }
    return this.redisClient.set(key, stringValue);
  }

  /**
   * Lấy giá trị từ Redis.
   * @param key Khóa để lấy giá trị.
   * @returns Giá trị dạng string hoặc null nếu không tìm thấy.
   */
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  /**
   * Lấy giá trị từ Redis và tự động parse JSON (nếu là JSON string).
   * @param key Khóa để lấy giá trị.
   * @returns Giá trị đã parse hoặc null.
   */
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Failed to parse JSON for key ${key}:`, e);
      return null;
    }
  }

  /**
   * Xóa một hoặc nhiều khóa từ Redis.
   * @param keys Các khóa cần xóa.
   * @returns Số lượng khóa đã xóa.
   */
  async del(...keys: string[]): Promise<number> {
    return this.redisClient.del(...keys);
  }

  /**
   * Kiểm tra xem một khóa có tồn tại trong Redis không.
   * @param key Khóa cần kiểm tra.
   * @returns 1 nếu tồn tại, 0 nếu không.
   */
  async exists(key: string): Promise<number> {
    return this.redisClient.exists(key);
  }

  // --- Các phương thức khác (ví dụ cho danh sách hoặc hash) ---

  /**
   * Thêm một phần tử vào danh sách Redis (bên phải).
   * @param key Khóa của danh sách.
   * @param value Phần tử cần thêm.
   * @returns Độ dài mới của danh sách.
   */
  async rpush(key: string, value: any): Promise<number> {
    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    return this.redisClient.rpush(key, stringValue);
  }

  /**
   * Lấy tất cả các phần tử từ một danh sách Redis.
   * @param key Khóa của danh sách.
   * @returns Mảng các chuỗi.
   */
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redisClient.lrange(key, start, stop);
  }

  /**
   * Đặt các trường và giá trị vào một hash Redis.
   * @param key Khóa của hash.
   * @param fieldFieldMap Đối tượng chứa các cặp trường-giá trị.
   */
  async hset(
    key: string,
    fieldFieldMap: Record<string, string | number>,
  ): Promise<number> {
    return this.redisClient.hset(key, fieldFieldMap);
  }

  /**
   * Lấy tất cả các cặp trường-giá trị từ một hash Redis.
   * @param key Khóa của hash.
   * @returns Đối tượng chứa các cặp trường-giá trị.
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redisClient.hgetall(key);
  }
}
