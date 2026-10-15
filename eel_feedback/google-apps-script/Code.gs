// Create a Google Sheet, then Extensions > Apps Script. Paste this code.
// Deploy as Web App: Execute as Me; Who has access: Anyone.
const SHEET_NAME='Anonymous Feedback';
const CATEGORIES=['setup','safety','equipment','personnel','expertise','finishing'];
function doPost(e){
  const out=(x)=>ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);
  try{
    const p=JSON.parse(e.postData.contents);
    if(!p||typeof p!=='object'||Array.isArray(p))throw Error('Invalid input');
    const lock=LockService.getScriptLock();lock.waitLock(20000);
    try{
      const ss=SpreadsheetApp.getActiveSpreadsheet();
      let sh=ss.getSheetByName(SHEET_NAME);
      const fields=CATEGORIES.flatMap(k=>[k+'_rating',k+'_comment']).concat(['strengths','improvements']);
      if(!sh){sh=ss.insertSheet(SHEET_NAME);sh.appendRow(['Submitted at',...fields]);sh.setFrozenRows(1);}
      const safe=(v)=>{const s=String(v??'').slice(0,1200);return /^[\s]*[=+\-@]/.test(s)?"'"+s:s;};
      for(const k of CATEGORIES)if(!['1','2','3','4','5','Not observed'].includes(p[k+'_rating']))throw Error('Missing rating');
      sh.appendRow([new Date(),...fields.map(k=>safe(p[k]))]);
      return out({ok:true});
    }finally{lock.releaseLock();}
  }catch(err){return out({ok:false,error:'Invalid or unsuccessful submission'});}
}
