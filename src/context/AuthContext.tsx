import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Van, DocumentItem, Review, EmailNotification } from '../types';
import { INITIAL_USERS, INITIAL_VANS, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface LoginResult {
  success: boolean;
  error?: string;
  user?: UserProfile;
}

export interface RegisterResult {
  success: boolean;
  error?: string;
  user?: UserProfile;
}

export interface SendSeatRequestInput {
  vanId: string;
  studentName: string;
  studentGrade?: string;
  schoolName: string;
  pickupAddress: string;
  shift: string;
  message?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => LoginResult;
  logout: () => void;
  registerUser: (profile: Omit<UserProfile, 'id' | 'registeredDate'>) => RegisterResult;
  isEmailRegistered: (email: string) => boolean;
  registeredUsers: UserProfile[];
  vans: Van[];
  updateVanSeats: (vanId: string, delta: number) => void;
  setVanAvailableSeats: (vanId: string, count: number) => void;
  addNewVan: (
    van: Omit<
      Van,
      'id' | 'verified' | 'verificationDate' | 'driverRating' | 'driverReviewsCount' | 'reviews'
    >
  ) => void;
  addDocumentToVan: (vanId: string, doc: Omit<DocumentItem, 'id'>) => void;
  addReviewToVan: (
    vanId: string,
    reviewData: Omit<Review, 'id' | 'date' | 'verifiedApoderado'>
  ) => void;
  savedVanIds: string[];
  toggleSaveVan: (vanId: string) => void;
  notifications: EmailNotification[];
  sendSeatRequestNotification: (input: SendSeatRequestInput) => {
    success: boolean;
    notification?: EmailNotification;
    error?: string;
  };
  acceptSeatRequest: (notificationId: string) => void;
  updateNotificationStatus: (
    notificationId: string,
    status: 'pending' | 'accepted' | 'responded'
  ) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalIntent: string;
  openAuthModalWithIntent: (intent: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'furgon_seguro_active_user';
const STORAGE_KEY_USERS_DB = 'furgon_seguro_users_database';
const STORAGE_KEY_VANS = 'furgon_seguro_vans_database';
const STORAGE_KEY_SAVED = 'furgon_seguro_saved_vans';
const STORAGE_KEY_NOTIFICATIONS = 'furgon_seguro_email_notifications';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Registered accounts
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (saved) {
        const parsed: UserProfile[] = JSON.parse(saved);
        const hasParent = parsed.some((u) => u.email === 'apoderado@furgonseguro.cl');
        const hasDriver = parsed.some((u) => u.email === 'chofer@furgonseguro.cl');
        if (hasParent && hasDriver) return parsed;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [vans, setVans] = useState<Van[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VANS);
      if (saved) {
        const parsed: Van[] = JSON.parse(saved);
        return parsed.map((v) => ({
          ...v,
          reviews: v.reviews || [],
        }));
      }
      return INITIAL_VANS;
    } catch {
      return INITIAL_VANS;
    }
  });

  const [savedVanIds, setSavedVanIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<EmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalIntent, setAuthModalIntent] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VANS, JSON.stringify(vans));
    } catch (e) {
      console.error(e);
    }
  }, [vans]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedVanIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedVanIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const isEmailRegistered = (email: string): boolean => {
    const normalized = email.trim().toLowerCase();
    return registeredUsers.some((u) => u.email.trim().toLowerCase() === normalized);
  };

  const login = (email: string, pass: string): LoginResult => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return {
        success: false,
        error: 'No existe una cuenta registrada con este correo electrónico.',
      };
    }

    if (user.password && user.password !== pass) {
      return {
        success: false,
        error: 'La contraseña ingresada es incorrecta. Por favor verifica tus datos.',
      };
    }

    setCurrentUser(user);
    setShowAuthModal(false);
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = (profile: Omit<UserProfile, 'id' | 'registeredDate'>): RegisterResult => {
    const normalizedEmail = profile.email.trim().toLowerCase();

    // STRICT EMAIL UNIQUENESS CHECK
    const existing = registeredUsers.find(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );

    if (existing) {
      const existingRoleName = existing.role === 'conductor' ? 'chofer' : 'apoderado';
      return {
        success: false,
        error: `El correo "${normalizedEmail}" ya está registrado como cuenta de ${existingRoleName}. Cada correo solo permite 1 cuenta. Por favor inicia sesión o utiliza otro correo.`,
      };
    }

    const newUser: UserProfile = {
      ...profile,
      email: normalizedEmail,
      id: `user-${Date.now()}`,
      registeredDate: new Date().toISOString().split('T')[0],
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setShowAuthModal(false);
    return { success: true, user: newUser };
  };

  const updateVanSeats = (vanId: string, delta: number) => {
    setVans((prev) =>
      prev.map((v) => {
        if (v.id === vanId) {
          const nextVal = Math.max(0, Math.min(v.totalSeats, v.availableSeats + delta));
          return { ...v, availableSeats: nextVal };
        }
        return v;
      })
    );
  };

  const setVanAvailableSeats = (vanId: string, count: number) => {
    setVans((prev) =>
      prev.map((v) => {
        if (v.id === vanId) {
          const valid = Math.max(0, Math.min(v.totalSeats, count));
          return { ...v, availableSeats: valid };
        }
        return v;
      })
    );
  };

  const addNewVan = (
    vanData: Omit<
      Van,
      'id' | 'verified' | 'verificationDate' | 'driverRating' | 'driverReviewsCount' | 'reviews'
    >
  ) => {
    const newVan: Van = {
      ...vanData,
      id: `van-${Date.now()}`,
      verified: true,
      verificationDate: new Date().toISOString().split('T')[0],
      driverRating: 5.0,
      driverReviewsCount: 0,
      reviews: [],
    };
    setVans((prev) => [newVan, ...prev]);
  };

  const addDocumentToVan = (vanId: string, doc: Omit<DocumentItem, 'id'>) => {
    setVans((prev) =>
      prev.map((v) => {
        if (v.id === vanId) {
          const newDoc: DocumentItem = {
            ...doc,
            id: `doc-${Date.now()}`,
          };
          return { ...v, documents: [...v.documents, newDoc] };
        }
        return v;
      })
    );
  };

  const addReviewToVan = (
    vanId: string,
    reviewData: Omit<Review, 'id' | 'date' | 'verifiedApoderado'>
  ) => {
    setVans((prev) =>
      prev.map((v) => {
        if (v.id === vanId) {
          const newReview: Review = {
            ...reviewData,
            id: `rev-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            verifiedApoderado: true,
          };

          const updatedReviews = [newReview, ...v.reviews];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = Number((totalRating / updatedReviews.length).toFixed(2));

          return {
            ...v,
            reviews: updatedReviews,
            driverRating: newAvg,
            driverReviewsCount: updatedReviews.length,
          };
        }
        return v;
      })
    );
  };

  const sendSeatRequestNotification = (input: SendSeatRequestInput) => {
    const targetVan = vans.find((v) => v.id === input.vanId);
    if (!targetVan) {
      return { success: false, error: 'No se encontró el furgón escolar especificado.' };
    }

    const driverUser = registeredUsers.find((u) => u.id === targetVan.driverId);
    const driverEmail = driverUser?.email || 'chofer@furgonseguro.cl';

    const newNotif: EmailNotification = {
      id: `notif-${Date.now()}`,
      driverId: targetVan.driverId,
      driverEmail,
      driverName: targetVan.driverName,
      vanId: targetVan.id,
      vanPatente: targetVan.patente,
      subject: `🔔 Nueva Solicitud de Cupo: ${currentUser?.name || 'Apoderado'} para ${input.schoolName}`,
      parentName: currentUser?.name || 'Apoderado Interesado',
      parentPhone: currentUser?.phone || '+56 9 8765 4321',
      parentEmail: currentUser?.email || 'apoderado@furgonseguro.cl',
      studentName: input.studentName,
      studentGrade: input.studentGrade || 'Escolar',
      schoolName: input.schoolName,
      pickupAddress: input.pickupAddress,
      shift: input.shift,
      message: input.message,
      status: 'pending',
      sentAt: 'Recién enviado',
      emailDeliveryStatus: 'delivered',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    return { success: true, notification: newNotif };
  };

  const acceptSeatRequest = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === notificationId) {
          return { ...n, status: 'accepted' };
        }
        return n;
      })
    );

    const targetNotif = notifications.find((n) => n.id === notificationId);
    if (targetNotif) {
      updateVanSeats(targetNotif.vanId, -1);
    }
  };

  const updateNotificationStatus = (
    notificationId: string,
    status: 'pending' | 'accepted' | 'responded'
  ) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === notificationId) {
          return { ...n, status };
        }
        return n;
      })
    );
  };

  const toggleSaveVan = (vanId: string) => {
    setSavedVanIds((prev) =>
      prev.includes(vanId) ? prev.filter((id) => id !== vanId) : [...prev, vanId]
    );
  };

  const openAuthModalWithIntent = (intent: string) => {
    setAuthModalIntent(intent);
    setShowAuthModal(true);
  };

  const role: UserRole = currentUser ? currentUser.role : 'guest';
  const isLoggedIn = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isLoggedIn,
        login,
        logout,
        registerUser,
        isEmailRegistered,
        registeredUsers,
        vans,
        updateVanSeats,
        setVanAvailableSeats,
        addNewVan,
        addDocumentToVan,
        addReviewToVan,
        savedVanIds,
        toggleSaveVan,
        notifications,
        sendSeatRequestNotification,
        acceptSeatRequest,
        updateNotificationStatus,
        showAuthModal,
        setShowAuthModal,
        authModalIntent,
        openAuthModalWithIntent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
