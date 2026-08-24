const analyzeWithLLM = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert technical recruiter.

Compare the candidate's resume with the job description.

Evaluate the candidate based ONLY on the information provided.

Consider:
1. Technical skills
2. Relevant project experience
3. Work experience
4. Education
5. Technologies and tools
6. Overall relevance to the job

IMPORTANT:
- Do not invent experience, skills, companies, education, or achievements.
- Consider semantic similarity, not just exact keyword matching.
- Give a realistic score from 1 to 10.
- Return ONLY valid JSON.
- Do not use markdown code fences.

Return exactly this JSON structure:

{
  "matchScore": 1,
  "justification": "short professional explanation",
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ]
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 800,
        response_format: {
          type: "json_object",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Groq API error:", errorText);

    throw new Error(`Groq API request failed: ${response.status}`);
  }

  const data = await response.json();

  const output = data.choices?.[0]?.message?.content?.trim();

  if (!output) {
    console.error("Groq returned no output:", JSON.stringify(data, null, 2));

    throw new Error("Groq returned no output");
  }

  try {
    return JSON.parse(output);
  } catch (error) {
    console.error("Groq JSON parsing error:", output);

    throw new Error("Groq returned invalid JSON");
  }
};

module.exports = analyzeWithLLM;
