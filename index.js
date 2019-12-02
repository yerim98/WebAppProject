// Express 기본 모듈 불러오기
var express = require('express');
// Express 객체 생성
var app = express();
var http = require('http');
var server = http.createServer(app);

// ejs view와 렌더링 설정
app.use(express.static('views'));
app.use('/img', express.static('./static/css'))
app.use('/img', express.static('./static/js'))
app.use(express.static('routes'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
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
/*
// 라우팅 처리
// '/'을 통해 들어온 요청 처리
app.get('/', function (req, res) {
    res.render('index.html');
});


// login 구현
app.get('/', function(req, res) {
  res.render('login.html');
});

app.post('/', function(req, res){
  var id = req.body.id;
  var pwd = req.body.pw;

  var sql = `SELECT * FROM login WHERE id = ?`;
  connection.query(sql, [id], function(error, results, fields){
    if(results.length == 0){
      res.render('login.html');
    }
    else{
      var db_name = results[0].id;  //'username'는 데이터베이스 칼럼 이름
      var db_pwd = results[0].pw;  //'pwd'또한 데이터베이스 칼럼 이름

      if(pwd == db_pwd){;
        res.render('index.html');
      }
      else{
        res.render('login.html');
      }
    }
  });
});

//회원가입 연동
app.get('/sign_up', function(req, res) {
  res.render('sign_up.html');
});

app.post('/sign_up', function(req, res){
  var name = req.body.name;
  var id = req.body.id;
  var pw = req.body.pw;
  var con_pw = req.body.con_pw;
  
  if(pw == con_pw){

    //DB에 쿼리 알리기
    var sql = `INSERT INTO login VALUES(?, ?, ?, ?)`;
		connection.query(sql,[name, id, pw, con_pw], function(error, results, fields){
      console.log(error);
		});

		res.redirect('login.html');
	}
	else{
		res.render(alert("비밀번호 오류"));
		res.render('sign.html');
	}
});
*/
module.exports = app;
