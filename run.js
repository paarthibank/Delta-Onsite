var exp=require("express");
var mysql=require("mysql");
var bodyparser=require("body-parser");
con=exp();
con.use(bodyparser.json());
con.use(bodyparser.urlencoded({extended: false}));
con.use(exp.static("public"));

var sql=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Arizona"
})
sql.connect(function(err) {
  if (err) {
  	console.log(err);
  }
  console.log("Connected!");
});
sql.query("CREATE DATABASE IF NOT EXISTS Nitt");
sql.query("USE Nitt");
sql.query("CREATE TABLE IF NOT EXISTS Nitt(Roll_no varchar(9) not null primary key,Name varchar(50) not null,Dept varchar(50) not null)");


con.get("/",function(req,res){
	res.render("abc.ejs");
})
con.get("/ad",function(req,res){
	res.render("add.ejs");
})
con.get("/de",function(req,res){
	res.render("delete.ejs");
})
con.get("/up",function(req,res){
	res.render("update.ejs");
})
con.post("/add",function(req,res){
	var a2=req.body.name;
	var a1=req.body.rollno;
	var a3=req.body.dept;
	
	sql.query("INSERT INTO Nitt(Roll_no,Name,Dept) VALUES (?,?,?)",[a1,a2,a3],function(err,res,fields){
		if(err) throw err;
		console.log("one student added");
	})
	res.redirect("/");
	res.end();
})
con.post("/delete",function(req,res){
	var a1=req.body.rollno;
	
	sql.query("DELETE FROM Nitt WHERE Roll_no=?",[a1],function(err,res,fields){
		if(err) throw err;
		console.log("one student deleted");
	})
	res.redirect("/");
	res.end();
})
con.get("/search",function(request,response){
	sql.query("SELECT * FROM Nitt",function(err,res,fields){
		var m=[];
		for(i=0;i<res.length;i++){
			
			m.push({
				name: res[i].Name,
				rollno: res[i].Roll_no,
				dept: res[i].Dept
			})
		}
		console.log(m)
		log={
			m: m
		}
		response.render("full.ejs",log);
		response.end();
	})
})
con.post("/update",function(req,res){
	a2=req.body.name;
	a1=req.body.rollno;
	sql.query("UPDATE Nitt SET Name = ? WHERE Roll_no=?",[a2,a1],function(err,res,fields){
		if(err) throw err;
	})
	res.redirect("/");
	res.end();
})
con.post("/updated",function(req,res){
	a2=req.body.dept;
	a1=req.body.rollno;
	sql.query("UPDATE Nitt SET Dept = ? WHERE Roll_no=?",[a2,a1],function(err,res,fields){
		if(err) throw err;
	})
	res.redirect("/");
	res.end();
})
con.post("/ajax",function(request,response){
	var a1=request.body.search;
	var a2=JSON.stringify(a1);
	
	var name=[],rollno=[],dept=[];

	sql.query("SELECT * FROM Nitt",function(err,res,fields){
		var m;
		for(i=0;i<res.length;i++){
			var mm=res[i].Name;
			var rr=0;
			var pp=a2.length-2;

			for(j=0;j<pp;j++){
				if(a2[j+1]==mm[j])
					rr++;
			}
			if(rr==pp){
				name.push(res[i].Name);
				rollno.push(res[i].Roll_no);
				dept.push(res[i].Dept);
			}
		}
		m={
			dept: dept,
			name: name,
			rollno: rollno
		}

		response.send(m);
		response.end();
	})

})
con.post("/ajaxd",function(request,response){
	var a1=request.body.search;
	console.log(request.body);
	var a2=JSON.stringify(a1);
	var name=[],rollno=[],dept=[];

	sql.query("SELECT * FROM Nitt",function(err,res,fields){
		var m;
		for(i=0;i<res.length;i++){
			var mm=res[i].Roll_no;
			var rr=0;
			var pp=a2.length-2;

			for(j=0;j<pp;j++){
				if(a2[j+1]==mm[j])
					rr++;
			}
			if(rr==pp){
				name.push(res[i].Name);
				rollno.push(res[i].Roll_no);
				dept.push(res[i].Dept);
			}
		}
		console.log(m)
		m={
			dept: dept,
			name: name,
			rollno: rollno
		}

		response.send(m);
		response.end();
	})

})
con.listen(3000)