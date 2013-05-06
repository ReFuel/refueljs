var config = module.exports;

config["My tests"] = {
	env: "browser",        // or "node"
	rootPath: "../",
	libs:[
		"require.min.js"
	],
	sources: [
	"Refuel.js",
	"Events.js"// Glob patterns supported
	],
	tests: [
	"test/*-test.js"
	],
	extensions: [require("buster-amd")]
};

// Add more configuration groups as needed 
