import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

// Smart local fallback responses when API is missing
const getLocalResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes("who")) {
    return "Shreya is a passionate Full Stack Developer and AI Enthusiast who loves building scalable, intelligent digital products.";
  }
  if (msg.includes("project")) {
    return "She has built some incredible projects! You can explore them in the Projects section above. Her work focuses on modern web technologies and AI integrations.";
  }
  if (msg.includes("skill") || msg.includes("tech")) {
    return "Shreya's core stack includes React, Next.js, Node.js, Python, and MongoDB. She's also diving deep into AI and Machine Learning! Check out the Skills Galaxy for more details.";
  }
  if (msg.includes("contact") || msg.includes("reach") || msg.includes("hire")) {
    return "You can easily reach out to Shreya through the Contact section at the bottom of the page. She's always open to exciting new opportunities!";
  }
  if (msg.includes("unique")) {
    return "What makes Shreya unique is her ability to blend beautiful, cinematic UI design with robust, intelligent backend architecture.";
  }
  
  return "That's a great question! My live AI brain is currently in offline mode, but I can tell you that Shreya is a dedicated and creative developer. Feel free to explore the rest of the portfolio!";
};

export async function POST(req) {
  let messages = [];
  try {
    const body = await req.json();
    messages = body.messages || [];
    const latestMessage = messages[messages.length - 1].text;
    
    // If there's no API key, use our smart local fallback!
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      // Small delay to simulate AI typing
      await new Promise(resolve => setTimeout(resolve, 800));
      return new Response(JSON.stringify({ response: getLocalResponse(latestMessage) }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remove the initial hardcoded UI greeting if it exists to keep history clean
    let validMessages = [...messages];
    if (validMessages.length > 0 && validMessages[0].role === 'ai' && validMessages[0].text.includes("Hi! I'm the AI brain")) {
      validMessages = validMessages.slice(1);
    }

    // Format history for Groq
    const groqMessages = [
      {
        role: "system",
        content: "You are a personal portfolio AI assistant for Shreya Raut, a full-stack developer. Answer questions about her skills, projects, and experience in a confident, recruiter-friendly tone. Keep answers short, impressive, and impactful."
      },
      ...validMessages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama3-8b-8192",
      max_tokens: 200,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("AI Assistant Error:", error.message || error);
    
    // Fallback to local response if the API call fails
    const latestMsg = messages.length > 0 ? messages[messages.length - 1]?.text || "" : "";
    return new Response(JSON.stringify({ response: getLocalResponse(latestMsg) }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
