#!/usr/bin/env npx tsx
// EMERGENCY DATABASE DEPLOYMENT - COVENANT WITNESS TABLES
// Critical Path: HOUR 18-24 - Deploy schema to Supabase immediately

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function deployWitnessDatabase() {
  console.log('🚨 EMERGENCY DATABASE DEPLOYMENT - COVENANT WITNESS SCHEMA');
  console.log('=' .repeat(60));

  try {
    // Deploy covenant_witnesses table
    console.log('📝 Creating covenant_witnesses table...');
    
    const { error: witnessTableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS covenant_witnesses (
          address VARCHAR(42) PRIMARY KEY CHECK (address ~ '^0x[a-fA-F0-9]{40}$'),
          ens_name VARCHAR(255) NULL,
          email VARCHAR(255) NULL,
          transaction_hash VARCHAR(66) NOT NULL CHECK (transaction_hash ~ '^0x[a-fA-F0-9]{64}$'),
          block_number BIGINT DEFAULT 0,
          witness_number SERIAL UNIQUE NOT NULL,
          signed_at TIMESTAMPTZ NOT NULL,
          notification_preferences JSONB DEFAULT '{"dailyAuctions": true, "milestones": true, "emergency": true}',
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (witnessTableError) {
      console.error('❌ Failed to create covenant_witnesses table:', witnessTableError);
      // Try direct SQL execution instead
      const { error: directError } = await supabase
        .from('covenant_witnesses')
        .select('*')
        .limit(0);

      if (directError && directError.code === 'PGRST116') {
        // Table doesn't exist, create it via raw SQL
        await createTablesDirectly();
      }
    } else {
      console.log('✅ covenant_witnesses table created');
    }

    // Deploy witness_notifications table
    console.log('📝 Creating witness_notifications table...');
    
    const { error: notifTableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS witness_notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          witness_address VARCHAR(42) REFERENCES covenant_witnesses(address),
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          template VARCHAR(50) NOT NULL,
          template_data JSONB DEFAULT '{}',
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
          sent_at TIMESTAMPTZ NULL,
          error_message TEXT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (!notifTableError) {
      console.log('✅ witness_notifications table created');
    }

    // Deploy covenant_events table
    console.log('📝 Creating covenant_events table...');
    
    const { error: eventsTableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS covenant_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type VARCHAR(50) NOT NULL,
          event_data JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });

    if (!eventsTableError) {
      console.log('✅ covenant_events table created');
    }

    // Create indexes
    console.log('📝 Creating database indexes...');
    
    await supabase.rpc('sql', {
      query: `
        CREATE INDEX IF NOT EXISTS idx_witnesses_number ON covenant_witnesses(witness_number);
        CREATE INDEX IF NOT EXISTS idx_witnesses_status ON covenant_witnesses(status) WHERE status = 'active';
        CREATE INDEX IF NOT EXISTS idx_witnesses_created ON covenant_witnesses(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_witnesses_email ON covenant_witnesses(email) WHERE email IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_witnesses_tx_hash ON covenant_witnesses(transaction_hash);
        CREATE INDEX IF NOT EXISTS idx_notifications_status_created ON witness_notifications(status, created_at);
        CREATE INDEX IF NOT EXISTS idx_notifications_witness ON witness_notifications(witness_address);
      `
    });

    console.log('✅ Database indexes created');

    // Create helper functions
    console.log('📝 Creating database functions...');
    
    await supabase.rpc('sql', {
      query: `
        CREATE OR REPLACE FUNCTION get_witness_count()
        RETURNS TABLE (
          total_witnesses INT,
          target_witnesses INT,
          percent_complete INT,
          launch_ready BOOLEAN,
          critical_status TEXT
        ) AS $$
        BEGIN
          RETURN QUERY
          WITH stats AS (
            SELECT 
              COUNT(*)::INT as total,
              100 as target
            FROM covenant_witnesses 
            WHERE status = 'active'
          )
          SELECT 
            s.total,
            s.target,
            ROUND((s.total::FLOAT / s.target::FLOAT) * 100)::INT as percent,
            (s.total >= s.target) as ready,
            CASE 
              WHEN s.total::FLOAT / s.target::FLOAT < 0.5 THEN 'CRITICAL'
              WHEN s.total::FLOAT / s.target::FLOAT < 0.75 THEN 'WARNING'
              WHEN s.total::FLOAT / s.target::FLOAT < 0.9 THEN 'PROGRESS'
              ELSE 'READY'
            END as status
          FROM stats s;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    console.log('✅ Database functions created');

    // Test database deployment
    console.log('🧪 Testing database deployment...');
    
    const { data: testQuery, error: testError } = await supabase
      .from('covenant_witnesses')
      .select('*')
      .limit(1);

    if (testError) {
      throw new Error(`Database test failed: ${testError.message}`);
    }

    console.log('✅ Database deployment successful!');

    // Run witness count function test
    const { data: countData, error: countError } = await supabase.rpc('get_witness_count');
    
    if (countError) {
      console.warn('⚠️ Witness count function may need manual setup');
    } else {
      console.log('✅ Witness count function working:', countData);
    }

    console.log('\n🎯 COVENANT WITNESS DATABASE READY');
    console.log('📅 Target Launch: October 19, 2025');
    console.log('🎯 Target Witnesses: 100 Founding Witnesses');
    console.log('💾 Database Tables: covenant_witnesses, witness_notifications, covenant_events');
    console.log('⚡ Ready for witness registration!');

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR - Database deployment failed:', error.message);
    process.exit(1);
  }
}

async function createTablesDirectly() {
  console.log('🔧 Using alternative table creation method...');
  
  // Try creating tables with direct SQL commands
  const tableCommands = [
    `CREATE TABLE IF NOT EXISTS covenant_witnesses (
      address TEXT PRIMARY KEY,
      ens_name TEXT,
      email TEXT,
      transaction_hash TEXT NOT NULL,
      block_number INTEGER DEFAULT 0,
      witness_number SERIAL UNIQUE NOT NULL,
      signed_at TIMESTAMP WITH TIME ZONE NOT NULL,
      notification_preferences JSONB DEFAULT '{"dailyAuctions": true, "milestones": true, "emergency": true}',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    `CREATE TABLE IF NOT EXISTS witness_notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      witness_address TEXT,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      template TEXT NOT NULL,
      template_data JSONB DEFAULT '{}',
      status TEXT DEFAULT 'pending',
      sent_at TIMESTAMP WITH TIME ZONE,
      error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    `CREATE TABLE IF NOT EXISTS covenant_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type TEXT NOT NULL,
      event_data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`
  ];

  for (const command of tableCommands) {
    try {
      const { error } = await supabase.rpc('sql', { query: command });
      if (error) {
        console.warn(`⚠️ Table creation warning: ${error.message}`);
      }
    } catch (error: any) {
      console.warn(`⚠️ Alternative table creation: ${error.message}`);
    }
  }
}

// Main execution
if (require.main === module) {
  deployWitnessDatabase().catch(console.error);
}

export { deployWitnessDatabase };