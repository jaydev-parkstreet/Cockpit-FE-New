export interface ReportRequestObj {
  sort: string;
  order: 'asc' | 'desc';
  page: number;
  pageSize: number;
  universal_search: string;
  end_date?: string;
  supplier?: string[];
  supplier_status?: number[];
  credit_card_on_file?: number[];
  source_account_transfer?: string;
  target_account_transfer?: string;
  has_suggested_transfer?: boolean;
  has_negative_balance?: boolean;
  has_overdraft_fees?: boolean;
  suppliers_reaching_credit_limit?: boolean;
  suppliers_exceeding_credit_limit?: boolean;
}

export interface Filters {
  supplier?: { id: number; name: string }[];
  supplier_status?: {
    type: number;
    id: number;
    name: string;
  }[];
  credit_card_on_file?: {
    type: number;
    id: number;
    name: string;
  }[];
  source_account_transfer?: string;
  target_account_transfer?: string;
  has_suggested_transfer?: boolean;
  has_negative_balance?: boolean;
  has_overdraft_fees?: boolean;
  suppliers_reaching_credit_limit?: boolean;
  suppliers_exceeding_credit_limit?: boolean;
}

export interface FilterList {
  dates?: {
    id: string;
    name: string;
  }[];
  supplier?: {
    id: string;
    name: string;
  }[];
  supplier_status?: {
    type: number;
    id: number;
    name: string;
  }[];
  credit_card_on_file?: {
    type: number;
    id: number;
    name: string;
  }[];
  source_account_transfer?: {
    id: string;
    name: string;
  }[];
  target_account_transfer?: {
    id: string;
    name: string;
  }[];
}

export interface SummaryData {
  client_id: string;
  supplier_name: string;
  hcc_balance: string | number;
  ba_balance: string | number;
  clearance_balance: string | number;
  operating_balance: string | number;
  disbursements_balance: string | number;
  customs_balance: string | number;
  other_bank_balance: string | number;
  suggested_transfer: boolean;
  ar_balance: string | number;
  ap_balance: string | number;
  credit_limit: string | number;
  credit_limit_status: -1 | 0 | 1;
  status_name: string;
  cc_on_file: string;
  overdraft_fees_mtd: string | number;
  checked: boolean;
}

export interface SummaryResponse {
  data: SummaryData[];
  hasError: boolean;
  msg?: string;
}

export interface SummaryCountResponse {
  hasError: boolean;
  total_records: number;
  msg?: string;
}

export interface FilterListResponse {
  hasError: boolean;
  data: FilterList;
  msg?: string;
}
