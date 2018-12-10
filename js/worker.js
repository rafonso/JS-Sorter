"use strict";

function startSorter(e) {
	let params = e.data;
	console.log(params);

	let sorter = sorterType.get(params.sorter)(params.pauseTime);
	sorter.subscribe(postMessage);
	sorter.run(params.valores);
}

/**
 * See
 * http://stackoverflow.com/questions/14500091/uncaught-referenceerror-importscripts-is-not-defined
 */
if ('function' === typeof importScripts) {
	importScripts(
		"/js/commons.js",
		"/js/sorter.js");

	addEventListener('message', startSorter);
}