const typeDefs = `#graphql
  type Service {
    title: String!
    description: String!
    quantity: Float!
    rate: Float!
  }

  type Invoice {
    _id: ID!
    userId: String!
    invoiceAddress: String!
    clientName: String!
    clientEmail: String!
    startDate: String!
    endDate: String!
    duration: String!
    paymentType: String!
    currency: String!
    services: [Service]!
    amount: Float!
    bankName: String!
    accountNumber: Float!
    installment: Float!
    initialDepositPercentage: String!
    initialDeposit: Float!
    taxPercentage: String!
    tax: Float!
    discountPercentage: String!
    discount: Float!
    termsAndConditions: [String]!
    accepted: Boolean!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  input ServiceInput {
    title: String!
    description: String!
    quantity: Float!
    rate: Float!
  }

  input InvoiceInput {
    invoiceAddress: String!
    userId: String!
    clientName: String!
    clientEmail: String!
    startDate: String!
    endDate: String!
    duration: String!
    paymentType: String!
    currency: String!
    services: [ServiceInput]!
    amount: Float!
    bankName: String!
    accountNumber: Float!
    installment: Float!
    initialDepositPercentage: String!
    initialDeposit: Float!
    taxPercentage: String!
    tax: Float!
    discountPercentage: String!
    discount: Float!
    termsAndConditions: [String]!
    accepted: Boolean!
    status: String!
  }

  type Query {
    invoices: [Invoice!]!
    invoice(invoiceAddress: String!): Invoice!
    invoiceById(_id: ID!): Invoice!
  }

  type Mutation {
    createInvoice(input: InvoiceInput!): Invoice!
    updateInvoice(_id: ID!, input: InvoiceInput): Invoice!
    deleteInvoice(_id: ID!): Invoice!
  }
`;

export default typeDefs;
