const {Toolkit} = requier("actions-toolkit")

Toolkit.run(async(tools) => {
    tools.log.siccess("Start Success");
    tools.exit.success("Exit Success");
});