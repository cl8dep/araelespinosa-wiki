import React from 'react';
import {CheckCircle, Clock, Globe, Ban, ArrowRight, Ticket} from 'lucide-react';
import type {VisaRequirement} from '@site/src/types/visa';

const ICONS: Record<VisaRequirement, React.ComponentType<{size?: number; strokeWidth?: number}>> = {
  VF:  CheckCircle,
  VOA: Clock,
  ETA: Globe,
  VR:  Ban,
  TF:  ArrowRight,
  TV:  Ticket,
};

export default function VisaReqIcon({req, size = 13}: {req: VisaRequirement; size?: number}): React.JSX.Element {
  const Icon = ICONS[req];
  return <Icon size={size} strokeWidth={2.2} />;
}
