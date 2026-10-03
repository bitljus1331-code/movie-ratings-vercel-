export default async function handler(req,res){
 const id=String(req.query.id||"");
 if(!/^tt\d{5,12}$/i.test(id))return res.status(400).json({error:"Неверный IMDb ID"});
 const apiKey=process.env.OMDB_API_KEY;
 if(!apiKey)return res.status(500).json({error:"На сервере не настроен OMDB_API_KEY"});
 try{
  const r=await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(apiKey)}&i=${encodeURIComponent(id)}&plot=short`);
  const d=await r.json();
  if(d.Response==="False")return res.status(404).json({error:d.Error||"Не найдено"});
  return res.status(200).json({imdbId:d.imdbID||id,title:d.Title||"",year:(d.Year||"").match(/\d{4}/)?.[0]||"",poster:d.Poster&&d.Poster!=="N/A"?d.Poster:"",type:d.Type||"movie"});
 }catch(e){return res.status(500).json({error:"Не удалось получить данные OMDb"})}
}