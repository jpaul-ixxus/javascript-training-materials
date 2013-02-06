readme
NOTES
You can use load(), get() and post() with JQuery Ajax.

1. load.htm (works with message.txt)
- uses the load() method to pull data from server Asynchronously
EXERCISE: make this into a function. Load a different file into page depending on what they click.

2. partload.htm (works with article.htm)
- loads part of a page Asynchronously with load()
EXERCISE: Make into function. Load different parts of page into page depending on where they click.

3. ajaxget.htm (works with getter.php)
- uses the get() method to pull data Asynchronously from server.
You could use this with server side.

4. dynamic.htm (works with ht.txt and it.txt)
Uses load() to Asynchronously load content when required.

5. loadcallback.htm (works with message.txt)
Gives a response back when page is loaded.

6.loaddynamic.htm (works with one.txt, two.txt, three.txt, four.txt. five.txt)
Uses load() to Asynchronously load content when required.
Provides 'loading message' when loading.
Change one.txt to ones.txt on line 19 to see loading message.

------------
Examples:
Example: Save some data to the server and notify the user once it's complete.
$.ajax({
  type: "POST",
  url: "takein.php",
  data: { name: "John", location: "Boston" }
}).done(function( msg ) {
  alert( "Data Saved: " + msg );
});
Example: Retrieve the latest version of an HTML page.
$.ajax({
  url: "test.html",
  cache: false
}).done(function( html ) {
  $("#results").append(html);
});
Example: Send an xml document as data to the server. By setting the processData option to false, the automatic conversion of data to strings is prevented.
var xmlDocument = [create xml document];
var xmlRequest = $.ajax({
  url: "page.php",
  processData: false,
  data: xmlDocument
});

xmlRequest.done(handleResponse);
Example: Send an id as data to the server, save some data to the server, and notify the user once it's complete. If the request fails, alert the user.
var menuId = $("ul.nav").first().attr("id");
var request = $.ajax({
  url: "script.php",
  type: "POST",
  data: {id : menuId},
  dataType: "html"
});

request.done(function(msg) {
  $("#log").html( msg );
});

request.fail(function(jqXHR, textStatus) {
  alert( "Request failed: " + textStatus );
});
Example: Load and execute a JavaScript file.
$.ajax({
  type: "GET",
  url: "test.js",
  dataType: "script"
});