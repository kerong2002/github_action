const { Toolkit } = require("actions-toolkit");

Toolkit.run(async(tools) => {
    tools.log.success("Start Success");
    tools.exit.success("Exit Success");
});