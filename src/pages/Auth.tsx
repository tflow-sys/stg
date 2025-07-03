import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Building, Shield, Calendar, Globe, Check, X, AlertTriangle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

interface FormData {
  // Basic Information
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
  
  // Delivery Address
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  
  // Health & Consent
  dateOfBirth: string;
  medicalDeclaration: boolean;
  termsAccepted: boolean;
  promotionalEmails: boolean;
  
  // Optional
  referralCode: string;
  membershipId: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+60',
    password: '',
    confirmPassword: '',
    country: 'Malaysia',
    state: '',
    city: '',
    address: '',
    postalCode: '',
    dateOfBirth: '',
    medicalDeclaration: false,
    termsAccepted: false,
    promotionalEmails: false,
    referralCode: '',
    membershipId: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Country and state data
  const countries = [
    { code: 'MY', name: 'Malaysia', dialCode: '+60' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'TH', name: 'Thailand', dialCode: '+66' },
    { code: 'ID', name: 'Indonesia', dialCode: '+62' },
    { code: 'PH', name: 'Philippines', dialCode: '+63' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'UK', name: 'United Kingdom', dialCode: '+44' }
  ];

  const malaysianStates = [
    'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Malacca', 'Negeri Sembilan',
    'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
  ];

  // Demo accounts for login
  const demoAccounts = [
    { email: 'admin@stg.com', role: 'Admin', department: 'Management' },
    { email: 'manager@stg.com', role: 'Manager', department: 'Management' },
    { email: 'warehouse@stg.com', role: 'Staff', department: 'Warehouse' },
    { email: 'billing@stg.com', role: 'Staff', department: 'Billing' },
    { email: 'partner@borneo-divers.com', role: 'Partner', department: 'Dive Center' },
    { email: 'john@example.com', role: 'Customer', department: 'N/A' }
  ];

