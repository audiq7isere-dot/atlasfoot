'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'
import {createClient} from '@supabase/supabase-js'
const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')
export default function Utilisateurs(){
 const [me,setMe]=useState(null),[users,setUsers]=useState([]),[msg,setMsg]=useState('')
 useEffect(()=>{init()},[])
 async function init(){
  const {data:{user}}=await supabase.auth.getUser()
  if(!user)return setMsg('Connecte-toi avec le compte administrateur.')
  const {data:p}=await supabase.from('profiles').select('is_admin').eq('id',user.id).single()
  if(!p?.is_admin)return setMsg('Accès réservé à l’administrateur.')
  setMe(user)
  const {data,error}=await supabase.rpc('admin_list_users')
  if(error)return setMsg(error.message)
  setUsers(data||[])
 }
 if(!me)return <main className="wrap" style={{padding:'50px 0'}}><Link href="/" className="brand">ATLAS<b>FOOT</b></Link><div className="card" style={{marginTop:20}}>{msg||'Vérification du compte…'}</div></main>
 return <><header className="top"><div className="wrap nav"><Link className="brand" href="/">ATLAS<b>FOOT</b></Link><Link className="btn dark" href="/admin/moderation">← Modération</Link></div></header><main className="wrap" style={{padding:'32px 0'}}><span className="eyebrow">👥 ADMINISTRATION</span><h1>Utilisateurs</h1><div className="card" style={{marginBottom:20}}><div className="meta">Nombre total d’inscrits</div><div style={{fontSize:42,fontWeight:900}}>{users.length}</div></div><div className="card"><h2>Comptes inscrits</h2>{users.length===0?<p className="meta">Aucun utilisateur.</p>:users.map(u=><div key={u.id} style={{padding:'14px 0',borderBottom:'1px solid #26382f'}}><div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}><b>{u.username||'Supporter'}</b>{u.is_admin&&<span className="eyebrow">ADMIN</span>}</div><div>{u.email}</div><div className="meta">Inscrit le {new Date(u.created_at).toLocaleString('fr-FR')}{u.email_confirmed_at?' · E-mail vérifié':' · E-mail non vérifié'}</div></div>)}</div></main></>
}