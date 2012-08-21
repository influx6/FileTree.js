#FileTree.js
	Easy navigation through your filesystem,released for public use no restrictions

#Install
		npm install filetree
		
#Why FileTree
   The usual course of action when trying to get a file usual evolves copy and
   pasting the paths or looking for a specific file or set of files in
   a specific location which usually involve abit of redundant work,filetree
   was created out of my desire to have an easy,fast way to get to different
   locations within the filesystem and be able to backtrack to them when
   without having to keep this paths within a specific variable and also to be
   able to retrieve specific files according to a specific criteria or name.

   In Vanilla Node FS module:

      var project = "/Users/PunchBox/Projects";
      var stub_project  = project + "/stub_project";
      var filetree_project = project + "filetree";

      fs.readFile(stub_project+"/stub.js",function(err,data){
          //do something with the data;
       });

      fs.readFile(filetree_project+"/filetree.js",function(err,data){
            //do something with the data;
       });

   In FileTree: Its simple a method call chain

      var fileTree = Tree.FileTree.init(~);
      fileTree.find("Project").find("stub");

      The currrent path can be attained throught: fileTree.currentPath();


      var stub = FileFactory.spawn(fileTree.searchFiles("stub.js")).read()["stub.js"];

      You can use FileFactory to generate a file object that as a small set
      of abilities like read or write
      
      fileTree.backward().find("filetree").searchFiles("filetree.js",function(res){
          //res will be an object containing mappings of filename: filename path
          console.log(res);
      });

         "searchFiles" accepts 
            - a name,
            - file extension,
            - an option callback that gets the results as its first argument,
          searchFiles will return a object with the results of the search in a
          filename:filepath fashion,its left to you to decide on how you wish
          to use the object created,you can use FileFactory as above or pass
          a callback to searchFiles which restores the chaining ability and has
          the results as its first arguments as above

         FileFactory "read" returns a object with a mapping of filename:data format,therefore
         you can access stub.js data simply by appending the name to the result

         FileFactory "write" accepts 
            - a boolean TRUE/FALSE argument to indicate appending or rewritting of the file,
            - data to write to the file in ,
            - a name to write to a specific file in the result from searchFiles,
            - a callback to pass as to callback to the fs module asyn writeFile method

      Another is writing to a large set of files meeting a criteria in searchFiles,where 
      you are not bothered about which file is to written to:

      var file = FileFactory.spawn(FileTree.root("/").find("Library").find("Logs").searchFiles(null,".log"))
      file.write(true,"new words onto all logs");

      FileFactory has a limit of 10 spawns as of now,it might increase as time
      goes on or if you wish to be much of a hacker you can increase it as you
      wish but it is not adviced,this was put inplace for performance
      reason,theres never a good idea in mindlessly creating new Objects.
      FileFactory only asks that once you are done with the spawns that you
      call their "destroy" method to release that object for instant reuse once
      you spawn once again 

      file.destroy() //frees this spawn for immediate use

	
#A simple world is a happier one.
