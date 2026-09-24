// Current Finder DOM entry point. The former radio/Continue flow is superseded.
require('./finder-auto-advance-qa.cjs').run().catch(error=>{console.error(error);process.exitCode=1});
