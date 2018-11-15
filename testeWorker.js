"use strict";

/**
 * See
 * http://stackoverflow.com/questions/14500091/uncaught-referenceerror-importscripts-is-not-defined
 */
if ('function' === typeof importScripts) {
	importScripts(
		"/element.js",
		"/sorter.js");

	addEventListener('message', (e) => {
		console.log(e.data);

		let sorter = new SelectionSorter();
		sorter.subscribe(event => postMessage(event));
		sorter.run(e.data);
	});
}