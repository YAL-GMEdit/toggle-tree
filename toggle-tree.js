(function () {

	function toggleView() {
		var tree = document.querySelector("#tree-td");
		if (tree) {
			tree.style.display = tree.style.display == "none" ? "" : "none";
			GMEdit_Splitter.syncMain();
		} else {
			console.error("Could not find resource tree view");
		}
	}

	GMEdit.register("toggle-tree", {
		init: function () {
			AceCommands.add({
				name: "toggleResourceView",
				bindKey: "Ctrl-Shift-B",
				exec: function (editor) {
					toggleView();
				}
			});

			AceCommands.addToPalette({
				name: "Toggle Resource View",
				exec: "toggleResourceView"
			});
		}
	});
})();
