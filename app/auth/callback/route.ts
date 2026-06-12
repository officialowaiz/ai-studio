import { NextResponse } from 'next/server';

export const maxDuration = 60; // Gives Vercel up to 60 seconds to process the AI generation

export async function POST(request: Request) {
  try {
    // 1. Extract inputs from the frontend request
    const { sourceImage, styleReference, stylePrompt, aspectRatio } = await request.json();

    console.log("Routing generation to Hugging Face Free Inference API...");

    // 2. Your Master Motorcycle Background Prompt
    const baseMotorcyclePrompt = "A cinematic, low-angle photograph of a sleek, dark-themed retro cruiser motorcycle, styled like a Royal Enfield Hunter 350, parked on a wet asphalt road in an urban alleyway at dusk. The scene is illuminated by moody, diffused neon lights reflecting off the puddles. A stylish rider in a vintage leather jacket is leaning casually against the bike, looking out into the glowing city streets. Shot on 35mm film, anamorphic lens, volumetric lighting, photorealistic, cinematic color grading, highly detailed, 8k resolution.";

    // 3. Fuse the selected style prompt with the master motorcycle scene
    const finalFusedPrompt = `${stylePrompt || "Highly aesthetic portrait"}. ${baseMotorcyclePrompt}`;

    // 4. Using an open-source Stable Diffusion image-to-image model hosted free on Hugging Face
    const HF_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"; 
    const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

    // 5. Download the source image from your Supabase storage bucket and convert it to base64
    const imageFetch = await fetch(sourceImage);
    if (!imageFetch.ok) throw new Error("Failed to retrieve source image from storage");
    
    const arrayBuffer = await imageFetch.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    // 6. Trigger the Hugging Face serverless API using a unified JSON payload
    const response = await fetch(HF_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: finalFusedPrompt,
        parameters: {
          image: base64Image,
          strength: 0.75, // Adjusts how closely it keeps the original facial structure (0.0 to 1.0)
        }
      }),
    });

    // 7. Handle Potential Errors (including the Hugging Face "Cold Start" sleep cycle)
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Hugging Face Error:", errorData);

      if (response.status === 503) {
        return NextResponse.json(
          { error: "The free AI model is currently waking up! Please wait 20 seconds and try generating again." }, 
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: errorData?.error || "Hugging Face processing failed" }, 
        { status: response.status }
      );
    }

    // 8. Convert the resulting raw image binary back into a usable data URL for the frontend
    const outputBuffer = await response.arrayBuffer();
    const outputBase64 = Buffer.from(outputBuffer).toString('base64');
    const generatedDataUrl = `data:image/jpeg;base64,${outputBase64}`;

    return NextResponse.json({ generatedImageUrl: generatedDataUrl });

  } catch (error: any) {
    console.error("Free API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}