
export enum AccessLevel {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER'
}

export enum ResidentStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Desativado'
}

export interface ServiceProvider {
  name: string;
  document: string; // CPF or RG
}

export interface Resident {
  id: string;
  name: string;
  houseNumber: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: ResidentStatus;
  providers: ServiceProvider[];
  createdAt: number;
  observations?: string;
}

export interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
}
