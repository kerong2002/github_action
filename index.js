const { Toolkit } = require('actions-toolkit');

Toolkit.run(async (tools) => {
    tools.log.success("Edit README.md Start...");

    tools.exit.success("Exit Edit README.md Action");
});
