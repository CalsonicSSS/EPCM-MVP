export type ExtractedPdfData = {
  pdfInfo: {
    tenderDescription: string;
    tenderNumber: string;
    tenderCurrency: string;
    additionalCurrenciesAllowed: string[];
    timezone: string;
    offerSubmissionPeriod: string;
    openingDate: string;
  };
  items: {
    positionType: string;
    supplierProductNumber: string;
    deliveryDate: string;
    productNumber: string;
    itemDescription: string;
    quantity: string;
  }[];
};

export type HighPotentialItem = {
  itemDescription: string;
  positionType: string;
  supplierProductNumber: string;
  deliveryDate: string;
  productNumber: string;
  quantity: string;
};
