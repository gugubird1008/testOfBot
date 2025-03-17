import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function handleIssue() {
  try {
    const eventPayload = process.env.GITHUB_EVENT_PATH
      ? await import(process.env.GITHUB_EVENT_PATH)
      : { payload: {} };
    const issue = eventPayload.payload.issue;
    const owner = eventPayload.payload.repository.owner.login;
    const repo = eventPayload.payload.repository.name;
    const issueNumber = issue.number;

    console.log("Processing issue:", issueNumber);

    const response = `
Thank you for your issue! 🎉

Our bot is processing your request. Please provide the following information:
1. Have you prepared enough tokens for sector pledge?
2. Why are you applying for a total of 10 PiB DataCap, and how can you prove that each data piece has 1 PiB?
3. Can you ensure that the SPs' Spark retrieval rates meet the fil-plus rules?
4. Please send your identity information to example@email.com for our review.

We will get back to you soon!
    `;

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
