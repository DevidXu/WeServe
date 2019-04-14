Here are instructions on how to build this app on different server.
Technique Stack:
	Frontend: AngularJS, Bootstrap, Material
	Backend: NodeJS + MongoDB

Configuration:
	You don't need to move or copy the node_modules files. Instead, you just need to use the files left to build this app on any server.
	You just need to check the port in "./app.js" and serverURL in "./client/javascript/Common.js", and run some commands.
	1. To run the app on local machine,
		const port = 3000;
		const serverURL = "http://localhost:3000";

		And then run the commands:
			npm install
			npm start

	2. To run the app on AWS elasticbeanstalk,
		const port = 8081;
		const serverURL = "http://weserve-env.gq2bzpn3rs.us-west-1.elasticbeanstalk.com";

	3. To run the app on GCP Nodejs,
		const port = ????;
		const serverURL = "????";

	That's done!

