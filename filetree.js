var fs = require('fs'),
    path = require("path"),
    util = require("util"),
    stub = require("stub").Stubs,
    _su = stub.SU,
    _currentPath,
    _g = {

       isHomeDir: function(symbol){
          if(symbol == "~" || symbol == "HOME_DIR" || symbol == "HOME_DIR".toLowerCase()) return process.env["HOME"];
          return symbol;
       },

       resolvePath : function(root,final){
            return path.normalize(path.resolve(root,final));
       },
   
       resolveRoots: function(p){
          return this.resolvePath(p,"..").split(path.sep);
       },
       
       walkDir : function(paths,final){
            _currentPath = this.resolvePath(paths,final);
            return fs.readdirSync(_currentPath);
       },

       bindPath : function(a){
         if(_su.matchType(a,"string"))  return this.resolvePath(_currentPath,a);
         var binds = {};
         if(_su.isArray(a)){
            _su.onEach(a,function(e,i,b){
               try{
                  binds[e] =  this.resolvePath(_currentPath,e);
               }catch(e){}
            },this);

            binds[".."] = this.resolvePath(_currentPath,"..");
            return binds;
         }
       }
    },

    //spawns a shell which is proxied with the functions from FileUtils
    FileFactory = (function(){
   
         var spawns = {}; spawns.length = 0;
         var max_spawn = 10;

         var createSpawn = function(data){
            var find;
            if(spawns.length <= max_spawn){
                find = { load: data, isAlive:true, id: spawns.length };
                _su.pusher(spawns,find); 
                return find;
            }else{
               find = _su.filter(spawns,function(e,i,b){
                  if(e.isAlive == false){
                     return e;
                  }
               },this)[0];
               
               if(find){
                  find.load = data;
                  find.isAlive = true;
                  return find;
               }
               return false;
            }
         },
         FileUtils = {
            
            stats: function(){
               var map = {}; 
               _su.onEach(this.load,function(e,i,b){
                    fs.stat(e,function(err,s){
                        map[i] = s;
                   });
               },this);

               return map;
            },

            read: function(){
               var data = [];
               _su.onEach(this.load,function(e,i,b){
                     data.push(fs.readFileSync(e).toString());
               },this);
               return data;
            },

            write: function(data,name){
               _su.onEach(this.load,function(e,i,b){
                     if(name && i === name){
                        fs.appendFileSync(e,data);
                        return;
                     }
                     fs.appendFileSync(e,data);
                     return;
               },this);
   
            },

            pop: function(i){
               var item = this.load.indexOf(i);
               delete this.load[i];
               this.load = _su.normArray(this.load);
            },

            destroy: function(){
                _su.explode(this.load);
                this.isAlive = false;
            }

         };

         return {
            spawn: function(data){
               var Shell = createSpawn(data);
               if(Shell){
                  _su.createProxyFunctions(FileUtils,Shell);
                  return Shell;
               }
            },
            cache: spawns
         }
    })(),

    FileTree = (function(){

       var Tree = stub.create("FileTree",{
            init: function(path){
               //the below will check if that path giving is HOME_DIR in
               //uppercase or lowercase or the ~ symbol which then returns the
               //home directory if not just returns the paths,its a trick to
               //handle when the FileTree root is to be the home directory
               this.__history__ = {};
               this.__tree__ = {};
               this.currentHistory = null;

               this.on("history:change",function(key,path){
                    this.__history__[key]=path;
                    this.currentHistory = key;
               },this);

               this.on("history:destroy",function(){
                     _su.explode(this.__history__);
                     _su.explode(this.__tree__);
                     this.currentHistory = null;
               },this);

               this.root(path);

            },
            
            useTree : function(fn){ 
               if(fn){ fn.call(this,this.__tree__)};
               return this;
            },

            root: function(path){
               var p = _g.isHomeDir(path);
               this.__tree__ = this._elevateDir(p);
               this.emit("history:change",path,p);
               return this;
            },

            _probHistory: function(n){
               var keys = _su.keys(this.__history__);

               if(n === "first") return keys[0];
               if(n === "last")  return keys[(keys.length -1)];

               if(_su.isNumber(n)){
                  if(n >= keys.length) n = (keys.length -1);
                  if(n <= -1) n = 0;
               }
               return keys[n];
            },

            flush: function(){
               this.emit("history:destroy");
               return this;
            },

            _handleTime: function(times){
               var cid = _su.keys(this.__history__).indexOf(this.currentHistory),
               move = this._probHistory(cid+times);
      
               var test = this.fetchHistory(move);
               this.tree = this._elevateDir(this.fetchHistory(move));
               this.currentHistory = move;
            },

            forward: function(times){
               if((this.currentHistory == this._probHistory("last")) && !_su.isNumber(times)) return;

               if(!times){ times = 1};
               this._handleTime(times);
               return this;
            },
            
            backward: function(times){
               if((this.currentHistory == this._probHistory("first")) && !_su.isNumber(times)) return;

               if(!times) times = 1;
               this._handleTime(-times);
               return this;
            },

         /*searchFiles will only look for non-directory files,it returns an array of
          * the location of files that the extension or the file the filename
          * giving
         */
            searchFiles: function(name,extension,fn){
               if(!name && !extension) return;
               
               var ext = _su.isRegExp(extension) ? extension : RegExp("\\"+extension+"$");

               var find = {};
               _su.onEach(this.__tree__,function(e,i,b){
                   try{
                      var stat = fs.statSync(e);
                      if(!stat.isDirectory()){
                         if(name && !extension && name == i)  find[i] = e;
                         if(!name && extension && ext.exec(i)) find[i] = e;
                         if(name && extension && name == i && ext.exec(i)) find[i] = e;
                      }
                   }catch(e){};
               },this);
   
               if(!fn){ 
                  return new FileFactory.spawn(find);
               };

               fn.call(this,find);
               return this;
            },

            find: function(path){
                 var keys = _su.keys(this.__tree__);
                 if(keys.lengths == 0 || !_su.contains(keys,path)){
                     console.error("Location not Found!"); return this;
                 }
                 var k = this.__tree__[path];
                 this.__tree__  = this._elevateDir(k);
                 this._updateHistory(path,k);

                 return this;
            },

            fetchHistory: function(path){
               if(!path) return;
               return this.__history__[path];
            },

            _updateHistory: function(key,path){
                  this.emit("history:change",key,path);
            },

            _elevateDir: function(path){
               return _g.bindPath(_g.walkDir(path,"."));
            },

       });

       return {
          init : function(path){
             return Tree().setup(path);
          }
       };

    })();


module.exports.Tree = {
   FileTree: FileTree,
   FileFactory: FileFactory
};

//for debugging purposes
