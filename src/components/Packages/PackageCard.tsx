import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import { DivePackage } from '../../types';

interface PackageCardProps {
  package: DivePackage;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'fun-diving':
        return 'bg-blue-100 text-blue-800';
      case 'open-water':
        return 'bg-green-100 text-green-800';
      case 'advanced-open-water':
        return 'bg-orange-100 text-orange-800';
      case 'rescue-diver':
        return 'bg-red-100 text-red-800';
      case 'divemaster':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={pkg.images[0]}
          alt={pkg.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(pkg.level)}`}>
            {pkg.level.replace('-', ' ').toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pkg.difficulty)}`}>
            {pkg.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          <Link to={`/packages/${pkg.id}`} className="hover:text-ocean-600 transition-colors">
            {pkg.name}
          </Link>
        </h3>

        <div className="flex items-center space-x-1 text-gray-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{pkg.location}</span>
        </div>

        <div className="flex items-center space-x-1 text-gray-600 mb-2">
          <Star className="h-4 w-4" />
          <span className="text-sm">{pkg.diveCenterPartner}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{pkg.duration} days</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{pkg.minParticipants}-{pkg.maxParticipants}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-ocean-600">
            RM {pkg.price.toFixed(2)}
          </div>
          <Link
            to={`/packages/${pkg.id}`}
            className="bg-ocean-600 text-white py-2 px-4 rounded-lg hover:bg-ocean-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}