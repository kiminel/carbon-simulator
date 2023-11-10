export interface CountryStats {
  country: string;
  avgCo2: number;
}

export interface CarbonData {
  date: Date;
  offset: number;
}

export interface Row {
  date: string;
  trees: number;
  cost: number;
}

export interface CarbonFormProps {
  countryStats: CountryStats[];
  onCalculateOffset: (carbonData: CarbonData[], avgCO2: number) => void;
}

export interface CarbonDataProps {
  carbonData: CarbonData[];
  avgCo2ForCountry: number;
}

export interface TableFooterProps {
  rows: Row[];
  totalCost: number;
}
