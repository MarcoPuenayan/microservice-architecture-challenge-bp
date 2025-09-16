export interface ReportTransaction {
  date: string;
  customerName: string;
  accountNumber: string;
  accountTypeDescription: string;
  initialBalance: number;
  status: boolean;
  transactionValue: number;
  availableBalance: number;
}

export interface ReportResponse {
  transactions: ReportTransaction[];
  pdfReport?: string; // Base64 encoded PDF when format=PDF
}
