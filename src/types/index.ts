export type UserRole = 'apoderado' | 'conductor' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'apoderado' | 'conductor';
  avatar?: string;
  comuna: string;
  childrenNames?: string[];
  registeredDate: string;
}

export interface DocumentItem {
  id: string;
  code: string;
  name: string;
  institution: string;
  status: 'verified' | 'pending' | 'expired';
  issueDate: string;
  expiryDate: string;
  documentNumber: string;
  verifiedBy: string;
  notes?: string;
}

export interface Review {
  id: string;
  vanId: string;
  driverId: string;
  parentId: string;
  parentName: string;
  schoolName: string;
  rating: number; // 1 to 5
  comment: string;
  servicePeriod: string;
  date: string;
  verifiedApoderado: boolean;
  aspects?: {
    punctuality: number;
    safety: number;
    treatment: number;
  };
}

export interface EmailNotification {
  id: string;
  driverId: string;
  driverEmail: string;
  driverName: string;
  vanId: string;
  vanPatente: string;
  subject: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  studentName: string;
  studentGrade?: string;
  schoolName: string;
  pickupAddress: string;
  shift: string;
  message?: string;
  status: 'pending' | 'accepted' | 'responded';
  sentAt: string;
  emailDeliveryStatus: 'delivered' | 'sending';
}

export interface Van {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  driverRating: number;
  driverReviewsCount: number;
  patente: string;
  brandModel: string;
  year: number;
  totalSeats: number;
  availableSeats: number;
  comuna: string;
  sectors: string[];
  schools: string[];
  shifts: ('Mañana' | 'Tarde' | 'Jornada Completa')[];
  monthlyFee: number;
  verified: boolean;
  verificationDate: string;
  mttRegistryNumber: string; // RENASTRE
  image: string;
  assistantName?: string;
  documents: DocumentItem[];
  reviews: Review[];
  description: string;
}

export interface ContactInquiry {
  id: string;
  vanId: string;
  parentName: string;
  parentPhone: string;
  schoolName: string;
  comuna: string;
  shift: string;
  date: string;
  status: 'unread' | 'responded';
}
