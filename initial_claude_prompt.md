I want to build a simple website in node.js that is connected to a sqlite database. 
The website consists of a simple frontend for a simple picture database. 
The functionality of the website should be as follows: upload a picture with a description, list all uploaded pictures (as thumbnails) with their descriptions, show a picture in full detail (with its description).. Delete actions should be be possible from the list of pictures shown. When a picture is shown in full detail, it is also possible to update its description. 

Each database record consists of a picture description and picture, uploaded to the website by the user. Use a modern, attractive UI design. 
Make the color scheme and the buttons used easily customizable, and also responsive and flexible for different screen types and devices. 
Create each webpage , then test it. 
Only if it works correctly, create another webpage. 
In a first version of the website, use technology to run the website and the database locally on a W11 machine . 
But prepare it in a next iteration to be deployed to Azure, using an azure webapp service. In that case use SQLite with the Azure Website so you can keep the database file within your deployment package so it will stay at the same server where your website is. 
Although the first version will be run locally, prepare the website for user authentication in Azure using EntraID, giving access to the website when the user has sufficient autorisation (to be configured in Entra ID later on). 

Now produce 2 files for me that I can download: 
* a planning.md file containing high-level vision, architecture, constraints, tech stack, tools, etc for this application
* a task.md file that lists all tasks needed in a bulleted list that can be used to monitor progress.