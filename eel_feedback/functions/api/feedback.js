// Cloudflare Pages Function. Configure GOOGLE_SCRIPT_URL as a Pages environment variable.
const KEYS=['setup','safety','equipment','personnel','expertise','finishing'];
export async function onRequestPost({request,env}) {
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
  const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
  if(!env.GOOGLE_SCRIPT_URL || !/^https:\/\/script\.google\.com\/macros\/s\//.test(env.GOOGLE_SCRIPT_URL))return reply(503,{ok:false,error:'The feedback spreadsheet is not connected yet.'});
  if(Number(request.headers.get('content-length')||0)>25000)return reply(413,{ok:false,error:'Submission is too large.'});
  let data;try{data=await request.json();}catch{return reply(400,{ok:false,error:'Invalid submission.'});}
  if(!data||typeof data!=='object'||Array.isArray(data))return reply(400,{ok:false,error:'Invalid submission.'});
  if(data.website)return reply(200,{ok:true}); // simple bot honeypot
  const clean={};
  for(const k of KEYS){const rating=data[k+'_rating'];if(!['1','2','3','4','5','Not observed'].includes(rating))return reply(400,{ok:false,error:'Please complete all six ratings.'});clean[k+'_rating']=rating;clean[k+'_comment']=typeof data[k+'_comment']==='string'?data[k+'_comment'].slice(0,1200):'';}
  for(const k of ['strengths','improvements'])clean[k]=typeof data[k]==='string'?data[k].slice(0,1200):'';
  try{const upstream=await fetch(env.GOOGLE_SCRIPT_URL,{method:'POST',headers:{'content-type':'text/plain;charset=UTF-8'},body:JSON.stringify(clean),redirect:'follow'});if(!upstream.ok)return reply(502,{ok:false,error:'Unable to save feedback right now.'});const result=await upstream.json();if(!result.ok)return reply(502,{ok:false,error:'Unable to save feedback right now.'});return reply(200,{ok:true});}catch{return reply(502,{ok:false,error:'The feedback service is temporarily unavailable. Please retry.'});}
}
export function onRequestGet(){return new Response(JSON.stringify({ok:false,error:'Method not allowed'}),{status:405,headers:{'content-type':'application/json'}});}
