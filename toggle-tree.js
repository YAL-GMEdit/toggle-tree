(function () {
	var Preferences = $gmedit["ui.Preferences"];
	var FileWrap = $gmedit["electron.FileWrap"];
	var moveHamburger = true;

	function toggleView() {
		var tree = document.querySelector("#tree-td");
		if (tree) {
			tree.style.display = tree.style.display == "none" ? "" : "none";
			updateHamburgerLocation();
			GMEdit_Splitter.syncMain();
		} else {
			console.error("Could not find resource tree view");
		}
	}

	function updateHamburgerLocation() {
		var tree = document.querySelector("#tree-td");
		var hamburger = document.querySelector(".hamburger");
		var buttonSapce = document.querySelector("#button-slot");
		// Free up white space for tabs
		buttonSapce.style.display = tree.style.display == "none" ? "" : "none";

		// Move the hamburger based on toggle state
		if (tree.style.display == "") {
			// Resource tree is shown, move hamburger next to project name
			var projectName = document.querySelector(".project-name");
			projectName.appendChild(hamburger);
			// Re-query button, otherwise button will be duplicated
			document.querySelector(".hamburger").classList.remove("hamburger-hidden");
			document.querySelector(".chrome-tabs-content").classList.remove("chrome-tabs-content-reduced");
		} else {
			// Resource tree is hidden, move hamburger next to tabs
			buttonSapce.appendChild(hamburger);
			// Re-query button, otherwise button will be duplicated
			document.querySelector(".hamburger").classList.add("hamburger-hidden");
			document.querySelector(".chrome-tabs-content").classList.add("chrome-tabs-content-reduced");
		}
	}

	function init() {
		// Initialize new elements
		document.querySelector(".system-buttons").classList.add("hamburger");
		// TODO: save hidden state of resource tree in properties
		var buttonSlot = document.createElement("div")
		// Default button slot to hidden since resource tree is shown by default
		buttonSlot.style.display = "none";
		buttonSlot.id = "button-slot"
		document.querySelector("#tabs").prepend(buttonSlot);

		function prepareTRT() {
			var currentPrefs = Preferences.current.toggleResourceView;
			if (!currentPrefs) currentPrefs = Preferences.current.toggleResourceView = {};
			return currentPrefs;
		}

		function opt(ov, name, def) {
			if (!ov) return def;
			var val = ov[name];
			return val !== undefined ? val : def;
		}

		AceCommands.add({
			name: "toggleResourceView",
			bindKey: "Ctrl-Shift-B",
			exec: function (editor) {
				toggleView();
				var currPrefs = FileWrap.readConfigSync("config", Preferences.path);
				if (currPrefs) {
					var currTRT = currPrefs.toggleResourceView;
					if (currTRT == null) currTRT = currPrefs.toggleResourceView = {};
					FileWrap.writeConfigSync("config", Preferences.path, currPrefs);
				}
			}
		});

		AceCommands.addToPalette({
			name: "Toggle Resource View",
			exec: "toggleResourceView"
		});

		GMEdit.on("preferencesBuilt", function (e) {
			var out = e.target.querySelector('.plugin-settings[for="toggle-tree"]');
			var currTRT = Preferences.current.toggleResourceView;
			moveHamburger = opt(currTRT, "moveHamburger", true);


			Preferences.addCheckbox(out, "Show hamburger when resource tree is closed", opt(currTRT, "moveHamburger", true), function (val) {
				var currTRT = prepareTRT();
				showFuncArgs = currTRT.moveHamburger = val;
				updateHamburgerLocation();
				Preferences.save();
				forceRefresh();
			});
		});
	}

	GMEdit.register("toggle-tree", {
		init: init
	});
})();
