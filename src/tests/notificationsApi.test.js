import { beforeEach, describe, test, expect } from "@jest/globals";
import supertest from "supertest";
import app from "../app";
import notificationsService from "../services/notifications.js";
import { randomUUID } from "crypto";
import testHelper from "./testHelper.js";
const api = supertest(app);

describe("Notifications API", () => {
  beforeEach(async () => {
    await testHelper.emptyDatabase();
  });

  describe("Device Management", () => {
    test("can add a device for a user", async () => {
      const userId = randomUUID();
      const device = { device: "device_token" };

      await api
        .post(`/notifications/${userId}/devices`)
        .send(device)
        .expect(201);
    });
  });

  describe("Notification Management", () => {
    const userId = randomUUID();
    beforeEach(async () => {
      await notificationsService.addUserDevice(userId, "device_token");
    });
    test("can create a notification", async () => {
      const notification = {
        url: "http://example.com",
        body: "This is a test notification",
        title: "Test",
      };

      const res = await api
        .post(`/notifications/${userId}`)
        .send(notification)
        .expect(201);

      expect(res.body).toBeDefined();
      expect(res.body.url).toBe(notification.url);
      expect(res.body.body).toBe(notification.body);
      expect(res.body.title).toBe(notification.title);
    });

    test("can fetch notifications for a user", async () => {
      await notificationsService.createNotification(userId, {
        url: "http://example.com",
        body: "Test notification",
        title: "Test",
      });

      const res = await api.get(`/notifications/${userId}`).expect(200);

      expect(res.body).toBeDefined();
      expect(res.body).toHaveLength(1);
    });

    test("can fetch unseen notifications count", async () => {
      await notificationsService.createNotification(userId, {
        url: "http://example.com",
        body: "Test notification",
        title: "Test",
        seen: false,
      });

      const res = await api.get(`/notifications/${userId}/unseen`).expect(200);
      expect(res.body.unseen).toBe(1);
    });

    test("can mark a notification as seen", async () => {
      const notification = await notificationsService.createNotification(
        userId,
        {
          url: "http://example.com",
          body: "Test notification",
          title: "Test",
          seen: false,
        }
      );

      const res = await api
        .patch(`/notifications/${notification.id}`)
        .send({ seen: true })
        .expect(200);

      expect(res.body.seen).toBe(true);
    });

    test("returns 404 when marking a non-existent notification as seen", async () => {
      const notificationId = randomUUID();
      await api
        .patch(`/notifications/${notificationId}`)
        .send({ seen: true })
        .expect(404);
    });
  });

  describe("API Key Management", () => {
    test("can update the API key", async () => {
      const newApiKey = { apiKey: "new_api_key_123" };

      const res = await api
        .put("/notifications/apiKey")
        .send(newApiKey)
        .expect(200);

      expect(res.body.apiKey).toBe(newApiKey.apiKey);
      expect(process.env.API_KEY).toBe(newApiKey.apiKey);
    });

    test("returns 400 if API key is invalid", async () => {
      await api.put("/notifications/apiKey").send({}).expect(400);
    });
  });
});
