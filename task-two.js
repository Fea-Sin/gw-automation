var Task = require('shell-task')

new Task('sleep 1000')
		.then('git add .')
		.then('sleep 1000')
		.then('git commit -m "first commit"')
		.then('git push -u origin master')
		.run(function(err, next) {
			if (err) {

				// do something you should do
			} else {
				console.log('done');
			}
		})