
import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";
import { performance } from "node:perf_hooks";

export const agent = async (req, res, next) => {
  const start = performance.now();

  const logTime = (step, stepStart) => {
    console.log(
      `[Agent Timing] ${step}: ${(performance.now() - stepStart).toFixed(2)} ms`
    );
  };

  console.log("[Agent] Request started");

  try {
    const { prompt, conversationId, agent: selectedAgent } = req.body;
    const userId = req.headers["x-user-id"];
    const file = req.file;

    // 1. Save user message to chat service
    let stepStart = performance.now();

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      content: prompt,
      role: "user",
      conversationId,
    });

    logTime("Save user message", stepStart);

    // 2. Execute graph / LLM
    stepStart = performance.now();

    const result = await graph.invoke({
      prompt,
      conversationId,
      agent: selectedAgent,
      file,
      userId,
    });

    logTime("Graph / LLM execution", stepStart);

    const response = result?.aiResponse;

    // 3. Save memory messages
    stepStart = performance.now();

    await addMessage(conversationId, "user", prompt);
    await addMessage(conversationId, "assistant", response);

    logTime("Save memory messages", stepStart);

    // 4. Save assistant response to chat service
    stepStart = performance.now();

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      content: response,
      role: "assistant",
      conversationId,
      images: result?.images,
      artifacts: result?.artifacts,
    });

    logTime("Save assistant message", stepStart);

    // 5. Total request processing time
    console.log(
      `[Agent Timing] TOTAL: ${(performance.now() - start).toFixed(2)} ms`
    );

    return res.status(200).json({
      answer: response,
      images: result?.images,
      artifacts: result?.artifacts,
    });
  } catch (error) {
    console.error(
      `[Agent Timing] Failed after ${(performance.now() - start).toFixed(2)} ms`,
      error.message
    );

    next(error);
  }
};
