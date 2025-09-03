import Stripe from "stripe";
import ErrorHandler from "../utils/ErrorHandler.utils.js"
import crypto from "crypto";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//just preparing
export const createStripePaymentIntent = async (amount, currency="usd") => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, //in cents
            currency,
            payment_method_types: ["card"],
        });

        return paymentIntent;//id + client_secret + status
    } catch (error) {
        throw new ErrorHandler(error.message)
    }
}



//jazzcash payment
export const createJazzCashPayment = async (amount,orderId, userId) => {
    //load credentials
    const merchantId = process.env.JAZZCASH_MERCHANT_ID;
    const password = process.env.JAZZCASH_PASSWORD;
    const returnUrl = process.env.JAZZCASH_RETURN_URL;
    const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;

    const now = new Date();
    const trxDateTime = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)
    const expiryDateTime = new Date(now.getTime() + 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);

    
    const ppAmount = (amount * 100).toString();//in paisa
    const ppTrxRefNo = "T" + trxDateTime;//reference number

    //payload 
    const params = {
        pp_Version: "1.1",
        pp_TxnType: "MWALLET",
        pp_Language: "EN",
        pp_MerchantID: merchantId,
        pp_Password: password,
        ppTrxRefNo,
        pp_Amount: ppAmount,
        pp_TxnCurrency: "PKR",
        pp_TxnDateTime: trxDateTime,
        pp_BillReference: orderId,
        pp_Description: "Payment for order " + orderId,
        pp_TxnExpiryDateTime: expiryDateTime,
        pp_ReturnURL: returnUrl,
    };

    //generate secure hash
    const sortedKeys = Object.keys(params).sort();
    const sortedString = sortedKeys.map((k) => params[k]).join("&");
    const hashString = integritySalt + "&" + sortedString;
    params.pp_SecureHash = crypto.createHash("sha256").update(hashString).digest("hex");

    const response = await axios.post(process.env.JAZZCASH_API_URL, params);

    return {paymentUrl: response.data.pp_PaymentURL, txnRef: ppTrxRefNo}
}



//easy paisa
export const createEasyPaisaPayment = async(amount, orderId, userId) => {
    const storeId = process.env.EASYPAY_STORE_ID;
    const hashKey = process.env.EASYPAY_HASH_KEY;
    const returnURL = process.env.EASYPAY_RETURN_URL;

    const now = Date.now();
    const expiry = now + 60 * 60 * 1000;//1 hour

    const payload = {
        storeId,
        amount,
        orderRefNum: orderId,
        expiryDate: expiry,
        postBackURL: returnURL,
    };

    const hashString = `${storeId}&${orderId}&${amount}&${expiry}&${returnURL}`
    const secureHash = crypto.createHmac("sha256", hashKey).update(hashString).digest("hex");
    payload.secureHash = secureHash;

    const response = await axios.post(process.env.EASYPAY_API_URL, payload);
    return {paymentUrl: response.data.paymentUrl, orderRef: orderId}
}