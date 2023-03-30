/******/ (() => { // webpackBootstrap
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const {Toolkit} = requier("actions-toolkit")

Toolkit.run(async(tools) => {
    tools.log.siccess("Start Success");
    tools.exit.success("Exit Success");
});
module.exports = __webpack_exports__;
/******/ })()
;