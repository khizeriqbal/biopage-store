const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://jtsdmuoqbkliiasdnhmh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0c2RtdW9xYmtsaWlhc2RuaG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Njg3MTgsImV4cCI6MjA5MTM0NDcxOH0.VvjTiwA3dBOAIm7VI9dHVF8gFTS-8XUc0MBbgCjdclI";
const email = "khizeriqbal75@gmail.com";

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAdmin() {
  try {
    console.log("🔍 Looking up user:", email);
    
    // Try lowercase table name
    let { data: users, error } = await supabase
      .from('user')
      .select('id, email, role')
      .eq('email', email);

    if (error) {
      console.log("📋 Trying different table naming...");
      // Try with User (capitalized)
      const response = await supabase
        .from('User')
        .select('id, email, role')
        .eq('email', email);
      users = response.data;
      error = response.error;
    }

    if (error) {
      console.error("❌ Query error:", error.message);
      return;
    }

    if (!users || users.length === 0) {
      console.error("❌ User not found:", email);
      console.log("📝 The user might not exist yet. Please sign up first at: https://biopage.store");
      return;
    }

    const user = users[0];
    console.log("✅ Found user:", user.id, "-", user.email);

    // Update user to superadmin
    const { data: updatedUser, error: updateError } = await supabase
      .from('user')
      .update({
        role: 'superadmin',
        isAdmin: true
      })
      .eq('id', user.id)
      .select();

    if (updateError && updateError.message.includes("Could not find the table")) {
      const response = await supabase
        .from('User')
        .update({
          role: 'superadmin',
          isAdmin: true
        })
        .eq('id', user.id)
        .select();
      
      if (response.error) {
        console.error("❌ Update error:", response.error);
        return;
      }

      console.log("\n✅ SUCCESS! User is now SUPERADMIN");
      console.log("📊 Updated user:", response.data[0]);
    } else if (updateError) {
      console.error("❌ Update error:", updateError);
      return;
    } else {
      console.log("\n✅ SUCCESS! User is now SUPERADMIN");
      console.log("📊 Updated user:", updatedUser[0]);
    }
    
    console.log("\n🎉 You can now access the admin panel at: https://biopage.store/admin");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

makeAdmin();
