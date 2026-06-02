export interface Appointment {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  reasonForVisit: string;
  date: string; // e.g. "2026-06-09" or "9 Oct"
  timeSlot: string; // e.g. "01:00 PM"
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  stars: number;
  content: string;
  isCustom?: boolean; // added by user in current session
}

export interface Service {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  startingPrice: string;
  icon: string; // material symbols class name
  benefits: string[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  benefits: string[];
  recommended?: boolean;
}
