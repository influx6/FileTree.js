#FileTree.js
	Easy navigation through your filesystem,released for public use no restrictions

#Install
		npm install filetree
		
#Why FileTree
   FileTree was my creation to deal with manual typing of file paths or
   manaully creating directory structure,it was about saving time and reducing
   the amount of work done when dealing with files and directories.

#Methods Explanation
   
   ###FileTree:init: 
         to be called when initializing the filetree object
   ###FileTree:dir: 
         to move to a single directory located within the current directory
   ###FileTree:dirs:
         allows you to move onto multiple directory location at once by spacing
         the name of the directory in quotes eg. "Project petproject redistribute",this will move
         from Project to petproject to redistribute.
   ###FileTree:forward:
         takes a number(on how long to move forward to the history) or a string(where to move to by a specific
         name of a directory formerly visited)
   ###FileTree:backward:
         takes a number or string like the forward method but moves backward
         through the history
   ###FileTree:root:
         this methods lets you relocat the tree to a starting location like the
         init method
   ###FileTree:useTree:
         this method allows you to pass a function that lets you access the
         tree of the filetree object,incase you wish to do certain things with
         the raw paths
   ###FileTree:flush:
         this method lets you destroy the whole tree and history,so you can
         start with a clean slate
   ###FileTree:files: 
         formerly searchFiles,this method is used to locate files within the
         current location,you can pass a name as first argument and also pass
         a extension for a filetype you wish to be specific,also as a third
         argument you can pass a function that allows you to access the raw
         paths of the results of this method,eg:
         ``` files("stub.js"); or files(null,"js"); or files("stub","js"); 
         ```
         the files method returns a FileFactory object if you dont pass a function
         as the third arguments of this method.

   ###FileTree:currentPath:
         this method allows you to access the current path of which the tree is
         located in 

   ###FileTree:createDir:
         this method allows you to create a directory within the current
         location of the tree 

   ###FileTree:createFile:
         this method allows you to create a file within the current location of
         the Tree

   ###FileTree:fetchHistory:
         this allows you to get a specific location in the history,but requires
         you to know the name of the path you wish to get from the fetchHistory

   ###FileFactory
         this is a method which lets you do simple operations like read,write,stats with the result from the
         FileTree:files method,it lets you do simple operations especially when it comes to batch files.

   ###FileFactory:spawn
         this method must be called when using the FileFactory object,now it the limit of the spawn function
         call is set to 10 to ensure not to much FileFactory object are created but it can be increased
         by setting the FileFactory.cache to a higher number.

   ###FileFactory:cache
         this lets you set the total amount of allowable spawns by the FileFactory.spawn method


#Examples
   In FileTree: Its simple a method call chain

      ```
      var fileTree = Tree.FileTree.init(~);
      fileTree.dir("Project").find("stub");

      var stub = FileFactory.spawn(fileTree.searchFiles("stub.js")).read()["stub.js"];

      fileTree.backward().dir("filetree").files("filetree.js",function(res){
          //res will be an object containing mappings of filename: filename path
          console.log(res);
      });

      fileTree.dir("tests",true).dir("unit",true).backward().dir("functional",true);
      
      var file = FileFactory.spawn(FileTree.root("/").dir("Library").dir("Logs").files(null,".log"))
      file.write(true,"new words onto all logs");

      file.destroy() //frees this spawn for immediate use

      ```
	
#A simple world is a happier one.
