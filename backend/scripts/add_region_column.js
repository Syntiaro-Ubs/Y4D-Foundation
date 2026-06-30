const db = require('../config/database');
require('dotenv').config();

// List of all content tables that need the 'region' column
const tables = [
    // Banners
    'banners',

    // Media Corner
    'blogs',
    'stories',
    'newsletters',
    'events',
    'documentaries',

    // Interventions (Our Work)
    'quality_education',
    'livelihood',
    'healthcare',
    'environment_sustainability',
    'integrated_development',

    // Team
    'board_trustees',
    'management',
    'mentors',

    // Other dynamic sections
    'impact_data',
    'careers',
    'reports'
];

async function runMigration() {
    console.log(`🚀 Starting Database Migration: Adding 'region' column...`);

    try {
        console.log('✅ Connected to database pool.');

        for (const table of tables) {
            try {
                // Check if the column exists first
                const [columns] = await db.query(`SHOW COLUMNS FROM ${table} LIKE 'region'`);

                if (columns.length > 0) {
                    console.log(`⏭️ Column 'region' already exists in table '${table}'. Skipping.`);
                } else {
                    // Add the column
                    const alterQuery = `ALTER TABLE ${table} ADD COLUMN region ENUM('india', 'global', 'both') NOT NULL DEFAULT 'both'`;
                    await db.query(alterQuery);
                    console.log(`✅ Added 'region' column to table '${table}'.`);
                }
            } catch (err) {
                // Table might not exist, skip gracefully
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    console.log(`⚠️ Table '${table}' does not exist in DB. Skipping.`);
                } else {
                    console.error(`❌ Error updating table '${table}':`, err.message);
                }
            }
        }

        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    } finally {
        process.exit(0);
    }
}

runMigration();
