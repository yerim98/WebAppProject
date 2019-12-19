// Express 기본 모듈 불러오기
var express = require('express');
// Express 객체 생성
var app = express();
var http = require('http');
var server = http.createServer(app);
var session = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// ejs view와 렌더링 설정
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
// body-parser 기본 모듈 불러오기 및 설정 (POST req 해석)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

//db 오류 났는지 확인
var mysql = require('mysql');
// connection 객체 생성
var connection = mysql.createConnection({
  // DB 연결 설정
  host: 'webappteam.cgkc5bv4txxd.us-east-1.rds.amazonaws.com',
  user : 'hdy',
  password: 'han5014917',
  database: 'selab'
});
connection.connect(function (err) {
  if (err) {
    console.error('error connection: ' + err.stack);
    return;
  }
  // Connection 이 성공하면 로그 출력
  console.log('Success DB connection');
});

// Express 서버 시작
server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
app.use(session({
  key: 'sid',
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

// login 구현
app.get('/', function(req, res) {
  var sql = `SELECT *FROM login`;

  connection.query(sql, function(error, results, fields){
    console.log(results);
    if (req.session.user) {
      res.render('index', {
        logined : req.session.user.logined,
        user_id : req.session.user.user_id,
        results
      });
    } else {
      res.render('index', {
        logined : false,
        user_id : null,
        results

      });
    }
  });
});
app.get('/', function(req, res) {
  req.session.destroy();
  res.clearCookie('id');
  console.log('logout complete!');
  res.send(`
  <script>
   alert("로그아웃 되었습니다.");
   location.href='/index';
 </script>
`);
  res.render('/', {
    logined : false,
    user_id : null,
    results
  });

});
/*
app.post('/',function(req,res){
 var todo = req.body.todo;
 var sql2 = `SELECT * FROM todo`;
 connection.query(sql,[todo],function(error,results100,fields){
  if (req.session.user) {
    res.render('/', {
      logined : req.session.user.logined,
      user_id : req.session.user.user_id,
      results100
    }); 
  }else {
    res.render('/', {
      logined : false,
      user_id : null,
      results100,
  });
}
 })
});
*/
app.post('/', function(req, res){
  var id = req.body.id;
  var pwd = req.body.pw;

  var sql = `SELECT * FROM login WHERE id = ?`;
  connection.query(sql, [id], function(error, results, fields){
    if(results.length == 0){
      res.render('login');
    } else {
      console.log(results[0]);
      var db_name = results[0].id;
      var db_pwd = results[0].pw; //'pwd'또한 데이터베이스 칼럼 이름

      req.session.user = {
        logined: true,
        user_id: db_name
      }
      res.send(`
      <script>
       alert("로그인 되었습니다.");
       location.href='/';
     </script>
    `);
connection.query(sql, function(error, results, fields){
      res.render('index', {
        logined: req.session.user.logined,
        user_id: req.session.user.user_id,
        results
      });
      });
    }
  });
});
//러그 아웃



//회원가입 연동
app.get('/sign_up', function(req, res) {
  res.render('sign_up');
});

app.post('/sign_up', function(req, res){
  var name = req.body.name;
  var id = req.body.id;
  var pw = req.body.pw;
  var con_pw = req.body.con_pw;
  
  if(pw == con_pw){
    //DB에 쿼리 알리기
    var sql3 = `INSERT INTO login VALUES(?, ?, ?, ?)`;
    connection.query(sql3,[name, id, pw, con_pw], function(error, results, fields){
      console.log(error);
    });
res.send(`
<script>
 alert("회원가입이 완료되었습니다. 다시 로그인 해주세요.");
 location.href='/';
</script>
`);
} else {

}
});
module.exports = app;

