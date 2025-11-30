import { supabase } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["name", "province", "addres", "description"];
    for (const field of required) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `${field} is required` }),
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("dealer")
      .insert({
        name: body.name,
        province: body.province,
        description: body.description,
        addres: body.addres,
        phone: body.phone || null,
        image: body.image || null,// JSON enviado desde Cloudinary
        category_card: body.category_card || null,
        social_media: body.social_media || null, 
      })
      .select()
      .single();

    if (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(data), { status: 201 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
