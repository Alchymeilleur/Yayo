'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/types';
import { useState } from 'react';
import { listingsService } from '@/services/listings';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async () => {
    setIsLoading(true);
    try {
      if (isFavorited) {
        await listingsService.removeFromFavorite(listing.id);
      } else {
        await listingsService.addToFavorite(listing.id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Failed to update favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const primaryPhoto = listing.photos?.find((p) => p.is_primary) || listing.photos?.[0];

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.photo_url}
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleFavorite();
            }}
            disabled={isLoading}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg"
          >
            <svg
              className={`w-5 h-5 ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
              fill={isFavorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-dark mb-2 line-clamp-2">
            {listing.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {listing.city}
            {listing.neighborhood && `, ${listing.neighborhood}`}
          </div>

          {/* Price and Category */}
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-primary">
              {listing.currency} {listing.price.toLocaleString()}
            </div>
            {listing.category && (
              <span className="text-xs bg-light text-dark px-2 py-1 rounded">
                {listing.category.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
