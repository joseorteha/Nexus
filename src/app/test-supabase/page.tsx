"use client";
import { supabase } from "../lib/supabase/client";

export default function TestPage() {
  async function test() {
    console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("SUPABASE KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10));

    const { data, error } = await supabase.from("usuarios").select("*").limit(1);
    console.log("DATA:", data);
    console.log("ERROR:", error);
  }

  return (
    <div>
      <button className="bg-red-300" onClick={test}>PROBAR SUPABASE</button>
    </div>
  );
}



