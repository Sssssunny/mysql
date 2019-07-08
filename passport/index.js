const kakao = require('./kakaoStrategy');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user_id);
    });

    passport.deserializeUser((id, done) => {
        User.find({ Where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err))
    });

    kakao(passport);
}