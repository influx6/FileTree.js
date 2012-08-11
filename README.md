#FileTree.js
	Easy navigation through your filesystem,released for public use no restrictions
	
	##Imagine no more 
		var path = "C:/Users/file/blah/blah" & fs.readFile(path,function(){});
		
	 instead 
	
		var file = FileTree.init("C:/")
					.find("file")
						.find("blah")
							.searchFiles(null,".js") :
		 	which gets you all .js files with little effort and just as easy
		    then read all of them in an instant with no repetition with
		
		file.read(); file.write(data);
		
		Simple,Straight,no repetition,no hassle.
		
#A simple world is a happier one.
