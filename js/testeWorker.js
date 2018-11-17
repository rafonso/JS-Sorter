"use strict";

function startSorter(e) {
	console.log(e.data);

	let sorter = sorterType.get(e.data.sorter)();
	sorter.subscribe(postMessage);
	sorter.run(e.data.valores);
}

/**
 * See
 * http://stackoverflow.com/questions/14500091/uncaught-referenceerror-importscripts-is-not-defined
 */
if ('function' === typeof importScripts) {
	importScripts(
		"/js/element.js",
		"/js/sorter.js");

	addEventListener('message', startSorter);
}