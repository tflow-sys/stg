export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  membershipTier: 'water-babies' | 'dive-buddies' | 'sea-monsters';
  points: number;
  totalSpent: number;
  role: 'customer' | 'staff' | 'manager' | 'admin' | 'dive_center_partner';
  department?: 'warehouse' | 'administrative' | 'billing' | 'partnerships' | 'management';
  permissions: string[];
  diveCenterName?: string; // For dive center partners
  healthDeclaration?: HealthDeclaration;
  createdAt: Date;
}

export interface HealthDeclaration {
  hasConditions: boolean;
  conditions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  lastUpdated: Date;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  category: 'masks' | 'fins' | 'regulators' | 'bcds' | 'wetsuits' | 'tanks' | 'accessories';
  description: string;
  images: string[];
  price: number;
  rentalPrice: number;
  stock: number;
  available: boolean;
  isRentable: boolean;
  specs: Record<string, string>;
  ratings: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface DivePackage {
  id: string;
  name: string;
  level: 'fun-diving' | 'open-water' | 'advanced-open-water' | 'rescue-diver' | 'divemaster';
  price: number;
  duration: number; // days
  location: string;
  diveCenterPartner: string;
  description: string;
  images: string[];
  requirements: string[];
  minParticipants: number;
  maxParticipants: number;
  includedItems: string[];
  availableDates: Date[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface CartItem {
  id: string;
  type: 'purchase' | 'rental' | 'package';
  equipmentId?: string;
  packageId?: string;
  quantity: number;
  rentalDuration?: number;
  selectedDate?: Date;
  participants?: number;
  price: number;
  addedAt: Date;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'online_banking' | 'wallet';
  deliveryAddress: DeliveryAddress;
  billingAddress?: DeliveryAddress;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  statusHistory: OrderStatusHistory[];
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderStatusHistory {
  status: Order['status'];
  timestamp: Date;
  notes?: string;
  updatedBy?: string;
}

export interface Rental {
  id: string;
  rentalNumber: string;
  userId: string;
  equipmentId: string;
  quantity: number;
  rentalDuration: number;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'active' | 'returned' | 'overdue' | 'damaged' | 'cancelled';
  totalCost: number;
  securityDeposit: number;
  fine?: number;
  inspectionNotes?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: DeliveryAddress;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: RentalStatusHistory[];
}

export interface RentalStatusHistory {
  status: Rental['status'];
  timestamp: Date;
  notes?: string;
  updatedBy?: string;
}

export interface PackageBooking {
  id: string;
  bookingNumber: string;
  userId: string;
  packageId: string;
  selectedDate: Date;
  participants: number;
  participantDetails: ParticipantDetail[];
  totalCost: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  emergencyContact: EmergencyContact;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: BookingStatusHistory[];
}

export interface ParticipantDetail {
  name: string;
  age: number;
  certificationLevel?: string;
  medicalClearance: boolean;
  emergencyContact: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface BookingStatusHistory {
  status: PackageBooking['status'];
  timestamp: Date;
  notes?: string;
  updatedBy?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  category?: 'brand' | 'package-level' | 'age-group' | 'membership';
  applicableItems: string[];
  minAmount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usageCount: number;
}

export interface Report {
  id: string;
  type: 'sales' | 'rentals' | 'membership' | 'inventory' | 'revenue' | 'partnerships';
  title: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any;
  generatedBy: string;
  generatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'equipment' | 'packages' | 'users' | 'reports' | 'system';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'rental' | 'package' | 'system' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface PaymentDetails {
  method: 'credit_card' | 'debit_card' | 'online_banking' | 'wallet';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  bankName?: string;
  accountNumber?: string;
}