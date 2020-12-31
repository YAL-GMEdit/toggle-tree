(function() {
	GMEdit.register("toggle-tree", {
		init: function() {
			var tree = document.querySelector("#tree-td");
			if (tree) $gmedit["ui.CommandPalette"].add({
				name: "Toggle treeview",
				exec: function() {
					tree.style.display = tree.style.display == "none" ? "" : "none";
					GMEdit_Splitter.syncMain();
				}
			});
		}
	});
})();
