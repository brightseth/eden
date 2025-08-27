const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  // Initialize Supabase client with service key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250827071110_miyomi_launch.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('Running MIYOMI migration...')
    
    // Split SQL by statements and execute them
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 100)}...`)
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.error('Error executing statement:', error)
          throw error
        }
      }
    }

    console.log('✅ MIYOMI migration completed successfully!')
    
    // Verify tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', 'miyomi_%')
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError)
    } else {
      console.log('Created MIYOMI tables:', tables.map(t => t.table_name))
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()