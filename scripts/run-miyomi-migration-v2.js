const { createClient } = require('@supabase/supabase-js')

async function runMigration() {
  // Initialize Supabase client with service key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    console.log('Running MIYOMI migration...')
    
    // Create enums first
    console.log('Creating enums...')
    
    // Create market_platform enum
    const { error: platformEnum } = await supabase.rpc('exec', {
      sql: `DO $$ BEGIN
        CREATE TYPE market_platform AS ENUM ('KALSHI', 'POLYMARKET', 'MANIFOLD', 'MELEE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`
    })
    
    // Create market_position enum  
    const { error: positionEnum } = await supabase.rpc('exec', {
      sql: `DO $$ BEGIN
        CREATE TYPE market_position AS ENUM ('YES', 'NO');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`
    })
    
    // Create pick_status enum
    const { error: statusEnum } = await supabase.rpc('exec', {
      sql: `DO $$ BEGIN
        CREATE TYPE pick_status AS ENUM ('PENDING', 'WIN', 'LOSS', 'LIVE', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`
    })

    console.log('Creating miyomi_picks table...')
    
    // Create miyomi_picks table
    const { error: picksTable } = await supabase.rpc('exec', {
      sql: `CREATE TABLE IF NOT EXISTS miyomi_picks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        market TEXT NOT NULL,
        platform market_platform NOT NULL,
        position market_position NOT NULL,
        confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
        edge DECIMAL(3,2) CHECK (edge >= -1 AND edge <= 1),
        entry_odds DECIMAL(5,2) NOT NULL,
        current_odds DECIMAL(5,2),
        exit_odds DECIMAL(5,2),
        status pick_status NOT NULL DEFAULT 'PENDING',
        category TEXT,
        video_url TEXT,
        analysis_url TEXT,
        reasoning JSONB,
        tags TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ,
        pnl DECIMAL(10,2),
        roi DECIMAL(5,2)
      )`
    })

    if (picksTable) {
      console.log('Picks table error:', picksTable)
    } else {
      console.log('✅ miyomi_picks table created')
    }

    console.log('Creating indexes...')
    
    // Create indexes
    await supabase.rpc('exec', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_miyomi_picks_timestamp ON miyomi_picks(timestamp DESC)'
    })
    
    await supabase.rpc('exec', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_miyomi_picks_status ON miyomi_picks(status)'
    })
    
    await supabase.rpc('exec', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_miyomi_picks_platform ON miyomi_picks(platform)'
    })

    console.log('Setting up RLS policies...')
    
    // Enable RLS
    await supabase.rpc('exec', {
      sql: 'ALTER TABLE miyomi_picks ENABLE ROW LEVEL SECURITY'
    })
    
    // Create policies
    await supabase.rpc('exec', {
      sql: `CREATE POLICY IF NOT EXISTS "Public read access for miyomi_picks" ON miyomi_picks
        FOR SELECT USING (true)`
    })
    
    await supabase.rpc('exec', {
      sql: `CREATE POLICY IF NOT EXISTS "Service role write access for miyomi_picks" ON miyomi_picks
        FOR ALL USING (auth.role() = 'service_role')`
    })

    console.log('✅ MIYOMI migration completed successfully!')
    
    // Test the table
    const { data: testData, error: testError } = await supabase
      .from('miyomi_picks')
      .select('count')
      .single()
    
    if (!testError) {
      console.log('✅ miyomi_picks table is accessible')
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()