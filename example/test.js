var FileTree = require('../filetree.js').Tree;

var tree = FileTree.FileTree.init("~");

//ability to chain method calls as much as you want
tree.root('~'). //use to relocate the root of the tree when chainging directory which is not in the current location use root
   find("node_modules").
      find("websocket").
         backward(). // move backward one step when n is not giving
            find("weld"). // main method to use to find directory within the root directory
               backward(2). //move backward in time/history about n steps ,here n = 2,if n is greater than the length of history,the history is moved back to the biginning 
                  flush().root("~"); //flush clears both the tree and history maps making forward and backward with no timeline and the root method can be called to setup the tree for transversing

//searchFiles breaks the call chain,use it to get fileObject to play around
//with or pass a callback to use the search results and restore chain,but you
//will need to call FileFactory urself to create fileObject for use;
tree.root("~").searchFiles(".zshrc");


tree.root("~").find("Projects").find("petprojects").find("stub").searchFiles(null,".js",function(f){
      var file = FileTree.FileFactory.spawn(f);
      //once u are done using the file ,destroy it to cleanup
      //things,FileFactory only allows 10 spawns to keep performance top
      //shape,once a file is done its job,destroy it to vacate space for a new
      //spawn,the limit might increase in future
      file.destory();
}).find("..").find("..");

console.log(tree.__tree__);

