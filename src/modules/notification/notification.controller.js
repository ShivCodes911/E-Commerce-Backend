import notificationModel from "../../models/notification.model.js";

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


