const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function handleIssue() {
  const { payload } = process.env.GITHUB_EVENT_PATH
    ? require(process.env.GITHUB_EVENT_PATH)
    : { payload: {} };
  const issue = payload.issue;
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;
  const issueNumber = issue.number;

  // 自定义回复逻辑
  const response = `
Thank you for your issue! 🎉

Our bot is processing your request. Please provide the following information:
1. Have you prepared enough tokens for sector pledge?
2. Why are you applying for a total of 10 PiB DataCap, and how can you prove that each data piece has 1 PiB?
3. Can you ensure that the SPs' Spark retrieval rates meet the fil-plus rules?
4. Please send your identity information to example@email.com for our review.

We will get back to you soon!
  `;

  try {
    // 回复 Issue
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: response,
    });
    console.log(`Replied to issue #${issueNumber}`);
  } catch (error) {
    console.error("Error replying to issue:", error);
  }
}

handleIssue();
