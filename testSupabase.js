import { supabase } from "./src/supabase/supabase.js";

async function getEntries() {
  const { data, error } = await supabase.from("entries").select();
  console.log("error:", error);
  return data;
}

const data = await getEntries();

console.log(data);
console.log("done");
