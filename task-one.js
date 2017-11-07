var Task = require('shell-task')

new Task('sleep 1000')
		.then('git remote add origin https://github.com/Fea-Sin/gw-automation.git')
		.run(function(err, next) {
			if (err) {

				// do something you should do
			} else {
				console.log('done');
			}
		})