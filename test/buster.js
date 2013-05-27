var config = module.exports;

config["refueljs"] = {
	env: "browser",        // or "node"
	rootPath: "../",
	libs:[
		"require.min.js"
		,"hammer.min.js"
		,"path.min.js"
	],
	sources: [
		"Refuel.js",
		"Events.js"
	],
	tests: [
		"test/*-test.js"
	],
	extensions: [
		require("buster-amd"),
		require("buster-coverage")
	],

	"buster-coverage": {
		outputDirectory: "test/coverage", //Write to this directory instead of coverage
		format: "lcov", //At the moment cobertura and lcov are the only ones available
		combinedResultsOnly: true, //Write one combined file instead of one for each browser
		coverageExclusions: ["resources"] //Exclude everything with resources in it's path
	}
};

// Add more configuration groups as needed 
