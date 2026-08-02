import notificationModel from "../../models/notification.model.js";
import { notificationIdParamSchema } from "../../validations/notification.validation.js";

export const getMyNotifications = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "User is unauthorized"
            });
        }

        const notifications = await notificationModel
            .find({
                user: userId
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            status: true,
            message: "Notifications fetched successfully",
            data: {
                notifications
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getUnreadNotificationCount = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "User is unauthorized"
            });
        }

        const unreadCount = await notificationModel.countDocuments({
            user: userId,
            isRead: false
        });

        return res.status(200).json({
            status: true,
            message: "Unread notification count fetched successfully",
            data: {
                unreadCount
            }
        });
    } catch (error) {
        next(error);
    }
};



export const markNotificationAsRead = async (req, res, next) => {
    try {
        const validationResult = await notificationIdParamSchema.safeParseAsync(
            req.params
        );

        if (!validationResult.success) {
            return res.status(400).json({
                status: false,
                message: "Invalid notification id"
            });
        }

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "User is unauthorized"
            });
        }

        const { notificationId } = validationResult.data;

        const notification = await notificationModel.findOne({
            _id: notificationId,
            user: userId
        });

        if (!notification) {
            return res.status(404).json({
                status: false,
                message: "Notification not found"
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            status: true,
            message: "Notification marked as read",
            data: {
                notification
            }
        });
    } catch (error) {
        next(error);
    }
};

export const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "User is unauthorized"
            });
        }

        const result = await notificationModel.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            status: true,
            message: "All notifications marked as read",
            data: {
                updated: result.modifiedCount
            }
        });
    } catch (error) {
        next(error);
    }
};



