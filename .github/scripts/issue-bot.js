import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function handleIssue() {
  try {
    console.log("Starting handleIssue...");

    // 读取 GitHub 事件数据
    const eventPath = process.env.GITHUB_EVENT_PATH;
    console.log("Event path:", eventPath);
    if (!eventPath) {
      throw new Error("GITHUB_EVENT_PATH is undefined");
    }

    const eventPayload = await import(eventPath, { assert: { type: "json" } }).then((module) => module.default);
    console.log("Event payload:", JSON.stringify(eventPayload, null, 2));

    const issue = eventPayload.issue;
    if (!issue) {
      throw new Error("No issue data found in event payload");
    }
    const owner = eventPayload.repository.owner.login;
    const repo = eventPayload.repository.name;
    const issueNumber = issue.number;

    console.log(`Processing issue #${issueNumber} in ${owner}/${repo}`);

    const response = `
Thank you for your issue! 🎉

Our bot is processing your request. Please provide the following information:
1. Have you prepared enough tokens for sector pledge?
2. Why are you applying for a total of 10 PiB DataCap, and how can you prove that each data piece has 1 PiB?
3. Can you ensure that the SPs' Spark retrieval rates meet the fil-plus rules?
4. Please send your identity information to example@email.com for our review.

We will get back to you soon!
    `;

    console.log("Attempting to post comment...");
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: response,
    });
    console.log(`Successfully replied to issue #${issueNumber}`);
  } catch (error) {
    console.error("Error in handleIssue:", error.message);
    throw error;
  }
}

handleIssue().catch((error) => {
  console.error("Script execution failed:", error);
  process.exit(1);
});
