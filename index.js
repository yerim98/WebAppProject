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
  var sql = `SELECT * FROM login`;
  var sql10 = `SELECT * FROM todo`;
  connection.query(sql, function(error, results, fields){
  connection.query(sql10,function(error,todo7,fields){
    console.log(results);
    if (req.session.user) {
      res.render('index.ejs', {
        logined : req.session.user.logined,
        user_id : req.session.user.user_id,
        results,
        todo7
      });
    } else {
      res.render('index.ejs', {
        logined : false,
        user_id : null,
        results,
        todo7
      });
    }
  });
});
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.clearCookie('id');
  console.log('logout complete!');
  res.send(`
  <script>
   alert("로그아웃 되었습니다.");
   location.href='/';
 </script>
`);
});

app.get('/logout2', function(req, res) {
  req.session.destroy();
  res.clearCookie('id');
  console.log('logout complete!');
  res.send(`
  <script>
   alert("로그아웃 되었습니다.");
   location.href='/selab';
 </script>
`);
});


// 잠깐 test
app.get('/selab', function(req, res) {
  if (req.session.user) {
    res.render('selab.ejs', {
      logined : req.session.user.logined,
      user_id : req.session.user.user_id
    });
  } else {
    res.render('selab.ejs', {
      logined : false,
      user_id : null

    });
  }
  // res.render('selab.ejs');
});

app.post('/', function(req, res){
  var id = req.body.id;
  var pwd = req.body.pw;

  var sql = `SELECT * FROM login WHERE id = ?`;
  connection.query(sql, [id], function(error, results, fields){
    if(results.length == 0){
      res.render('/');
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

app.post('/login2', function(req, res){
  var id = req.body.id;
  var pwd = req.body.pw;

  var sql = `SELECT * FROM login WHERE id = ?`;
  connection.query(sql, [id], function(error, results, fields){
    if(results.length == 0){
      res.render('/');
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
       location.href='selab';
     </script>
    `);
connection.query(sql, function(error, results, fields){
      res.render('selab', {
        logined: req.session.user.logined,
        user_id: req.session.user.user_id,
        results
      });
      });
    }
  });
});


//회원가입 연동
app.get('/sign_up', function(req, res) {
  res.render('sign_up');
});
//app.get('/todo',function(req,res){}

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

const axios = require('axios');
const cheerio = require('cheerio');
var slideCache = {};
const caching = () => {
  axios.get('https://selab.hanyang.ac.kr/courses/cse326/2019/')
    .then(res => {
      const $ = cheerio.load(res.data);
      const lecture = $("#lecture > table > tbody");
      const tr = lecture.html().split("<tr>");
      for (let i = 2; i < tr.length; i++) {
        setTimeout(() => {
          const number = tr[i].split(`number">`)[1].split("</td>")[0];
          const href = tr[i].split(`href="`)[1].split(`">`)[0];
          const name = tr[i].split(`.html">`)[1].split("</a>")[0];
          axios.get(`https://selab.hanyang.ac.kr/courses/cse326/2019/${ href }`)
            .then(result => {
              slideCache[number] = {
                name: name,
                href: href,
                body: result.data
              };
            });
        }, 100);
      }
    })
}
caching();

app.get('/search', async (req, res) => {
  const { keyword } = req.query;
  if (keyword === undefined) {
    res.render('search', { found: [] });
  } else {
    let found = [];
    const searchKeyword = () => {
      return new Promise((resolve, reject) => {
        for (const i of Object.keys(slideCache)) {
          const { name, href, body } = slideCache[i];
          const $ = cheerio.load(body);
          const slides = $('.presentation').find(".slide").each(function (index, ele) {
            const text = $(this).text();
            if (text.includes(keyword)) {
              found.push({
                number: i,
                name: name,
                href: href,
                slideNum: index
              })
            }
          });
        }
        resolve();
      });
    }
    await searchKeyword();
    console.log(found);
    res.render('search', { found: found }, (err, html) => {
      if (err) throw err;
      res.end(html);
    });
  }
});
app.post('/todo',function(req,res){
  var todo = req.body.todo;
  var sql7 = `INSERT INTO todo (todo) VALUES(?)`;
  connection.query(sql7,[todo],function(error,ressult10,fields){
  console.log(error);
  res.send(`
<script>
 alert("질문 항목이 추가되었습니다.");
 location.href='/';
</script>
`);
});
});
/*
app.post('/delete',function(req,res){
  var dele = req.body.dele
  var dele2 = req.body.dele3

  if(dele === dele2){
  var sql100 = 'DELETE from todo where dele = ?';
  connection.query(sql100,[dele],function(error,ressult9,fields){
  console.log(error);
  console.log(dele);
  });
  res.send(`
<script>
 alert("질문 항목이 삭제되었습니다.");
 location.href='/';
</script>
`);
  }else{
  }
});
*/

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


