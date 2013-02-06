
////////////////////////////////////////////////////////////////////////////////
//
// XHRFactory.js - Part of the AspectJS library: a JavaScript meta-programming
// resource and complementary components.
//
// Copyright (c) Dodeca Technologies Ltd 2007 - 2008.
//
// Designed and developed by Richard Vaughan.
//

var XHRFactory = function ()
   {
   function NullFunc () { }

   var setNoCaching     = function (XHRObj)           { XHRObj.setRequestHeader ("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT"); };
   var overrideMimeType = function (XHRObj, MimeType) { XHRObj.overrideMimeType (MimeType);   };
   var clearBaseHandler = function (XHRObj)           { XHRObj.onreadystatechange = NullFunc; };

   // ------------------------------------------------------------------------------------------------

   function createNativeXHR () { return new XMLHttpRequest ();                      }
   function createMSXHR_1   () { return new ActiveXObject  ("Microsoft.XMLHTTP");   }
   function createMSXHR_2   () { return new ActiveXObject  ("Msxml2.XMLHTTP");      }

   function throwNoXHR      () { throw  new Error ("XMLHTTPRequest not supported"); }

   var createXHR_ = function ()
      {
      if (window.XMLHttpRequest)
         {
         setNoCaching = NullFunc;
         createXHR_   = createNativeXHR;

         return createXHR_ ();

         }

      else if (window.ActiveXObject)
         {
         var XHRObj = null;

         overrideMimeType =
         clearBaseHandler = NullFunc;

         try { XHRObj = new ActiveXObject ("Msxml2.XMLHTTP"); }
         catch (E)
            {
            try { XHRObj = new ActiveXObject ("Microsoft.XMLHTTP"); }
            catch (E_)
               {
               createXHR_ = throwNoXHR;
               createXHR_ ();
               }

            createXHR_ = createMSXHR_1;

            return XHRObj;

            }

         createXHR_ = createMSXHR_2;

         return XHRObj;

         }

      else
         {
         createXHR_ = throwNoXHR;
         createXHR_ ();
         }

      };


   // ------------------------------------------------------------------------------------------------

   return {

      CreateXHR        : function () { return createXHR_ (); },
      CreateXHRWrapper : function ()
         {
         var XHRObj  = createXHR_ ();
         var OnGoing = false;
         var Wrapper = {

            // --------------------------------------------------------

            GetXHRObj : function () { return XHRObj; },
            Abort     : function ()
               {
               clearBaseHandler (XHRObj);
               XHRObj.abort     ();

               OnGoing = false;

               },

            // --------------------------------------------------------

            DoTxn     : function (Method, URL, respHandler, Data, ASync, MimeType, errHandler)
               {
               if (OnGoing) { throw new Error ('Cannot launch one XHR transaction while another is on-going.'); }

               OnGoing = true;

               var baseHandler = function ()
                  {
                  if (XHRObj.readyState === 4)
                     {
                     baseHandler = NullFunc;
                     OnGoing     = false;

                     if (XHRObj.status === 200) { if (respHandler) { respHandler (XHRObj); } }
                     else                       { if (errHandler)  { errHandler  (XHRObj); } }

                     }

                  };

               // --------------------------------------------------------

               if (ASync === undefined) { ASync = true; }

               XHRObj.open (Method, URL, ASync);

               if (MimeType)         { overrideMimeType (XHRObj, MimeType); }
               if (Method === "GET") { setNoCaching     (XHRObj);           }
               if (Method === "POST")
                  {
                  XHRObj.setRequestHeader ("Content-Type",  "application/x-www-form-urlencoded");
                  XHRObj.setRequestHeader ("Content-length", Data.length);
                  XHRObj.setRequestHeader ("Connection",    "close");
                  }

               XHRObj.onreadystatechange = baseHandler;

               XHRObj.send (Data);
                                                               // If running on Firefox, this will call baseHandler, and all is well. If running on anything else,
               if (ASync === false) { baseHandler (); }        // baseHandler will have executed by this point, in which case that symbol will now point to NullFunc,
                                                               // meaning that this statement will do nothing when executed, and again all is well.
               return Wrapper;

               }

            };

         return Wrapper;

         }

      };

   } ();
