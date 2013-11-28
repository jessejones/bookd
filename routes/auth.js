var social = require('./socialoauth');
var t = social.Twitter;

exports.signin = function(req, res) {
	var provider = req.params.provider;
	t.getRequestToken().then(function(data) { res.redirect('/auth/twitter?oauth_token=' + data.oauth_token); });
};

exports.auth = function(req, res) {
	var token = req.param('oauth_token');
	res.redirect('https://api.twitter.com/oauth/authorize?oauth_token=' + token);
};

exports.complete = function(req, res) {
	var provider = req.params.provider;
	var token = req.param('oauth_token');
	var verifier = req.param('oauth_verifier');
	if (!(token && verifier)) {
		res.redirect('/signin/twitter');
	}

	t.getAccessToken({ token:token, verifier:verifier }).then(function(data) {
		data.provider = 'twitter';
		req.session.auth = data;
		res.redirect('/#!/share/twitter');
	});
};