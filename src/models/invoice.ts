import mongoose, { Schema, Document } from "mongoose";

export interface Service {
  title: string;
  description: string;
  quantity: number;
  rate: number;
}

export enum InvoiceStatus {
  APPROVED = "Approved",
  COMPLETE = "Complete",
  DISPUTED = "Disputed",
  PAID = "Paid",
  PENDING = "Pending",
}

export interface InvoiceDocument extends Document {
  invoiceAddress: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  startDate: string;
  endDate: string;
  duration: string;
  paymentType: string;
  currency: string;
  services: Service[];
  amount: number;
  bankName: string;
  accountNumber: number;
  installment: number;
  initialDepositPercentage: string;
  initialDeposit: number;
  taxPercentage: string;
  tax: number;
  discountPercentage: string;
  discount: number;
  termsAndConditions: string[];
  accepted: boolean;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<Service>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
});

const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceAddress: { type: String, required: true },
    userId: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    duration: { type: String, required: true },
    paymentType: { type: String, required: true },
    currency: { type: String, required: true },
    services: [ServiceSchema],
    amount: { type: Number, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: Number, required: true },
    installment: { type: Number, required: true },
    initialDepositPercentage: { type: String, required: true },
    initialDeposit: { type: Number, required: true },
    taxPercentage: { type: String, required: true },
    tax: { type: Number, required: true },
    discountPercentage: { type: String, required: true },
    discount: { type: Number, required: true },
    termsAndConditions: { type: [String], required: true },
    accepted: { type: Boolean, required: true },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const InvoiceModel = mongoose.model<InvoiceDocument>(
  "Invoice",
  InvoiceSchema
);
