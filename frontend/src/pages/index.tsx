'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Home, Your Way</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover the easiest way to rent and list properties in Congo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/listings"
              className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Listings
            </Link>
            {!user && (
              <Link
                href="/auth/register"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition"
              >
                Start Listing
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Yayo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Easy Listings</h3>
              <p className="text-gray-600">
                List your property in minutes with our simple and intuitive
                process.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Your data is protected with the highest security standards.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Direct Contact</h3>
              <p className="text-gray-600">
                Connect with renters and landlords directly through our
                messaging system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Housing', emoji: '🏢' },
              { name: 'Vehicles', emoji: '🚗' },
              { name: 'Equipment', emoji: '🔧' },
              { name: 'Events', emoji: '🎉' },
              { name: 'Electronics', emoji: '📱' },
              { name: 'Others', emoji: '📦' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/listings?category=${category.name.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of users already renting on Yayo</p>
          {!user && (
            <Link
              href="/auth/register"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Account Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
