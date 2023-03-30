const { Toolkit } = require('actions-toolkit');
const { Octokit } = require('@octokit/rest');

Toolkit.run(async (tools) => {
  // Get information about the repository
  const { owner, repo } = tools.context.repo;

  // Initialize the Octokit REST API client
  const octokit = new Octokit({ auth: `token ${process.env.GITHUB_TOKEN}` });

  // Get the contents of the repository
  const { data } = await octokit.repos.getContent({ owner, repo, path: '' });

  // Filter the contents to include only C++ files
  const cppFiles = data.filter(file => file.name.endsWith('.cpp'));

  // Update the README file with the number of C++ files
  const readmeContent = `This repository contains ${cppFiles.length} C++ files.`;
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'README.md',
    message: 'Update README',
    content: Buffer.from(readmeContent).toString('base64'),
    sha: tools.context.payload.head_commit.id
  });

  tools.log.success(`Updated README with ${cppFiles.length} C++ files`);
});
