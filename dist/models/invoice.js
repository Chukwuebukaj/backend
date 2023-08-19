"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModel = void 0;
const mongoose_1 = require("mongoose");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["APPROVED"] = "Approved";
    InvoiceStatus["COMPLETE"] = "Complete";
    InvoiceStatus["DISPUTED"] = "Disputed";
    InvoiceStatus["PAID"] = "Paid";
    InvoiceStatus["PENDING"] = "Pending";
})(InvoiceStatus || (InvoiceStatus = {}));
const invoiceSchema = new mongoose_1.Schema({
    invoiceAddress: { type: String, required: false, unique: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentType: { type: String, required: true },
    status: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    services: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            rate: { type: Number, required: true },
        },
    ],
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    duration: { type: Number, required: true },
    installment: { type: Number, required: true },
    initialDeposit: { type: Number, required: true },
    discount: { type: Number, required: true },
    termsAndConditions: { type: [String], required: true },
}, {
    timestamps: true,
});
exports.InvoiceModel = (0, mongoose_1.model)("Invoice", invoiceSchema);
