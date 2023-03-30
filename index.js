const core = require("@actions/core");
const { Toolkit } = require('actions-toolkit');
const fs = require("fs");
const { spawn } = require("child_process");

import { Octokit } from "@octokit/rest";

const owner = core.getInput("COMMIT_OWNER");
const repo = core.getInput("COMMIT_REPO");


  

//   const owner = 'kerong2002';
//   const repo = 'github_action';
  


async function countCppFiles(owner, repo) {
    try {
      const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  
      // Get all files in the repository
      const response = await octokit.repos.getContents({
        owner,
        repo,
        path: ''
      });
  
      let count = 0;
  
      // Find all files with extension '.cpp' and count them
      for (const item of response.data) {
        if (item.type === 'dir') {
          const folderResponse = await octokit.repos.getContents({
            owner,
            repo,
            path: item.path
          });
          for (const folderItem of folderResponse.data) {
            if (folderItem.type === 'file' && folderItem.name.endsWith('.cpp')) {
              count++;
            }
          }
        } else if (item.type === 'file' && item.name.endsWith('.cpp')) {
          count++;
        }
      }
  
      console.log(`Total number of .cpp files in the repository: ${count}`);
      return count;
    } catch (error) {
      console.error(error);
      core.setFailed(error.message);
    }
}

// yml input
const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
const COMMITTER_USERNAME = core.getInput("COMMITTER_USERNAME");
const COMMITTER_EMAIL = core.getInput("COMMITTER_EMAIL");
const COMMIT_MSG = core.getInput("COMMIT_MSG");

core.setSecret(GITHUB_TOKEN);

const baseUrl = "https://kerong2002.github.io";

const exec = (cmd, args = [], options = {}) =>
  new Promise((resolve, reject) => {
    let outputData = "";
    const optionsToCLI = {
      ...options,
    };
    if (!optionsToCLI.stdio) {
      Object.assign(optionsToCLI, { stdio: ["inherit", "inherit", "inherit"] });
    }
    const app = spawn(cmd, args, optionsToCLI);
    if (app.stdout) {
      // Only needed for pipes
      app.stdout.on("data", function (data) {
        outputData += data.toString();
      });
    }

    app.on("close", (code) => {
      if (code !== 0) {
        return reject({ code, outputData });
      }
      return resolve({ code, outputData });
    });
    app.on("error", () => reject({ code: 1, outputData }));
  });

const commitReadmeFile = async () => {
  await exec("git", ["config", "--global", "user.email", COMMITTER_EMAIL]);

  if (GITHUB_TOKEN) {
    await exec("git", [
      "remote",
      "set-url",
      "origin",
      `https://${GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
    ]);
  }

  await exec("git", ["config", "--global", "user.name", COMMITTER_USERNAME]);
  await exec("git", ["add", "."]);
  await exec("git", ["commit", "-m", COMMIT_MSG]);
  await exec("git", ["push"]);
};

Toolkit.run(async (tools) => {
    tools.log.success("Edit README.md Start...");
    
    console.log("kerong test");     //輸出在螢幕上

    const readmeContent = fs.readFileSync("./README.md", "utf-8").split("\n");

    //找到 START TAG
    let startIndex = readmeContent.findIndex(
        (content) => content.trim() === "<!--  UPDATE_README:START -->"
    );

    let endIndex = readmeContent.findIndex(
        (content) => content.trim() === "<!-- UPDATE_README:END -->"
    );

    // START TAG 不存在
    if (startIndex === -1 || endIndex ==-1)
    return tools.exit.failure("Not Found Start Update Comments");
    
    if(startIndex != -1 && endIndex !=-1){
        startIndex++;
        endIndex++;
    }

    const cppFileCount = await countCppFiles(owner, repo);

    console.log(`Total number of .cpp files in the repository: ${cppFileCount}`);

    const oldContent = readmeContent.slice(startIndex, endIndex-1).join("\n");
    const newContent = `**I have ${cppFileCount} cpp files.**`;
  
    const compareOldContent = oldContent.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
  
    const compareNewContent = newContent.replace(/(?:\\[rn]|[\r\n]+)+/g, "");

    // tools.log(compareOldContent);
    // tools.log(compareNewContent);

    if (compareOldContent === compareNewContent)
      tools.exit.success("Same result");
    
    // 把 <!--  UPDATE_README:START --> 到 <!-- UPDATE_README:END -->間的內容刪掉
    // 取得 START ~ END 的間隙
    let gap = endIndex - startIndex;
    readmeContent.splice(startIndex, gap-1);

    if(startIndex != -1 && endIndex !=-1){
        readmeContent.splice(
            startIndex,
            0,
            `**I have ${cppFileCount} cpp files.**`
        )
    }

    tools.log.success("Updated README with the recent blog outline");

    fs.writeFileSync("./README.md", readmeContent.join("\n"));
	
    try {
		await commitReadmeFile();
		tools.log.success("Commit file success");
	} catch (err) {
		tools.log.debug("Something went wrong");
		return tools.exit.failure(err);
	}


    tools.exit.success("Exit Edit README.md Action");
});
