const KakaoStrategy = require('passport-kakao').Strategy;
const pool = require('../config/dbconfig.js')

module.exports = (passport) => {
   passport.use(new KakaoStrategy({
       clientID: process.env.KAKAO_ID,
       callbackURLL: '/auth/kakao/callback',
   }, async (accessToken, refreshToken, profile, done) => {
       try {


        pool.getConnection(function(err, conn){
            conn.query(`SELECT * FROM user WHERE snsID='${profile.id}' AND provider='kakao';`, function(err, results){
              if(results.length > 0) {
                  done(null, results);
              }
            });
          });
          
           const exUser = await User.find({ where: { snsId: profile.id, provider: 'kakao' } });
           if (exUser) {
               done(null, exUser);
           } else {
               const newUser = conn.query(`INSERT INTO user (email,sns_id,provider) VALUES ('${title}','${description}','${author}');`,function(err, results){
                conn.release();
               });
               done(null, newUser);
           }
       } catch (error) {
           console.error(error);
           done(error);
       }
   }));
};