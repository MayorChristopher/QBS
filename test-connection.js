// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rmeavhykhhteivbfvbnf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZWF2aHlraGh0ZWl2YmZ2Ym5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzEzNjEsImV4cCI6MjA3MTMwNzM2MX0.EsqCehdy66Af00qlsRpGlLVBaPuax2f_3mbRidlGqxk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    if (error) {
      console.log('Database error:', error.message)
    } else {
      console.log('Connection successful!')
      console.log('Data:', data)
    }
  } catch (err) {
    console.log('Connection failed:', err.message)
  }
}

testConnection()