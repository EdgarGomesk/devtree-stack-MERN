import { useEffect, useState } from 'react'
import {social} from '../data/social'
import DevTreeInput from '../components/DevTreeInput'
import { isValidUrl } from '../utils'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../api/devTreeAPI'
import { User } from '../types'
import {SocialNetwork} from '../types/index'

export default function LinkTreeView() {

    const [devTreeLinks, setDevTreeLinks] = useState(social)
    const queryClient = useQueryClient()
    const user : User = queryClient.getQueryData(['user'])!
    
    const {  mutate } = useMutation({
        mutationFn: updateUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Actualizado Correctamente')
        }
    })

    useEffect(() => {

        const updateData = devTreeLinks.map( item => {
            const userLink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
            if(userLink){
                return {...item, url: userLink.url, enabled: userLink.enabled}
            }
            return item
        })
        setDevTreeLinks(updateData)
    }, [])

    const handleUrlChange = (e : React.ChangeEvent<HTMLInputElement>) => {
       const updatedLinks = devTreeLinks.map( link => link.name === e.target.name ? {...link, url: e.target.value}: link)
       console.log(updatedLinks)
       setDevTreeLinks(updatedLinks)
       queryClient.setQueryData(['user'], (prevData: User) => {
        return {
            ...prevData,
            links: JSON.stringify(updatedLinks)
        }
    })
    }

    const handleEnableLink = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map(link => {
            if(link.name === socialNetwork) {
                if(isValidUrl(link.url)){
                    return {...link, enabled: !link.enabled}
                }else {
                    toast.error('URL no valida')
                    return link
                }
               
            } else {
                return link
            }
        })


        console.log(updatedLinks);
        setDevTreeLinks(updatedLinks);

        queryClient.setQueryData(['user'], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks)
            }
        })
}
    
    return (
        <div className='space-y-5'>
            {devTreeLinks.map( item => (
                <DevTreeInput 
                    key={item.name}
                    item={item}
                    handleUrlChange = {handleUrlChange}
                    handleEnableLink = {handleEnableLink}
                />
            ))}
            <button
            onClick={() => mutate(user)}
            className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold'>Guardar cambios</button>
        </div>
    )
}
