const output = document.getElementById("output");
const payButton = document.getElementById("payButton");

const log = (value) => {
    output.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
};

const postJson = async (url, token, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};

payButton.addEventListener("click", async () => {
    try {
        const baseUrl = document.getElementById("baseUrl").value.trim();
        const token = document.getElementById("token").value.trim();
        const orderId = document.getElementById("orderId").value.trim();

        if (!baseUrl || !token || !orderId) {
            log("Backend URL, token, and order id are required.");
            return;
        }

        log("Creating Razorpay order...");

        const createResponse = await postJson(`${baseUrl}/api/v1/payments/create`, token, {
            orderId
        });

        const paymentData = createResponse.data;

        const razorpay = new Razorpay({
            key: paymentData.key_id,
            amount: paymentData.amount,
            currency: paymentData.currency,
            order_id: paymentData.razorpayOrderId,
            name: "ShopKart Test",
            description: "Order payment test",
            handler: async (response) => {
                log("Verifying payment...");

                const verifyResponse = await postJson(`${baseUrl}/api/v1/payments/verify`, token, {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature
                });

                log(verifyResponse);
            }
        });

        razorpay.open();
    } catch (error) {
        log(error);
    }
});
