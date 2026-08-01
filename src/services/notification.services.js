// IMPORTANT FUCNTION REMEMBER AND UNDERSTAND


import notificationModel from "../models/notification.model.js";

export const createNotification = async ({
    user,
    title,
    message,
    type,
    relatedOrder = null,
    relatedProduct = null
}) => {
    const notification = await notificationModel.create({
        user,
        title,
        message,
        type,
        relatedOrder,
        relatedProduct
    });

    return notification;
};