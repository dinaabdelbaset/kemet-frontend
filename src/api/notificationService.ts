import axiosClient from "./axiosClient";

export interface Notification {
  id: string;
  type: 'booking' | 'offer' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * ---------------------------------------------------------------------------------
 * ملف الإشعارات (Notifications)
 * ---------------------------------------------------------------------------------
 */

export const getUserNotifications = async (): Promise<Notification[]> => {
    const response = await axiosClient.get("/user/notifications");
    return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
    const response = await axiosClient.put(`/user/notifications/${notificationId}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await axiosClient.put("/user/notifications/read-all");
    return response.data;
};
