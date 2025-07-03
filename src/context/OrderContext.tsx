import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, Rental, PackageBooking, OrderStatusHistory, DeliveryAddress, PaymentDetails } from '../types';

interface OrderContextType {
  orders: Order[];
  rentals: Rental[];
  bookings: PackageBooking[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<Order>;
  createRental: (rentalData: Omit<Rental, 'id' | 'rentalNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<Rental>;
  createBooking: (bookingData: Omit<PackageBooking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<PackageBooking>;
  updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => void;
  updateRentalStatus: (rentalId: string, status: Rental['status'], notes?: string) => void;
  updateBookingStatus: (bookingId: string, status: PackageBooking['status'], notes?: string) => void;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  getRentalByNumber: (rentalNumber: string) => Rental | undefined;
  getBookingByNumber: (bookingNumber: string) => PackageBooking | undefined;
  trackOrder: (orderNumber: string) => OrderStatusHistory[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [bookings, setBookings] = useState<PackageBooking[]>([]);

  useEffect(() => {
    // Load from localStorage
    const savedOrders = localStorage.getItem('stg_orders');
    const savedRentals = localStorage.getItem('stg_rentals');
    const savedBookings = localStorage.getItem('stg_bookings');

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          confirmedAt: order.confirmedAt ? new Date(order.confirmedAt) : undefined,
          shippedAt: order.shippedAt ? new Date(order.shippedAt) : undefined,
          deliveredAt: order.deliveredAt ? new Date(order.deliveredAt) : undefined,
          cancelledAt: order.cancelledAt ? new Date(order.cancelledAt) : undefined,
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
          statusHistory: order.statusHistory.map((h: any) => ({
            ...h,
            timestamp: new Date(h.timestamp)
          }))
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
      }
    }

    if (savedRentals) {
      try {
        const parsedRentals = JSON.parse(savedRentals).map((rental: any) => ({
          ...rental,
          startDate: new Date(rental.startDate),
          endDate: new Date(rental.endDate),
          createdAt: new Date(rental.createdAt),
          updatedAt: new Date(rental.updatedAt),
          statusHistory: rental.statusHistory.map((h: any) => ({
            ...h,
            timestamp: new Date(h.timestamp)
          }))
        }));
        setRentals(parsedRentals);
      } catch (error) {
        console.error('Error parsing rentals from localStorage:', error);
      }
    }

    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
          ...booking,
          selectedDate: new Date(booking.selectedDate),
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt),
          statusHistory: booking.statusHistory.map((h: any) => ({
            ...h,
            timestamp: new Date(h.timestamp)
          }))
        }));
        setBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing bookings from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stg_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('stg_rentals', JSON.stringify(rentals));
  }, [rentals]);

  useEffect(() => {
    localStorage.setItem('stg_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `STG-${timestamp.slice(-6)}${random}`;
  };

  const generateRentalNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `RNT-${timestamp.slice(-6)}${random}`;
  };

  const generateBookingNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `BKG-${timestamp.slice(-6)}${random}`;
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Order> => {
    const now = new Date();
    const order: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: generateOrderNumber(),
      createdAt: now,
      updatedAt: now,
      statusHistory: [{
        status: orderData.status,
        timestamp: now,
        notes: 'Order created'
      }]
    };

    setOrders(prev => [...prev, order]);
    return order;
  };

  const createRental = async (rentalData: Omit<Rental, 'id' | 'rentalNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Rental> => {
    const now = new Date();
    const rental: Rental = {
      ...rentalData,
      id: `rental_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      rentalNumber: generateRentalNumber(),
      createdAt: now,
      updatedAt: now,
      statusHistory: [{
        status: rentalData.status,
        timestamp: now,
        notes: 'Rental created'
      }]
    };

    setRentals(prev => [...prev, rental]);
    return rental;
  };

  const createBooking = async (bookingData: Omit<PackageBooking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<PackageBooking> => {
    const now = new Date();
    const booking: PackageBooking = {
      ...bookingData,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookingNumber: generateBookingNumber(),
      createdAt: now,
      updatedAt: now,
      statusHistory: [{
        status: bookingData.status,
        timestamp: now,
        notes: 'Booking created'
      }]
    };

    setBookings(prev => [...prev, booking]);
    return booking;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], notes?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const now = new Date();
        const statusUpdate: OrderStatusHistory = {
          status,
          timestamp: now,
          notes
        };

        const updatedOrder = {
          ...order,
          status,
          updatedAt: now,
          statusHistory: [...order.statusHistory, statusUpdate]
        };

        // Set specific timestamps based on status
        if (status === 'confirmed' && !order.confirmedAt) {
          updatedOrder.confirmedAt = now;
        } else if (status === 'shipped' && !order.shippedAt) {
          updatedOrder.shippedAt = now;
          // Set estimated delivery (3-5 business days)
          const estimatedDelivery = new Date(now);
          estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
          updatedOrder.estimatedDelivery = estimatedDelivery;
        } else if (status === 'delivered' && !order.deliveredAt) {
          updatedOrder.deliveredAt = now;
        } else if (status === 'cancelled' && !order.cancelledAt) {
          updatedOrder.cancelledAt = now;
        }

        return updatedOrder;
      }
      return order;
    }));
  };

  const updateRentalStatus = (rentalId: string, status: Rental['status'], notes?: string) => {
    setRentals(prev => prev.map(rental => {
      if (rental.id === rentalId) {
        const now = new Date();
        return {
          ...rental,
          status,
          updatedAt: now,
          statusHistory: [...rental.statusHistory, {
            status,
            timestamp: now,
            notes
          }]
        };
      }
      return rental;
    }));
  };

  const updateBookingStatus = (bookingId: string, status: PackageBooking['status'], notes?: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        const now = new Date();
        return {
          ...booking,
          status,
          updatedAt: now,
          statusHistory: [...booking.statusHistory, {
            status,
            timestamp: now,
            notes
          }]
        };
      }
      return booking;
    }));
  };

  const getOrderByNumber = (orderNumber: string): Order | undefined => {
    return orders.find(order => order.orderNumber === orderNumber);
  };

  const getRentalByNumber = (rentalNumber: string): Rental | undefined => {
    return rentals.find(rental => rental.rentalNumber === rentalNumber);
  };

  const getBookingByNumber = (bookingNumber: string): PackageBooking | undefined => {
    return bookings.find(booking => booking.bookingNumber === bookingNumber);
  };

  const trackOrder = (orderNumber: string): OrderStatusHistory[] => {
    const order = getOrderByNumber(orderNumber);
    return order ? order.statusHistory : [];
  };

  return (
    <OrderContext.Provider value={{
      orders,
      rentals,
      bookings,
      createOrder,
      createRental,
      createBooking,
      updateOrderStatus,
      updateRentalStatus,
      updateBookingStatus,
      getOrderByNumber,
      getRentalByNumber,
      getBookingByNumber,
      trackOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};