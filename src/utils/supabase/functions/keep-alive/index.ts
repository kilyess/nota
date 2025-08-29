import { createClient } from "@supabase/supabase-js";

async function main() {
  try {
    console.log("Supabase URL:", process.env.SUPABASE_URL);
    console.log("Supabase Key:", process.env.SUPABASE_ANON_KEY);

    const supabase = createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_ANON_KEY ?? "",
    );

    const { data, error } = await supabase.from("notes").select("id").limit(1);

    if (error) throw error;

    console.log("Ping successful:", data);
  } catch (err) {
    console.error("Error pinging Supabase:", err);
    process.exit(1);
  }
}

main();
