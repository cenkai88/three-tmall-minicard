/**! __BUGME_START__ */ !function(){"use strict";var ERuntimeRemoteObjectType,ERuntimeRemoteObjectSubType;!function(e){e.Object="object",e.Function="function",e.Undefined="undefined",e.String="string",e.Number="number",e.Boolean="boolean",e.Symbol="Symbol",e.Bigint="bigint",e.Wasm="wasm"}(ERuntimeRemoteObjectType||(ERuntimeRemoteObjectType={})),function(e){e.Error="error",e.Array="array",e.Null="null"}(ERuntimeRemoteObjectSubType||(ERuntimeRemoteObjectSubType={}));var appxStackLine=/https:\/\/appx\/af-appx\.worker\.min\.js:\d+:\d+/,nativeScriptLine=/https:\/\/www\.alipay\.com\/?:\d+:\d+|\[native code\]/,pluginWorkerStackLine=/https:\/\/\d+\.hybrid\.\S+\.com\/__plugins__\/(\d+)\/index\.worker\.js:\d+:\d+/,appWorkerStackLine=/https:\/\/\d+\.hybrid\.\S+\.com\/index\.worker\.js:\d+:\d+/;function transformSourceUrl(e){try{return pluginWorkerStackLine.test(e)?e.replace(pluginWorkerStackLine,"Plugin-$1"):e.replace(appWorkerStackLine,"App")}catch(t){return e}}function formatStack(e){var t=e.split("\n"),n=t[0],s=t.slice(1).filter((function(e){return!appxStackLine.test(e)&&!nativeScriptLine.test(e)})).map(transformSourceUrl).map((function(e){return" "===e[0]?e:"    "+e}));return s.unshift(n),s.join("\n")}function error2RemoteObject(e){var t=e.name,n=e.message,s=e.stack;"string"!=typeof s&&(s=e.toString()),-1===s.indexOf(t)&&(s=e.toString()+"\n"+s);try{s=formatStack(s)}catch(e){}return{className:t,description:s,preview:{description:s,overflow:!1,properties:[{name:"stack",type:ERuntimeRemoteObjectType.String,value:s},{name:"message",type:ERuntimeRemoteObjectType.String,value:n}],subtype:ERuntimeRemoteObjectSubType.Error,type:ERuntimeRemoteObjectType.Object},subtype:ERuntimeRemoteObjectSubType.Error,type:ERuntimeRemoteObjectType.Object}}function isError(e){try{return"[object Error]"===Object.prototype.toString.call(e)}catch(e){return!1}}function getStartupParams(){if("undefined"!=typeof __appxStartupParams&&__appxStartupParams&&__appxStartupParams.appId)return __appxStartupParams;if("undefined"!=typeof my)try{return my.callSync("getStartupParams")||{}}catch(e){}return{}}var serverConfig={default:{domain:"hpmweb.alipay.com"},1:{domain:"hpmweb.alipay.com"}},ResponseEvent,RequestMethod,BreakStepType,FingerType;function getServerConfig(){var e=getStartupParams().remoteCh;return e&&serverConfig[e]?serverConfig[e]:serverConfig.default}!function(e){e.ById="Tyro.byId",e.Sticky="Tyro.sticky",e.StickyNotSendPaused="Tyro.stickyNotSendPaused",e.StickyAsync="Tyro.stickyAsync",e.ScriptSource="Tyro.scriptSource",e.Resumed="Debugger.resumed",e.ConsoleAPICalled="Runtime.consoleAPICalled"}(ResponseEvent||(ResponseEvent={})),function(e){e.DiscardConsoleEntries="Tyro.discardConsoleEntries",e.Evaluate="Tyro.evaluate",e.EvaluateOnCallFrame="Tyro.evaluateOnCallFrame",e.CallFunctionOn="Tyro.callFunctionOn",e.CompileScript="Tyro.compileScript",e.SetBreakpointsActive="Tyro.setBreakpointsActive",e.SetSkipAllPauses="Tyro.setSkipAllPauses",e.Resume="Tyro.resume",e.StepInto="Tyro.stepInto",e.StepOver="Tyro.stepOver",e.StepOut="Tyro.stepOut",e.Pause="Tyro.pause",e.GetPossibleBreakpoints="Tyro.getPossibleBreakpoints",e.SetBreakpointByUrl="Tyro.setBreakpointByUrl",e.SetBreakpoint="Tyro.setBreakpoint",e.RemoveBreakpoint="Tyro.removeBreakpoint",e.REPL="Tyro.repl",e.GetVariableValue="Tyro.getVariableValue",e.SetPauseOnExceptions="Tyro.setPauseOnExceptions",e.SetAsyncCallStackDepth="Tyro.setAsyncCallStackDepth",e.GetProperties="Tyro.getProperties"}(RequestMethod||(RequestMethod={})),function(e){e[e.Non=0]="Non",e[e.NextSticky=1]="NextSticky",e[e.StepOver=2]="StepOver",e[e.StepOut=3]="StepOut"}(BreakStepType||(BreakStepType={})),function(e){e[e.Entry=0]="Entry",e[e.Exit=1]="Exit"}(FingerType||(FingerType={}));var TyroUtil=function(){function e(){}return e.throwsMessage=function(e){return"[Throws: "+(e?e.message:"?")+"]"},e.safeGetValueFromPropertyOnObject=function(t,n){if(Object.prototype.hasOwnProperty.call(t,n))try{return t[n]}catch(t){return e.throwsMessage(t)}return t[n]},e.ensureProperties=function(t){var n=[];return function t(s){if(null===s||"object"!=typeof s)return s;if(-1!==n.indexOf(s))return"[Circular]";if(n.push(s),"function"==typeof s.toJSON)try{var i=t(s.toJSON());return n.pop(),i}catch(t){return e.throwsMessage(t)}if(Array.isArray(s)){var r=s.map(t);return n.pop(),r}var o=Object.keys(s).reduce((function(n,i){return n[i]=t(e.safeGetValueFromPropertyOnObject(s,i)),n}),{});return n.pop(),o}(t)},e.safeJSONStringify=function(t,n,s){return JSON.stringify(e.ensureProperties(t),n,s)},e.isWebIDE=function(){return!("undefined"==typeof navigator||!navigator)&&(navigator.swuserAgent||navigator.userAgent||"").indexOf("AlipayIDE")>-1},e}(),StickyFinger=function(){function StickyFinger(e,t,n,s){var i=this;this.isWebIDE=!1,this.asyncRequestMethod="tyroRequest",this.host=t,this.contextMap={},this.contextUrlMap={},this.breakpointMap={},this.breakpointIdMap={},this.debuggerMap={},this.objectMap={},this.originConsoleAPI={},this.requestTaskId=0,this.stickyMsgQueue=[],this.wsMsgQueue=[],this.wsIsOpen=!1,this.instrumentId=n,this.stickyFlag=s.stickyFlag,this.fingerFlag=s.fingerFlag,this.hookConsole(),this.stickyFlag&&(setTimeout((function(){i.socketTask=my.connectSocket({url:"wss://"+getServerConfig().domain+"/tyro/agent/"+i.instrumentId,multiple:!0});var e=function(){if(!i.wsIsOpen){i.originConsoleAPI.log("[tyro-agent] WebSocket 连接成功"),i.wsIsOpen=!0;for(var e=0,t=i.wsMsgQueue;e<t.length;e++){var n=t[e];i.socketTask.send({data:n})}i.wsMsgQueue=[]}};i.socketTask.onOpen((function(){e()})),i.socketTask.onClose((function(){i.originConsoleAPI.log("[tyro-agent] WebSocket 连接已关闭")})),i.socketTask.onMessage((function(t){i.wsIsOpen||e(),i.handleStickyAsync(JSON.parse(t.data.data))}))}),2e3),this.breakpointsActive=!0,this.skipAllPauses=!1,this.breakStepType=BreakStepType.Non,this.stackDepth=0,this.pauseOnExceptions="none",this.asyncCallStackDepth=0,this.lastStickyAsyncError=0,this.generateObjectId=0,this.globalExecutionContext=e,this.evaluateOnCallFrameExpression="",this.stickyNotSendPaused=!1,this.sendStickyParams=!1),this.fingerFlag&&(this.fingerId=0,this.fingerCache=[],this.fingerSendInterval=1e3,this.jsapiCallId=0,setInterval((function(){0!==i.fingerCache.length&&(i.sendPerf("Perf.trace",i.fingerCache),i.fingerCache=[])}),this.fingerSendInterval)),this.isWebIDE=TyroUtil.isWebIDE(),this.isWebIDE&&(this.asyncRequestMethod="tyroRequestAsync")}return StickyFinger.rewritePath=function(e){var t=e;return"."===t[0]&&(t=t.replace(".","")),t="app://"+(t=t.replace("tmp/data/build/",""))},StickyFinger.processRawContext=function(e){var t={path:this.rewritePath(e.path),contextId:String(e.contextId),scope:{0:[]},function:{},debuggerLine:e.debuggerLine,stickyLine:e.stickyLine};return e.scope&&Object.keys(e.scope).map((function(n){var s=e.scope[n],i=s.shift(),r=t.scope[i];t.scope[n]=r?r.concat(s.filter((function(e){return r.indexOf(e)<0}))):s})),e.function&&Object.keys(e.function).map((function(n){var s=e.function[n];t.function[n]={name:s[0],line:s[1]}})),t},StickyFinger.prototype.register=function(e,t){var n=String(e.contextId),s=StickyFinger.rewritePath(e.path);this.originConsoleAPI.log("[tyro-agent] register contextId "+n+" path "+s),this.contextMap[n]||this.breakpointMap[n]?this.originConsoleAPI.warn("[tyro-agent] duplicate context register "+n+" "+s):(this.contextMap[n]=StickyFinger.processRawContext(e),this.contextUrlMap[s]=n,this.breakpointMap[n]={},this.debuggerMap[n]=this.contextMap[n].debuggerLine.reduce((function(e,t){return e[t-1]=!0,e}),{}),this.stickyFlag&&this.xhrSend(ResponseEvent.ScriptSource,{scriptSource:t,scriptId:String(n),executionContextId:0,url:s}))},StickyFinger.prototype.sticky=function(e,t,n){if(!this.skipAllPauses&&this.breakpointsActive&&((this.debuggerMap[e]||{})[t]||(this.breakpointMap[e]||{})[t]||this.breakStepType===BreakStepType.NextSticky||this.breakStepType===BreakStepType.StepOver&&(new Error).stack.split("\n").length<=this.stackDepth||this.breakStepType===BreakStepType.StepOut&&(new Error).stack.split("\n").length<this.stackDepth||!0===this.sendStickyParams)){this.originConsoleAPI.log("[tyro-agent] sticky "+e+" "+t),this.breakStepType=BreakStepType.Non;var s={};if(this.stickyNotSendPaused)this.originConsoleAPI.log("[tyro-agent] stickyNotSendPaused");else{if(!this.sendStickyParams){this.originConsoleAPI.log("[tyro-agent] sticky sendStickyParams step 1"),s={callFrames:null,reason:"other",hitBreakpoints:[]};var i=this.breakpointMap[e][t];i&&s.hitBreakpoints.push(i);var r=(new Error).stack.split("\n");return this.stackDepth=r.length,Agent.isPhone?s.callFrames=this.processCallFramesPhone(String(e),t,n,r):s.callFrames=this.processCallFrames(String(e),t,n,r),this.stickyParams=s,this.sendStickyParams=!0,"(function(){\n          var localObject = {};\n          Agent.getScopeVariables().forEach(function (key) {\n            localObject[key] = (function(){try{return eval(key)}catch(e){return undefined}})();\n          });\n          Agent.inflateStickyParamsObject(localObject);\n          return true;\n        })()"}this.originConsoleAPI.log("[tyro-agent] sticky sendStickyParams step 2"),s=this.stickyParams,this.sendStickyParams=!1}this.originConsoleAPI.log("[tyro-agent] sticky params "+TyroUtil.safeJSONStringify(s));var o=JSON.parse(this.xhrSend(ResponseEvent.Sticky,s));return this.handleSticky(o)}},StickyFinger.prototype.fingerEntry=function(e,t){var n=this.contextMap[e].path,s=this.contextMap[e].function[t],i=this.generateFingerId(),r={time:Date.now(),file:n,line:s.line,name:s.name,id:i,type:FingerType.Entry};return this.fingerCache.push(r),i},StickyFinger.prototype.fingerExit=function(e,t,n){var s=this.contextMap[e].path,i=this.contextMap[e].function[t],r={time:Date.now(),file:s,line:i.line,name:i.name,id:n,type:FingerType.Exit};this.fingerCache.push(r)},StickyFinger.prototype.sendPerf=function(e,t){self.bugmeAPI?self.bugmeAPI.send({method:e,params:t}):self.document?self.document.addEventListener("bugmeInjected",(function(){self.bugmeAPI.send({method:e,params:t})})):self.addEventListener&&self.addEventListener("bugmeInjected",(function(){self.bugmeAPI.send({method:e,params:t})}))},StickyFinger.prototype.hookConsole=function(){var e=this;this.originConsoleAPI.log=console.log.bind(console),this.originConsoleAPI.debug=console.debug.bind(console),this.originConsoleAPI.info=console.info.bind(console),this.originConsoleAPI.error=console.error.bind(console),this.originConsoleAPI.warn=console.warn.bind(console),console.log=function(){for(var t,n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];if((t=e.originConsoleAPI).log.apply(t,n),!(n.length>0&&"string"==typeof n[0]&&(n[0].indexOf("[framework]")>=0||n[0].indexOf("dispatchEvent")>=0||n[0].indexOf("onMessage push")>=0))){var i={type:"log",args:n.map((function(t){return e.objectToRemoteObject(t,null,"object"==typeof t)})),executionContextId:0,timestamp:(new Date).getTime()};e.xhrSend(ResponseEvent.ConsoleAPICalled,i,null,!1)}},console.debug=function(){for(var t,n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];if((t=e.originConsoleAPI).debug.apply(t,n),!(n.length>0&&"string"==typeof n[0]&&(n[0].indexOf("[framework]")>=0||n[0].indexOf("dispatchEvent")>=0||n[0].indexOf("onMessage push")>=0))){var i={type:"debug",args:n.map((function(t){return e.objectToRemoteObject(t,null,"object"==typeof t)})),executionContextId:0,timestamp:(new Date).getTime()};e.xhrSend(ResponseEvent.ConsoleAPICalled,i,null,!1)}},console.info=function(){for(var t,n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];if((t=e.originConsoleAPI).info.apply(t,n),!(n.length>0&&"string"==typeof n[0]&&(n[0].indexOf("[framework]")>=0||n[0].indexOf("dispatchEvent")>=0||n[0].indexOf("onMessage push")>=0))){var i={type:"info",args:n.map((function(t){return e.objectToRemoteObject(t,null,"object"==typeof t)})),executionContextId:0,timestamp:(new Date).getTime()};e.xhrSend(ResponseEvent.ConsoleAPICalled,i,null,!1)}},console.error=function(){for(var t,n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];if((t=e.originConsoleAPI).error.apply(t,n),!(n.length>0&&"string"==typeof n[0]&&(n[0].indexOf("[framework]")>=0||n[0].indexOf("dispatchEvent")>=0||n[0].indexOf("onMessage push")>=0))){var i={type:"error",args:n.map((function(t){return e.objectToRemoteObject(t,null,"object"==typeof t)})),executionContextId:0,timestamp:(new Date).getTime()};e.xhrSend(ResponseEvent.ConsoleAPICalled,i,null,!1)}},console.warn=function(){for(var t,n=[],s=0;s<arguments.length;s++)n[s]=arguments[s];if((t=e.originConsoleAPI).warn.apply(t,n),!(n.length>0&&"string"==typeof n[0]&&(n[0].indexOf("[framework]")>=0||n[0].indexOf("dispatchEvent")>=0||n[0].indexOf("onMessage push")>=0))){var i={type:"warning",args:n.map((function(t){return e.objectToRemoteObject(t,null,"object"==typeof t)})),executionContextId:0,timestamp:(new Date).getTime()};e.xhrSend(ResponseEvent.ConsoleAPICalled,i,null,!1)}}},StickyFinger.prototype.inflateStickyParamsObject=function(e){if(0!==this.stickyParams.callFrames.length){this.generateObjectId+=1;var t=String(this.generateObjectId);this.objectMap[t]=e,this.stickyParams.callFrames[0].scopeChain.push({type:"local",name:this.stickyParams.callFrames[0].functionName,object:{className:"Object",description:"Object",objectId:t,type:"object"}})}},StickyFinger.prototype.processCallFrames=function(e,t,n,s){var i=this,r=[],o=s.slice(3,s.length).map((function(e){return e.substr(0,e.lastIndexOf(":")).replace("    at ","").replace(" (",":")})),a=0,c=!0;return o.map((function(t){var s=t.split(":"),o=s[0],p=i.contextMap[e].path,u=Number(s[s.length-1]),l=i.contextUrlMap[p]||"none",y=a+":"+u+":"+p;c&&(i.scopeVariables=void 0!==i.contextMap[e]?i.contextMap[e].scope[n]:[],c=!1);var h={callFrameId:y,functionName:o,location:{scriptId:l,lineNumber:u,columnNumber:0},url:p,scopeChain:[],this:{}};r.push(h),a+=1})),r},StickyFinger.prototype.processCallFramesPhone=function(e,t,n,s){var i=this,r=[],o=s.slice(2,s.length).map((function(e){return e.substr(0,e.lastIndexOf(":")).replace("    at ","").replace(" (",":").replace("@",":")})),a=0,c=!0;return o.map((function(s){var o=s.split(":"),p=o[0],u=i.contextMap[e].path,l=Number(o[o.length-1]),y=i.contextUrlMap[u]||"none",h=a+":"+l+":"+u;c&&(i.scopeVariables=void 0!==i.contextMap[e]?i.contextMap[e].scope[n]:[],i.originConsoleAPI.log("scopeVariables "+TyroUtil.safeJSONStringify(i.scopeVariables)),i.originConsoleAPI.log("scopeVariables "+TyroUtil.safeJSONStringify(i.contextMap[e])+" "+i.contextMap[e].scope+" "+n),c=!1);var d={callFrameId:h,functionName:p,location:{scriptId:y,lineNumber:t,columnNumber:0},url:u,scopeChain:[],this:{}};r.push(d),a+=1})),r},StickyFinger.prototype.stickyAsyncLoop=function(){this.xhrSend(ResponseEvent.StickyAsync,{})},StickyFinger.prototype.xhrSendJSAPI=function(e,t,n,s){var i,r=this;if(e===ResponseEvent.Sticky){var o;this.stickyMsgQueue.length>0?(this.stickyMsgQueue.push({method:this.stickyNotSendPaused?ResponseEvent.StickyNotSendPaused:ResponseEvent.Sticky,params:t}),o=TyroUtil.safeJSONStringify(this.stickyMsgQueue),this.stickyMsgQueue=[]):o=TyroUtil.safeJSONStringify({method:this.stickyNotSendPaused?ResponseEvent.StickyNotSendPaused:ResponseEvent.Sticky,params:t}),my.call("showRemoteDebugMask",{text:" ",buttonTitle:"断点命中",hide:!1}),this.stickyNotSendPaused=!1;var a=Date.now(),c=my.callSync("tyroRequest",{url:this.host+"/tyro/agent",method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8","instrument-id":this.instrumentId},data:o,timeout:6e5,blockTimeout:6e5,dataType:"json",requestTaskId:this.requestTaskId++});return my.call("showRemoteDebugMask",{hide:!0}),c.error||null===c?(null===c?this.originConsoleAPI.error("[tyro-agent] xhrSend error result is "+c):this.originConsoleAPI.error("[tyro-agent] xhrSend error "+c.error+" "+c.errorMessage),Date.now()-a>=5e3?this.xhrSendJSAPI(e,t,n,s):TyroUtil.safeJSONStringify({method:"default"})):200!==c.status?(this.originConsoleAPI.error("[tyro-agent] xhrSend status fail "+e+" "+c.status),TyroUtil.safeJSONStringify({method:"default"})):c.data}if(e===ResponseEvent.StickyAsync){var p=TyroUtil.safeJSONStringify({method:ResponseEvent.StickyAsync,params:t});this.originConsoleAPI.info("[tyro-agent] xhrSend async send "+p),my.call(this.asyncRequestMethod,{url:this.host+"/tyro/agent",method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8","instrument-id":this.instrumentId},data:p,timeout:6e5,dataType:"json",requestTaskId:this.requestTaskId++,success:function(e){r.lastStickyAsyncError=0,r.stickyAsyncLoop(),200===e.status?(r.originConsoleAPI.info("[tyro-agent] xhrSend async success "+e.status+" "+e.data),r.handleStickyAsync(JSON.parse(e.data))):r.originConsoleAPI.error("[tyro-agent] xhrSend async fail "+e.status+" "+e.data)},fail:function(e){r.lastStickyAsyncError>=3?setTimeout((function(){r.stickyAsyncLoop()}),3e3):(r.lastStickyAsyncError+=1,r.stickyAsyncLoop()),r.originConsoleAPI.error("[tyro-agent] xhrSend async error "+TyroUtil.safeJSONStringify(e))}})}switch(e){case ResponseEvent.ById:i={id:n,result:t};break;case ResponseEvent.ScriptSource:i={method:ResponseEvent.ScriptSource,params:t};break;case ResponseEvent.Resumed:i={method:ResponseEvent.Resumed,params:t};break;case ResponseEvent.ConsoleAPICalled:i={method:ResponseEvent.ConsoleAPICalled,params:t};break;default:return}s?this.stickyMsgQueue.push(i):this.wsIsOpen?this.socketTask.send({data:TyroUtil.safeJSONStringify(i)}):this.wsMsgQueue.push(TyroUtil.safeJSONStringify(i))},StickyFinger.prototype.xhrSend=function(e,t,n,s){var i=this;if(Agent.isPhone)return this.xhrSendJSAPI(e,t,n,s);var r,o=new XMLHttpRequest;if(e===ResponseEvent.Sticky){var a;if(o.open("POST",this.host+"/tyro/agent",!1),o.setRequestHeader("Content-Type","application/json;charset=UTF-8"),o.setRequestHeader("instrument-id",this.instrumentId),this.stickyMsgQueue.length>0){this.stickyMsgQueue.push({method:this.stickyNotSendPaused?ResponseEvent.StickyNotSendPaused:ResponseEvent.Sticky,params:t});try{a=TyroUtil.safeJSONStringify(this.stickyMsgQueue)}catch(e){this.originConsoleAPI.error(e),a=TyroUtil.safeJSONStringify({method:this.stickyNotSendPaused?ResponseEvent.StickyNotSendPaused:ResponseEvent.Sticky,params:t})}finally{this.stickyMsgQueue=[]}}else a=TyroUtil.safeJSONStringify({method:this.stickyNotSendPaused?ResponseEvent.StickyNotSendPaused:ResponseEvent.Sticky,params:t});if(this.stickyNotSendPaused=!1,o.send(a),200===o.status)return o.responseText;throw new Error("[sticky-finger] xhrSend error "+e+" "+o.status)}if(e===ResponseEvent.StickyAsync)return o.open("POST",this.host+"/tyro/agent",!0),o.setRequestHeader("Content-Type","application/json;charset=UTF-8"),o.setRequestHeader("instrument-id",this.instrumentId),o.onload=function(){if(i.lastStickyAsyncError=0,i.stickyAsyncLoop(),4!==o.readyState||200!==o.status)throw new Error("[tyro-agent] xhrSend async fail "+e+" "+o.readyState+" "+o.status);i.handleStickyAsync(JSON.parse(o.responseText))},o.onerror=function(){throw i.lastStickyAsyncError>=3?setTimeout((function(){i.stickyAsyncLoop()}),3e3):(i.lastStickyAsyncError+=1,i.stickyAsyncLoop()),new Error("[tyro-agent] xhrSend async error "+e+" "+o.readyState+" "+o.status)},void o.send(TyroUtil.safeJSONStringify({method:ResponseEvent.StickyAsync,params:t}));switch(o.open("POST",this.host+"/tyro/agent",!0),o.setRequestHeader("Content-Type","application/json;charset=UTF-8"),o.setRequestHeader("instrument-id",this.instrumentId),o.onload=function(){if(4!==o.readyState||200!==o.status)throw new Error("[tyro-agent] xhrSend async fail "+e+" "+o.readyState+" "+o.status)},o.onerror=function(){throw new Error("[tyro-agent] xhrSend async error "+e+" "+o.readyState+" "+o.status)},e){case ResponseEvent.ById:r={id:n,result:t};break;case ResponseEvent.ScriptSource:r={method:ResponseEvent.ScriptSource,params:t};break;case ResponseEvent.Resumed:r={method:ResponseEvent.Resumed,params:t};break;case ResponseEvent.ConsoleAPICalled:r={method:ResponseEvent.ConsoleAPICalled,params:t};break;default:return}s?this.stickyMsgQueue.push(r):o.send(TyroUtil.safeJSONStringify(r))},StickyFinger.prototype.handleSticky=function(e){var t=e.id,n=e.method,s=e.params;switch(n){case RequestMethod.DiscardConsoleEntries:return this.stickyNotSendPaused=!0,this.originConsoleAPI.log("[tyro-agent] DiscardConsoleEntries success"),"true";case RequestMethod.CallFunctionOn:return this.stickyNotSendPaused=!0,this.originConsoleAPI.log("[tyro-agent] CallFunctionOn TODO sticky"),"true";case RequestMethod.CompileScript:return this.stickyNotSendPaused=!0,this.originConsoleAPI.log("[tyro-agent] CompileScript success, "+TyroUtil.safeJSONStringify(s)),"true";case RequestMethod.SetBreakpointsActive:return this.stickyNotSendPaused=!0,this.breakpointsActive=s.active,this.originConsoleAPI.log("[tyro-agent] SetBreakpointsActive success, breakpointsActive "+this.breakpointsActive),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.SetSkipAllPauses:return this.stickyNotSendPaused=!0,this.skipAllPauses=s.skip,this.originConsoleAPI.log("[tyro-agent] SetSkipAllPauses success, skipAllPauses "+this.skipAllPauses),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.Resume:return this.xhrSend(ResponseEvent.Resumed,{}),this.originConsoleAPI.log("[tyro-agent] Resume success"),"false";case RequestMethod.StepInto:return this.xhrSend(ResponseEvent.Resumed,{}),this.breakStepType=BreakStepType.NextSticky,this.originConsoleAPI.log("[tyro-agent] StepInto success"),"false";case RequestMethod.StepOver:return this.xhrSend(ResponseEvent.Resumed,{}),this.breakStepType=BreakStepType.StepOver,this.originConsoleAPI.log("[tyro-agent] StepOver success"),"false";case RequestMethod.StepOut:return this.xhrSend(ResponseEvent.Resumed,{}),this.breakStepType=BreakStepType.StepOut,this.originConsoleAPI.log("[tyro-agent] StepOut success"),"false";case RequestMethod.GetPossibleBreakpoints:return this.stickyNotSendPaused=!0,this.getPossibleBreakpoints(t,s,!0),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.SetBreakpointByUrl:return this.stickyNotSendPaused=!0,this.setBreakpointByUrl(t,s,!0),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.SetBreakpoint:return this.stickyNotSendPaused=!0,this.setBreakpoint(t,s,!0),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.RemoveBreakpoint:return this.stickyNotSendPaused=!0,this.removeBreakpoint(t,s),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.REPL:return this.stickyNotSendPaused=!0,this.breakStepType=BreakStepType.NextSticky,"(function(){(function(){"+s.statement+"})();return true})()";case RequestMethod.GetVariableValue:this.stickyNotSendPaused=!0;var i=e.params;return this.breakStepType=BreakStepType.NextSticky,"(function(){(function(){\n          Agent.variableValue({"+i.map((function(e){return e+": (function(){try{return "+e+"}catch(e){return undefined}})()"})).join(",")+"})\n        })();return true})()";case RequestMethod.SetPauseOnExceptions:return this.stickyNotSendPaused=!0,this.setPauseOnExceptions(t,s),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.SetAsyncCallStackDepth:return this.stickyNotSendPaused=!0,this.setAsyncCallStackDepth(t,s),this.breakStepType=BreakStepType.NextSticky,"true";case RequestMethod.EvaluateOnCallFrame:return this.stickyNotSendPaused=!0,this.evaluateOnCallFrameExpression=s.expression,this.breakStepType=BreakStepType.NextSticky,"(function(){\n          var tyroRet,tyroErr;\n          try{tyroRet=eval(Agent.getEvaluateOnCallFrameExpression())}\n          catch(e){tyroErr=e}\n          Agent.evaluateOnCallFrame("+t+",tyroRet,tyroErr,"+s.generatePreview+");\n          return true;\n        })()";case RequestMethod.GetProperties:return this.stickyNotSendPaused=!0,this.getProperties(t,s,!0),this.breakStepType=BreakStepType.NextSticky,"true";default:return this.breakStepType=BreakStepType.NextSticky,"true"}},StickyFinger.prototype.handleStickyAsync=function(e){var t=e.id,n=e.method,s=e.params;switch(this.originConsoleAPI.log("[tyro-agent] handleStickyAsync "+t+", "+n+", "+s),n){case RequestMethod.DiscardConsoleEntries:this.originConsoleAPI.log("[tyro-agent] DiscardConsoleEntries success");break;case RequestMethod.Evaluate:this.originConsoleAPI.log("[tyro-agent] Evaluate start, expression "+s.expression);var i=this.evaluate(this.globalExecutionContext,t,s);this.originConsoleAPI.log("[tyro-agent] Evaluate success, expression "+s.expression+", result "+TyroUtil.safeJSONStringify(i));break;case RequestMethod.CallFunctionOn:this.originConsoleAPI.log("[tyro-agent] CallFunctionOn TODO stickyAsync");break;case RequestMethod.CompileScript:this.originConsoleAPI.log("[tyro-agent] CompileScript success, params "+TyroUtil.safeJSONStringify(s));break;case RequestMethod.SetBreakpointsActive:this.breakpointsActive=s.active,this.originConsoleAPI.log("[tyro-agent] SetBreakpointsActive success, breakpointsActive "+this.breakpointsActive);break;case RequestMethod.SetSkipAllPauses:this.skipAllPauses=s.skip,this.originConsoleAPI.log("[tyro-agent] SetSkipAllPauses success, skipAllPauses "+this.skipAllPauses);break;case RequestMethod.Pause:this.breakStepType=BreakStepType.NextSticky,this.originConsoleAPI.log("[tyro-agent] Pause success");break;case RequestMethod.GetPossibleBreakpoints:this.getPossibleBreakpoints(t,s);break;case RequestMethod.SetBreakpointByUrl:this.setBreakpointByUrl(t,s);break;case RequestMethod.SetBreakpoint:this.setBreakpoint(t,s);break;case RequestMethod.RemoveBreakpoint:this.removeBreakpoint(t,s);break;case RequestMethod.SetPauseOnExceptions:this.setPauseOnExceptions(t,s);break;case RequestMethod.SetAsyncCallStackDepth:this.setAsyncCallStackDepth(t,s);break;case RequestMethod.GetProperties:this.getProperties(t,s)}},StickyFinger.prototype.objectToRemoteObject=function(e,t,n){var s={};if(isError(e)&&(t=e),t)return error2RemoteObject(t);switch(s.type=typeof e,s.type){case"undefined":break;case"object":if(null===e){s.subtype="null",s.value=null;break}if(void 0!==e.constructor&&(s.className=e.constructor.name),void 0!==e.toString)try{s.description=e.toString()}catch(e){s.description="[object Object]"}else s.description="[object Object]";if(this.generateObjectId+=1,s.objectId=String(this.generateObjectId),this.objectMap[String(this.generateObjectId)]=e,n)for(var i in s.preview={type:"object",description:"Object",overflow:!1,properties:[]},e){var r=typeof e[i];s.preview.properties.push({name:i,type:r,value:"object"===r?"Object":"function"===r?"":e[i]})}break;case"function":s.description=e.toString(),s.className="Function";break;default:s.value=e,s.description=e.toString()}return s},StickyFinger.prototype.evaluateOnCallFrame=function(e,t,n,s){var i=this.objectToRemoteObject(t,n,s);return this.xhrSend(ResponseEvent.ById,{result:i},e,!0),i},StickyFinger.prototype.evaluate=function(executionContext,id,params){var returnValue,error;try{returnValue=function(expression){return"function"==typeof eval?eval(expression):Agent.evalReference(expression)}.call(executionContext,params.expression)}catch(e){error=e}var result=this.objectToRemoteObject(returnValue,error,params.generatePreview);return this.xhrSend(ResponseEvent.ById,{result:result},id),result},StickyFinger.prototype.getPossibleBreakpoints=function(e,t,n){var s=t.scriptId,i=t.startLine,r=t.endLine===t.startLine?t.endLine+1:t.endLine,o={locations:[]};if(this.contextMap[s])for(var a=this.contextMap[s].stickyLine,c=i;c<r;c++)a.includes(c)&&o.locations.push({scriptId:s,lineNumber:c,columnNumber:0});else this.originConsoleAPI.warn("[tyro-agent] getPossibleBreakpoints no scriptId "+s+" in contextMap");this.originConsoleAPI.log("[tyro-agent] getPossibleBreakpoints success, result: "+TyroUtil.safeJSONStringify(o)),this.xhrSend(ResponseEvent.ById,o,e,n)},StickyFinger.prototype.setBreakpointByUrl=function(e,t,n){var s=t.scriptId,i=t.url,r=t.lineNumber;if(this.contextMap[s])if(this.contextMap[s].stickyLine.includes(r)){var o=s+":"+r+":0:"+i,a={breakpointId:o,locations:[{scriptId:s,lineNumber:r,columnNumber:0}]};this.breakpointMap[s][r]=o,this.breakpointIdMap[o]={contextId:s,line:r},this.originConsoleAPI.log("[tyro-agent] setBreakpointByUrl success, scriptId: "+s+", url: "+i+", lineNumber: "+r),this.xhrSend(ResponseEvent.ById,a,e,n)}else this.originConsoleAPI.warn("[tyro-agent] setBreakpointByUrl not sticky line, scriptId: "+s+", url: "+i+", lineNumber: "+r);else this.originConsoleAPI.warn("[tyro-agent] setBreakpointByUrl no contextMap, scriptId: "+s)},StickyFinger.prototype.setBreakpoint=function(e,t,n){var s=t.scriptId,i=t.lineNumber;if(this.contextMap[s])if(this.contextMap[s].stickyLine.includes(i)){var r=s+":"+i+":0",o={breakpointId:r,actualLocation:{scriptId:s,lineNumber:i,columnNumber:0}};this.breakpointMap[s][i]=r,this.breakpointIdMap[r]={contextId:s,line:i},this.originConsoleAPI.log("[tyro-agent] setBreakpoint success, scriptId: "+s+", lineNumber: "+i),this.xhrSend(ResponseEvent.ById,o,e,n)}else this.originConsoleAPI.warn("[tyro-agent] setBreakpoint not sticky line, scriptId: "+s+", lineNumber: "+i);else this.originConsoleAPI.warn("[tyro-agent] setBreakpoint no contextMap, scriptId: "+s)},StickyFinger.prototype.removeBreakpoint=function(e,t){var n=t.breakpointId,s=this.breakpointIdMap[n];s||this.originConsoleAPI.warn("[tyro-agent] removeBreakpoint no breakpointId "+n);var i=s.contextId,r=s.line;delete this.breakpointMap[i][r],this.originConsoleAPI.log("[tyro-agent] removeBreakpoint success, breakpointId: "+n+", scriptId: "+i+", line: "+r)},StickyFinger.prototype.setPauseOnExceptions=function(e,t){t&&["none","uncaught","all"].includes(t.state)?(this.pauseOnExceptions=t.state,this.originConsoleAPI.log("[tyro-agent] setPauseOnExceptions success, pauseOnExceptions state "+this.pauseOnExceptions)):this.originConsoleAPI.warn("[tyro-agent] setPauseOnExceptions state invalid: "+TyroUtil.safeJSONStringify(t))},StickyFinger.prototype.setAsyncCallStackDepth=function(e,t){!t||"number"!=typeof t.maxDepth||t.maxDepth<0?this.originConsoleAPI.warn("[tyro-agent] setAsyncCallStackDepth maxDepth invalid: "+TyroUtil.safeJSONStringify(t)):(this.asyncCallStackDepth=t.maxDepth,this.originConsoleAPI.log("[tyro-agent] setAsyncCallStackDepth success, maxDepth "+this.asyncCallStackDepth))},StickyFinger.prototype.getProperties=function(e,t,n){var s=t.objectId,i=this.objectMap[s],r=[];for(var o in i)r.push({name:o,value:this.objectToRemoteObject(i[o])});this.xhrSend(ResponseEvent.ById,{result:r},e,n)},StickyFinger.prototype.generateFingerId=function(){return this.fingerId+=1,this.fingerId},StickyFinger}(),Agent=function(){function e(t,n){if(e.singleton)return e.singleton;this.host="https://"+getServerConfig().domain,this.stickyFinger=new StickyFinger("undefined"!=typeof window?window:self,this.host,t,n)}return e.getShadowMethod=function(){this.globalReference=self,"function"==typeof eval?this.evalReference=eval:"function"==typeof __eval&&(this.evalReference=__eval)},e.setShadowMethod=function(){this.globalReference.eval=this.evalReference},e.setInstrumentId=function(e){this.instrumentId=e},e.register=function(t,n){if(!e.singleton){if(!this.instrumentId&&"undefined"!=typeof my)try{this.instrumentId=getStartupParams().tyroId}catch(e){}e.instance(this.instrumentId,t)}e.singleton.stickyFinger.register(t,n)},e.sticky=function(t,n,s){return e.singleton.stickyFinger.sticky(t,n,s)},e.getEvaluateOnCallFrameExpression=function(){return e.singleton.stickyFinger.evaluateOnCallFrameExpression},e.evaluateOnCallFrame=function(t,n,s,i){return e.singleton.stickyFinger.evaluateOnCallFrame(t,n,s,i)},e.getScopeVariables=function(){return e.singleton.stickyFinger.scopeVariables},e.inflateStickyParamsObject=function(t){return e.singleton.stickyFinger.inflateStickyParamsObject(t)},e.entry=function(t,n){return e.singleton.stickyFinger.fingerEntry(t,n)},e.exit=function(t,n,s){e.singleton.stickyFinger.fingerExit(t,n,s)},e.instance=function(t,n){e.singleton=new e(t,n)},e.isPhone=!0,e.instrumentId=null,e}();Agent.getShadowMethod();var globalReference="undefined"!=typeof window?window:self;globalReference.Agent||(globalReference.StickyFinger=StickyFinger,globalReference.Agent=Agent)}();
 /**! __BUGME_END__ */
require('@alipay/appx-compiler/lib/sjsEnvInit');
AFAppX.Plugin({ config: {
  "publicComponents": {
    "mini-card": "component/mini-card"
  }
},

run: function(){
require('../../../../widget/component/mini-card?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
},
});