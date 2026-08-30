globalThis.process ??= {};
globalThis.process.env ??= {};
//#region node_modules/astro/dist/env/runtime.js
var _getEnv = (key) => process.env[key];
function setGetEnv(fn) {
	_getEnv = fn;
	_onSetGetEnv();
}
var _onSetGetEnv = () => {};
function setOnSetGetEnv(fn) {
	_onSetGetEnv = fn;
}
function getEnv(...args) {
	return _getEnv(...args);
}
//#endregion
export { setGetEnv as n, setOnSetGetEnv as r, getEnv as t };
