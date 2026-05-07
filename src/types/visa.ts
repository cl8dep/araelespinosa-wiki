export type VisaRequirement = 'VF' | 'VR' | 'VOA' | 'ETA' | 'TF' | 'TV';

export interface VisaException {
  condition: string;
  result: VisaRequirement;
  source: string | null;
  sourceUrl?: string;
  /** true = verificado con fuente oficial; false/undefined = pendiente */
  verified?: boolean;
  /** ISO3 codes of residence countries to which this exception applies */
  residenceCountries?: string[];
}

export interface VisaTourism {
  requirement: VisaRequirement;
  exceptions?: VisaException[];
  /** Duración máxima de estadía, ej. "90 días" */
  maxStay?: string;
  notes?: string;
}

export interface VisaTransit {
  requirement: VisaRequirement;
  exceptions?: VisaException[];
  maxStay?: string;
  notes?: string;
  /** true = solo se puede permanecer en el área internacional del aeropuerto */
  airsideOnly?: boolean;
  /** Requisito si el pasajero quiere salir del área internacional */
  landsideRequirement?: VisaRequirement;
}

export interface VisaDestination {
  tourism: VisaTourism;
  transit?: VisaTransit;
  /** true = dato revisado manualmente; false/undefined = solo dataset base */
  reviewed?: boolean;
  notes?: string;
}

export interface PassportData {
  passport: string;
  updated: string;
  destinations: Record<string, VisaDestination>;
}

export interface PassportListEntry {
  iso3: string;
}
