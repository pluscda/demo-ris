// const data = [{ phKey: "test", phsentence: "this is a test" }];

function test() {
  console.log("// ---------------this a test start ----------------//");
  // console.log(data);

  let per = {
    Fname: "Default",
    Lname: "Default",
    FullName: function() {
      return this.Fname + " " + this.Fname;
    },
  };
  // let joh = {
  //   Fname: "joh",
  //   Lname: "Doe",
  // };
  let joh = Object.create(per);
  joh.Fname = "joh";
  joh.Lname = "Doe";
  // console.log(per, joh);
  // joh.__proto__ = per; //__proto__一定要這樣子寫
  console.log(joh.FullName());

  let f = function() {
    this.a = 1;
    this.b = 2;
  };
  let o = new f(); // {a: 1, b: 2}
  f.prototype.b = 3;
  f.prototype.c = 4;
  console.log(o);
  console.log(o.__proto__);
  console.log(f.prototype);
  console.log(f);
  function Graph() {
    this.ver = [];
    this.edges = [];
  }
  Graph.prototype = {
    addVertex: function(v) {
      this.ver.push(v);
    },
  };
  var g = new Graph();
  console.log(g);
  console.log(Graph.prototype);

  let a = { a: 1 };
  let b = Object.create(a);
  console.log(b.a);
  //
  console.log("// ---------------this a test end -----------------//");
}
export default test;
