'use client'
import Link from 'next/link'
import {useEffect,useMemo,useState} from 'react'
import {createClient} from '@supabase/supabase-js'

const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')
const squad=[
{name:'Yassine Bounou',role:'GK'},{name:'Munir Mohamedi',role:'GK'},{name:'El Mehdi Benabid',role:'GK'},
{name:'Achraf Hakimi',role:'RB'},{name:'Noussair Mazraoui',role:'LB'},{name:'Nayef Aguerd',role:'CB'},{name:'Chadi Riad',role:'CB'},{name:'Romain Saïss',role:'CB'},{name:'Adam Masina',role:'CB'},{name:'Yahya Attiat-Allah',role:'LB'},
{name:'Sofyan Amrabat',role:'DM'},{name:'Azzedine Ounahi',role:'CM'},{name:'Bilal El Khannouss',role:'CM'},{name:'Ismael Saibari',role:'CM'},{name:'Neil El Aynaoui',role:'CM'},{name:'Eliesse Ben Seghir',role:'AM'},{name:'Oussama Targhalline',role:'DM'},
{name:'Brahim Díaz',role:'RW'},{name:'Abde Ezzalzouli',role:'LW'},{name:'Soufiane Rahimi',role:'FW'},{name:'Ayoub El Kaabi',role:'ST'},{name:'Youssef En-Nesyri',role:'ST'},{name:'Ilias Akhomach',role:'RW'},{name:'Chemsdine Talbi',role:'RW'}]
const formations={
'4-3-3':[{r:'GK',x:50,y:88},{r:'LB',x:16,y:70},{r:'CB',x:38,y:70},{r:'CB',x:62,y:70},{r:'RB',x:84,y:70},{r:'CM',x:28,y:47},{r:'DM',x:50,y:54},{r:'CM',x:72,y:47},{r:'LW',x:20,y:22},{r:'ST',x:50,y:16},{r:'RW',x:80,y:22}],
'4-2-3-1':[{r:'GK',x:50,y:88},{r:'LB',x:16,y:70},{r:'CB',x:38,y:70},{r:'CB',x:62,y:70},{r:'RB',x:84,y:70},{r:'DM',x:38,y:52},{r:'DM',x:62,y:52},{r:'LW',x:20,y:31},{r:'AM',x:50,y:32},{r:'RW',x:80,y:31},{r:'ST',x:50,y:14}],
'4-4-2':[{r:'GK',x:50,y:88},{r:'LB',x:16,y:70},{r:'CB',x:38,y:70},{r:'CB',x:62,y:70},{r:'RB',x:84,y:70},{r:'LW',x:17,y:45},{r:'CM',x:40,y:47},{r:'CM',x:60,y:47},{r:'RW',x:83,y:45},{r:'ST',x:38,y:18},{r:'ST',x:62,y:18}]}
const eligible=(role,p)=>role===p.role||(role==='CM'&&['CM','DM','AM'].includes(p.role))||(role==='DM'&&['DM','CM'].includes(p.role))||(role==='AM'&&['AM','CM','RW','LW'].includes(p.role))||(role==='LW'&&['LW','FW'].includes(p.role))||(role==='RW'&&['RW','FW'].includes(p.role))||(role==='ST'&&['ST','FW'].includes(p.role))||(role==='LB'&&['LB','CB'].includes(p.role))||(role==='RB'&&['RB','CB'].includes(p.role))
const fallback=['Yassine Bounou','Noussair Mazraoui','Nayef Aguerd','Chadi Riad','Achraf Hakimi','Azzedine Ounahi','Sofyan Amrabat','Bilal El Khannouss','Abde Ezzalzouli','Ayoub El Kaabi','Brahim Díaz']
export default function MonXI(){
 const [formation,setFormation]=useState('4-3-3'),[selected,setSelected]=useState(fallback),[votes,setVotes]=useState([]),[user,setUser]=useState(null),[toast,setToast]=useState('')
 const say=t=>{setToast(t);setTimeout(()=>setToast(''),4500)}
 useEffect(()=>{supabase.auth.getUser().then(({data})=>setUser(data.user||null));supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null));load()},[])
 async function load(){const {data}=await supabase.from('lineup_votes').select('formation,players');setVotes(data||[])}
 function choose(i,name){const next=[...selected];next[i]=name;setSelected(next)}
 async function save(){if(!user)return say('Connecte-toi dans le Café des Lions pour enregistrer ton XI.');if(new Set(selected).size!==11)return say('Un joueur ne peut apparaître qu’une seule fois.');const {error}=await supabase.from('lineup_votes').upsert({voter_id:user.id,formation,players:selected,updated_at:new Date().toISOString()},{onConflict:'voter_id'});if(error)return say('Vote impossible : '+error.message);say('✅ Ton XI a été enregistré.');load()}
 const counts=useMemo(()=>{const c={};votes.forEach(v=>(v.players||[]).forEach(n=>c[n]=(c[n]||0)+1));return c},[votes])
 const community=useMemo(()=>formations[formation].map(slot=>squad.filter(p=>eligible(slot.r,p)).sort((a,b)=>(counts[b.name]||0)-(counts[a.name]||0))[0]?.name||'À déterminer'),[formation,counts])
 const pct=n=>votes.length?Math.round((counts[n]||0)*100/votes.length):0
 return <><header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><nav className="navlinks"><Link href="/">Actualités</Link><Link className="active" href="/mon-xi">Mon XI</Link><Link href="/cafe">☕ Café des Lions</Link></nav></div></header>
<section className="hero xiHero"><div className="wrap"><span className="eyebrow">🇲🇦 LE CHOIX DES SUPPORTERS</span><h1>COMPOSE <em>TON XI DU MAROC</em></h1><p>Choisis les joueurs à leur vrai poste. Chaque bulletin alimente automatiquement le XI préféré de la communauté.</p></div></section>
<main className="wrap xiPage"><div className="xiToolbar"><div><b>Formation</b><select className="select" value={formation} onChange={e=>{setFormation(e.target.value);setSelected(Array(11).fill(''))}}>{Object.keys(formations).map(f=><option key={f}>{f}</option>)}</select></div><div className="voteCount"><strong>{votes.length}</strong><span>vote{votes.length>1?'s':''} enregistré{votes.length>1?'s':''}</span></div><button className="btn red" onClick={save}>Enregistrer mon XI</button></div>
<div className="xiGrid"><section><div className="pitch interactivePitch">{formations[formation].map((slot,i)=><div className="player pickPlayer" key={i} style={{left:slot.x+'%',top:slot.y+'%'}}><div className="shirt">{i+1}</div><select value={selected[i]||''} onChange={e=>choose(i,e.target.value)}><option value="">{slot.r}</option>{squad.filter(p=>eligible(slot.r,p)).map(p=><option value={p.name} key={p.name}>{p.name}</option>)}</select></div>)}</div></section>
<aside className="card communityXI"><span className="eyebrow">XI DE LA COMMUNAUTÉ</span><h2>{formation}</h2><p className="meta">Pourcentage = part des votants ayant sélectionné le joueur.</p><div className="communityList">{community.map((n,i)=><div className="communityRow" key={i}><span>{i+1}</span><div><b>{n}</b><small>{formations[formation][i].r}</small></div><strong>{pct(n)}%</strong></div>)}</div><Link className="btn dark full" href="/cafe">💬 Débattre de ce XI au Café</Link></aside></div></main>{toast&&<div className="toast">{toast}</div>}</>}