  // Real-time validation functions
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];
    
    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('One uppercase letter');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('One lowercase letter');
    
    if (/\d/.test(password)) score++;
    else feedback.push('One number');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else feedback.push('One special character');

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    
    return {
      score,
      feedback,
      color: colors[score] || 'bg-gray-300'
    };
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return 'Phone number is required';
    if (phone.length < 8) return 'Phone number is too short';
    if (!/^\d+$/.test(phone.replace(/[\s\-\(\)]/g, ''))) return 'Please enter a valid phone number';
    return '';
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        return validateEmail(value);
      
      case 'phone':
        return validatePhone(value);
      
      case 'password':
        if (!value) return 'Password is required';
        const strength = validatePassword(value);
        if (strength.score < 3) return 'Password is too weak';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      
      case 'country':
        if (!value) return 'Country is required';
        return '';
      
      case 'state':
        if (formData.country === 'Malaysia' && !value) return 'State is required';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        return '';
      
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please provide a complete address';
        return '';
      
      case 'postalCode':
        if (!value) return 'Postal code is required';
        if (formData.country === 'Malaysia' && !/^\d{5}$/.test(value)) {
          return 'Malaysian postal code must be 5 digits';
        }
        return '';
      
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 10) return 'You must be at least 10 years old';
        if (age > 100) return 'Please enter a valid date of birth';
        return '';
      
      case 'termsAccepted':
        if (!value) return 'You must accept the terms and conditions';
        return '';
      
      case 'medicalDeclaration':
        if (!value) return 'Medical declaration is required for diving activities';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time validation
    if (touchedFields.has(name)) {
      const error = validateField(name, type === 'checkbox' ? checked : value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Update country code when country changes
    if (name === 'country') {
      const selectedCountry = countries.find(c => c.name === value);
      if (selectedCountry) {
        setFormData(prev => ({
          ...prev,
          countryCode: selectedCountry.dialCode
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setTouchedFields(prev => new Set(prev).add(name));
    
    const error = validateField(name, type === 'checkbox' ? checked : value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateStep = (step: number): boolean => {
    const stepFields: { [key: number]: string[] } = {
      1: ['fullName', 'email', 'phone', 'password', 'confirmPassword'],
      2: ['country', 'state', 'city', 'address', 'postalCode'],
      3: ['dateOfBirth', 'medicalDeclaration', 'termsAccepted']
    };

    const fieldsToValidate = stepFields[step] || [];
    let isValid = true;
    const newErrors: ValidationErrors = {};

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3) || !captchaVerified) {
      if (!captchaVerified) {
        setErrors(prev => ({ ...prev, captcha: 'Please complete the CAPTCHA verification' }));
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const userData = {
        name: formData.fullName,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} ${formData.postalCode}`,
        role: 'customer' as const,
        permissions: ['purchase', 'rent', 'book_packages'],
        dateOfBirth: new Date(formData.dateOfBirth),
        referralCode: formData.referralCode || undefined,
        promotionalEmails: formData.promotionalEmails
      };

      const success = await register(userData);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = validatePassword(formData.password);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
            step <= currentStep 
              ? 'bg-ocean-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
              step < currentStep ? 'bg-ocean-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
      
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
        </div>
        {errors.fullName && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
        </div>
        {errors.email && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.email}</p>}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <div className="flex space-x-2">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleInputChange}
            className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
          >
            {countries.map(country => (
              <option key={country.code} value={country.dialCode}>
                {country.dialCode}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="123456789"
            />
          </div>
        </div>
        {errors.phone && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.phone}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded ${
                    i < passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                  } transition-colors duration-300`}
                />
              ))}
            </div>
            {passwordStrength.feedback.length > 0 && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="space-y-1">
                  {passwordStrength.feedback.map((item, index) => (
                    <li key={index} className="flex items-center text-xs">
                      <X className="h-3 w-3 text-red-500 mr-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {errors.password && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {formData.confirmPassword && formData.password === formData.confirmPassword && (
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <Check className="h-4 w-4 mr-1" />
            Passwords match
          </p>
        )}
        {errors.confirmPassword && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h3>
      
      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors.country ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            {countries.map(country => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        {errors.country && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.country}</p>}
      </div>

      {/* State/Region */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State/Region {formData.country === 'Malaysia' && '*'}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          {formData.country === 'Malaysia' ? (
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              {malaysianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
                errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter state/region"
            />
          )}
        </div>
        {errors.state && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.state}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your city"
          />
        </div>
        {errors.city && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.city}</p>}
      </div>

      {/* Full Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Delivery Address *
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors resize-none ${
            errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Enter your complete delivery address including street name, building number, unit number, etc."
        />
        {errors.address && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.address}</p>}
      </div>

      {/* Postal Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Postal Code *
        </label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
            errors.postalCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={formData.country === 'Malaysia' ? '12345' : 'Enter postal code'}
        />
        {errors.postalCode && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.postalCode}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Health & Consent</h3>
      
      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            onBlur={handleBlur}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 10)).toISOString().split('T')[0]}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors ${
              errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1 flex items-center"><X className="h-4 w-4 mr-1" />{errors.dateOfBirth}</p>}
      </div>

      {/* Medical Declaration */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="medicalDeclaration"
            checked={formData.medicalDeclaration}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="mt-1 h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-900 cursor-pointer">
              Medical Declaration *
            </label>
            <p className="text-sm text-gray-600 mt-1">
              I declare that I am medically fit to participate in diving activities and have no medical conditions that would prevent me from safely diving.
            </p>
          </div>
        </div>
        {errors.medicalDeclaration && <p className="text-red-600 text-sm mt-2 flex items-center"><X className="h-4 w-4 mr-1" />{errors.medicalDeclaration}</p>}
      </div>

      {/* Terms & Conditions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="mt-1 h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-900 cursor-pointer">
              Terms & Conditions Agreement *
            </label>
            <p className="text-sm text-gray-600 mt-1">
              I agree to the{' '}
              <a href="/terms" className="text-ocean-600 hover:text-ocean-700 underline" target="_blank">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-ocean-600 hover:text-ocean-700 underline" target="_blank">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
        {errors.termsAccepted && <p className="text-red-600 text-sm mt-2 flex items-center"><X className="h-4 w-4 mr-1" />{errors.termsAccepted}</p>}
      </div>

      {/* Promotional Emails */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          name="promotionalEmails"
          checked={formData.promotionalEmails}
          onChange={handleInputChange}
          className="mt-1 h-4 w-4 text-ocean-600 focus:ring-ocean-500 border-gray-300 rounded"
        />
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-900 cursor-pointer">
            Promotional Emails (Optional)
          </label>
          <p className="text-sm text-gray-600 mt-1">
            I would like to receive promotional emails about new products, special offers, and diving tips.
          </p>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Optional Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral Code
            </label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
              placeholder="Enter referral code"
            />
          </div>

          {/* Membership ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Membership ID
            </label>
            <input
              type="text"
              name="membershipId"
              value={formData.membershipId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
              placeholder="Legacy member ID"
            />
          </div>
        </div>
      </div>

      {/* CAPTCHA Simulation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center">
              {captchaVerified && <Check className="h-4 w-4 text-green-600" />}
            </div>
            <span className="text-sm font-medium text-gray-900">
              I'm not a robot
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCaptchaVerified(!captchaVerified)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              captchaVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {captchaVerified ? 'Verified' : 'Verify'}
          </button>
        </div>
        {errors.captcha && <p className="text-red-600 text-sm mt-2 flex items-center"><X className="h-4 w-4 mr-1" />{errors.captcha}</p>}
      </div>
    </div>
  );

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Accounts Panel */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-ocean-600" />
              Demo Accounts
            </h3>
            <p className="text-gray-600 mb-4">
              Use these demo accounts to explore different user roles and permissions:
            </p>
            <div className="space-y-3">
              {demoAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{account.email}</div>
                    <div className="text-sm text-gray-600">{account.department}</div>
                  </div>
                  <Badge 
                    variant={account.role === 'Admin' ? 'error' : account.role === 'Manager' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {account.role}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-ocean-50 rounded-lg">
              <p className="text-sm text-ocean-800">
                <strong>Password for all accounts:</strong> password
              </p>
            </div>
          </Card>

          {/* Login Form */}
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">STG</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to access your dive gear paradise</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {errors.general}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-ocean-600 to-ocean-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-ocean-700 hover:to-ocean-800 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Signing In...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?
                <button
                  onClick={() => setIsLogin(false)}
                  className="ml-2 text-ocean-600 hover:text-ocean-700 font-semibold transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">STG</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join STG Today</h1>
          <p className="text-gray-600 mt-2">Create your account and start your diving journey</p>
        </div>

        <Card className="p-8">
          {/* Step Indicator */}
          {renderStepIndicator()}

          <form onSubmit={handleRegister}>
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-6 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {errors.general}
              </div>
            )}

            {/* Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !captchaVerified}
                  className="px-6 py-3 bg-gradient-to-r from-ocean-600 to-ocean-700 text-white rounded-lg hover:from-ocean-700 hover:to-ocean-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Toggle to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?
              <button
                onClick={() => setIsLogin(true)}
                className="ml-2 text-ocean-600 hover:text-ocean-700 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}