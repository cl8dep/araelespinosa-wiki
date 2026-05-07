import type {VisaRequirement} from '@site/src/types/visa';

export const REQUIREMENT_COLORS: Record<VisaRequirement, string> = {
  VF: '#2a9d8f',   // verde azulado — sin visa
  VOA: '#e9c46a',  // amarillo — visa al llegar
  ETA: '#f4a261',  // naranja — autorización electrónica
  VR: '#e63946',   // rojo — visa requerida
  TF: '#2a9d8f',   // verde — tránsito libre
  TV: '#e63946',   // rojo — visa de tránsito requerida
};

export const REQUIREMENT_LABELS: Record<VisaRequirement, string> = {
  VF: 'Sin visa',
  VOA: 'Visa al llegar',
  ETA: 'Autorización electrónica',
  VR: 'Visa requerida',
  TF: 'Tránsito libre',
  TV: 'Visa de tránsito requerida',
};

export const REQUIREMENT_DESCRIPTIONS: Record<VisaRequirement, string> = {
  VF:  'Puedes entrar sin tramitar ningún documento previo. Al llegar se otorga un sello de turista. Verifica el límite de días permitidos.',
  VOA: 'Puedes obtener la visa directamente en el aeropuerto al llegar al país destino. Generalmente tiene un costo y se paga en efectivo.',
  ETA: 'Debes solicitar una autorización electrónica en línea antes de viajar. Es más rápida que una visa tradicional pero igual es obligatoria.',
  VR:  'Debes tramitar una visa en el consulado o embajada del país destino antes de salir. El proceso puede tardar días o semanas.',
  TF:  'Puedes hacer escala sin visa de tránsito. Normalmente debes permanecer en el área internacional del aeropuerto sin pasar por migración.',
  TV:  'Debes tramitar una visa de tránsito aunque no salgas del aeropuerto. Sin ella, la aerolínea puede negarte el embarque.',
};

