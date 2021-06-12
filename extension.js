// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs')
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "multiple-copy" is now active!');

	//create hidden file for copy 
	fs.writeFile('Output.txt',"", (err) => {
	
		// In case of a error throw err.
		if (err){
			console.log("error occured"); 
			throw err;
		}
	})

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('multiple-copy.copymultiple', function () {
			// The code you place here will be executed every time your command is executed
			var editor = vscode.window.activeTextEditor;
			if (!editor) {
				return; // No open text editor
			}
			// Display a message box to the user
			var selection = editor.selection;
			var text = editor.document.getText(selection);
			// console.log(text)
			fs.appendFile('Output.txt',text,(err)=>{
				
			})
				
			vscode.window.showInformationMessage(text);
	});

	let pastable = vscode.commands.registerCommand('multiple-copy.pastemultiple', function () {
		// The code you place here will be executed every time your com
		var editor = vscode.window.activeTextEditor;
		//output.txt read -> insert at current_cursor_position location
		fs.readFile('Output.txt','utf8',(err,data)=>{
			// console.log(data)
			
			// the Position object gives you the line and character where the cursor is
				console.log("before")
				const position = editor.selection.active;
				console.log("after")
				console.log(position._line)

				editor.edit((editBuilder) =>
				editBuilder.insert(
						new vscode.Position(position._line + 1, 0),
						data
					)
				);

				vscode.window.showInformationMessage(data);
				vscode.window.showInformationMessage(position);
		})



		
		vscode.window.showInformationMessage("pastable");
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(pastable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
