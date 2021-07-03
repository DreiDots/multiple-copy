// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs')
const path = require('path');
const { fileURLToPath } = require('url');
const { validateLocaleAndSetLanguage } = require('typescript');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "multiple-copy" is now active!');

	var copy_dir = path.dirname(__dirname)
	var copy_file = path.join(copy_dir,'.output.txt')
	var resource_cnt = 0
	//create hidden file for copy 
	if(!fs.existsSync(copy_file)) {
		fs.writeFile(copy_file,JSON.stringify({}), (err) => {
			// In case of a error throw err.
			if (err){
				console.log("error occured"); 
				throw err;
			}
		})
	}
	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('multiple-copy.copymultiple',function () {
			// The code you place here will be executed every time your command is executed
	

			vscode.window.showInputBox({
				placeholder: 'Example: 1', // Placeholder
				prompt: 'Type copy/paste number', // An indication of what to do
				value: '0' // A value by default. In this case leave it empty
			  }).then(value => {
					// Use your parser here
					resource_cnt = value

					var editor = vscode.window.activeTextEditor;
					if (!editor) {
						return; // No open text editor
					}
					// Display a message box to the user
					var selection = editor.selection;
					var text = editor.document.getText(selection);
					var data = null
					// console.log(text)
					fs.readFile(copy_file,function(err,content){
						data = JSON.parse(content)
						
						var key = 'copy' + resource_cnt.toString()
						data[key] = {
							'value' : text
						}
						if(data!=null){
							fs.writeFile(copy_file,JSON.stringify(data),(err)=>{
								console.log(err)
							})
						}
					})
					vscode.window.showInformationMessage(text);
			});
				
			
	});

	let pastable = vscode.commands.registerCommand('multiple-copy.pastemultiple', async function () {
		// The code you place here will be executed every time your com
		var editor = vscode.window.activeTextEditor;
		//output.txt read -> insert at current_cursor_position location

		//show quickpick preview of copied instances..
		fs.readFile(copy_file,'utf8',async (err,data)=>{
			var readData = JSON.parse(data);
			var copied_items = []

			for(item in readData){
				console.log(readData[item]['value'])
				copied_items.push({label: readData[item]['value'],target: vscode.ConfigurationTarget.Global})
			}
			await vscode.window.showQuickPick(copied_items,{placeHolder: "Select copied.."}).then((response)=>{
				if(response!=null || response!=undefined){
					const position = editor.selection.active;
					console.log(response.label)

					editor.edit((editBuilder) =>
					editBuilder.insert(
							new vscode.Position(position._line , position._character),
							response.label
						)
					);
				}
				
			}).catch((err)=>{
				console.error(err);
			});
			
		})
		

		
	})
		

	context.subscriptions.push(disposable);
	context.subscriptions.push(pastable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
