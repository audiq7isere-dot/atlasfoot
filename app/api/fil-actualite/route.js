import {createClient} from '@supabase/supabase-js'

export const dynamic='force-dynamic'
export const revalidate=0

const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL||'https://czwiqkbojqqdatqohnrs.supabase.co',process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'sb_publishable_9H0YCCeSFQ-KgWucLDQ__w_au0A3nqP')

const feeds=[
 {category:'Lions de l’Atlas',q:'Maroc football équipe nationale OR "L