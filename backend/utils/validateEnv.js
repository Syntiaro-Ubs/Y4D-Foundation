/**
 * Environment Variable Validation
 * Validates all required and optional environment variables on startup
 */

const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET'
];

const optionalEnvVars = {
  DB_PORT: { default: '3306', type: 'number' },
  DB_CONNECTION_LIMIT: { default: '20', type: 'number' },
  DB_SSL: { default: 'false', type: 'boolean' },
  DB_SSL_REJECT_UNAUTHORIZED: { default: 'true', type: 'boolean' },
  PORT: { default: '5000', type: 'number' },
  NODE_ENV: { default: 'development', type: 'string' },
  API_BASE_URL: { default: 'http://localhost:5000', type: 'string' },
  ALLOWED_ORIGINS: { default: 'http://localhost:3000,http://localhost:5173', type: 'string' }
};

/**
 * Validate and set default values for environment variables
 */
function validateEnv() {
  const errors = [];
  const warnings = [];

  // Check required environment variables
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    errors.push(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate required variables have values
  requiredEnvVars.forEach(varName => {
    if (process.env[varName] && process.env[varName].trim() === '') {
      errors.push(`Required environment variable ${varName} is empty`);
    }
  });

  // Set defaults for optional variables and validate types
  Object.keys(optionalEnvVars).forEach(varName => {
    const config = optionalEnvVars[varName];
    
    if (!process.env[varName]) {
      process.env[varName] = config.default;
    } else {
      // Validate type
      if (config.type === 'number') {
        const numValue = parseInt(process.env[varName]);
        if (isNaN(numValue)) {
          warnings.push(`Invalid number for ${varName}, using default: ${config.default}`);
          process.env[varName] = config.default;
        } else {
          process.env[varName] = numValue.toString();
        }
      } else if (config.type === 'boolean') {
        const value = process.env[varName].toLowerCase();
        if (value !== 'true' && value !== 'false' && value !== '1' && value !== '0') {
          warnings.push(`Invalid boolean for ${varName}, using default: ${config.default}`);
          process.env[varName] = config.default;
        } else {
          process.env[varName] = (value === 'true' || value === '1') ? 'true' : 'false';
        }
      }
    }
  });

  // Production-specific validations
  if (process.env.NODE_ENV === 'production') {
    // Warn if using default JWT_SECRET in production
    if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_in_production' || 
        process.env.JWT_SECRET === 'your_jwt_secret_here' ||
        process.env.JWT_SECRET.length < 32) {
      warnings.push('⚠️  WARNING: JWT_SECRET should be a strong, unique secret (at least 32 characters) in production!');
    }

    // Warn if using default database credentials
    if (process.env.DB_USER === 'your_db_user' || 
        process.env.DB_PASSWORD === 'your_db_password') {
      warnings.push('⚠️  WARNING: Using default database credentials in production is not recommended!');
    }

    // Warn if SSL is disabled
    if (process.env.DB_SSL !== 'true') {
      warnings.push('⚠️  WARNING: Database SSL is disabled in production. Consider enabling it for security.');
    }
  }

  // Display warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Environment Variable Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
    console.log('');
  }

  // Display errors and exit if any
  if (errors.length > 0) {
    console.error('\n❌ Environment Variable Validation Failed:\n');
    errors.forEach(error => console.error(`   ${error}`));
    console.error('\n📝 Setup Instructions:');
    console.error('   1. Create a .env file in the backend directory');
    console.error('   2. Copy the example from .env.example (if available)');
    console.error('   3. Set the following required variables:');
    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        const example = varName === 'JWT_SECRET' 
          ? 'your_super_secret_jwt_key_change_in_production'
          : varName === 'DB_HOST'
          ? 'localhost'
          : varName === 'DB_USER'
          ? 'your_db_user'
          : varName === 'DB_PASSWORD'
          ? 'your_db_password'
          : varName === 'DB_NAME'
          ? 'y4d_dashboard'
          : 'your_value';
        console.error(`      ${varName}=${example}`);
      }
    });
    console.error('\n💡 Quick Setup:');
    console.error('   Create backend/.env with:');
    console.error('   DB_HOST=localhost');
    console.error('   DB_USER=your_db_user');
    console.error('   DB_PASSWORD=your_db_password');
    console.error('   DB_NAME=y4d_dashboard');
    console.error('   JWT_SECRET=your_super_secret_jwt_key_change_in_production');
    console.error('\n');
    process.exit(1);
  }

  // Display success message in development
  if (process.env.NODE_ENV !== 'production') {
    // Use console.log directly here since this runs before logger is available
    console.log('✅ Environment variables validated successfully');
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    console.log(`   Server Port: ${process.env.PORT}`);
  }
}

/**
 * Get environment variable with validation
 */
function getEnv(varName, defaultValue = null) {
  const value = process.env[varName];
  
  if (value === undefined || value === null) {
    if (defaultValue !== null) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${varName} is not set`);
  }
  
  return value;
}

/**
 * Check if running in production
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
function isDevelopment() {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

module.exports = {
  validateEnv,
  getEnv,
  isProduction,
  isDevelopment
};

