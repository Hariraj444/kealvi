// Using Gemini API directly via fetch
export const genai = {
  getGenerativeModel: (config: { model: string }) => ({
    generateContent: async (prompt: string) => {
      console.log("GEMINI KEY:", process.env.GEMINI_API_KEY?.slice(0, 10));
      console.log("MODEL:", config.model);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API error details:", errorData);
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}. ${
            errorData?.error?.message || ""
          }`
        );
      }

      const data = await response.json();
      return {
        response: {
          text: () =>
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "",
        },
      };
    },
  }),
};