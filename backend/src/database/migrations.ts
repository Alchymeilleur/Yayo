import pool from './pool';

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database schema...');

    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        profile_picture_url TEXT,
        bio TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        category_id INTEGER NOT NULL REFERENCES categories(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'CDF',
        city VARCHAR(100) NOT NULL,
        neighborhood VARCHAR(100),
        address TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        status VARCHAR(50) DEFAULT 'active',
        is_featured BOOLEAN DEFAULT FALSE,
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS listing_photos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        photo_url TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID NOT NULL REFERENCES users(id),
        recipient_id UUID NOT NULL REFERENCES users(id),
        listing_id UUID REFERENCES listings(id),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reviewer_id UUID NOT NULL REFERENCES users(id),
        reviewed_user_id UUID NOT NULL REFERENCES users(id),
        listing_id UUID REFERENCES listings(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        listing_id UUID NOT NULL REFERENCES listings(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, listing_id)
      );

      CREATE TABLE IF NOT EXISTS reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reporter_id UUID NOT NULL REFERENCES users(id),
        listing_id UUID REFERENCES listings(id),
        reported_user_id UUID REFERENCES users(id),
        reason VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
      CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
      CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
      CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
    `;

    await pool.query(schema);
    console.log('✓ Database schema initialized successfully');
    
    await seedCategories();
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    throw error;
  }
};

const seedCategories = async () => {
  try {
    const categories = [
      { name: 'Housing', slug: 'housing', description: 'Apartments, houses, studios' },
      { name: 'Vehicles', slug: 'vehicles', description: 'Cars, motorcycles, bikes' },
      { name: 'Equipment', slug: 'equipment', description: 'Professional and construction equipment' },
      { name: 'Events', slug: 'events', description: 'Event spaces and equipment' },
      { name: 'Electronics', slug: 'electronics', description: 'Electronics and gadgets' },
      { name: 'Others', slug: 'others', description: 'Other items' },
    ];

    for (const cat of categories) {
      await pool.query(
        'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [cat.name, cat.slug, cat.description]
      );
    }
    console.log('✓ Categories seeded');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};