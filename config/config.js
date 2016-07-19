var _isDev = true;
var ENV = {
			local: 'http://localhost:3005/',
			production: '',			
		};

exports.main = function(){
	return {	
		email: {
			user:"amorgan115@gmail.com",
			service: "Gmail",
			password: "Evolucion#8820"
		},
		smtpUser : 'amorgan115%40gmail.com:Evolucion#1988@smtp.gmail.com',
		apiPrefix : '/api'
	}
}

exports.env = function(){
	return {
		current: (_isDev) ? ENV.local : ENV.production,
		dev: ENV.local,
		prod: ENV.production
	}	
}