import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/devTreeAPI";
import DevTree from "../components/DevTree";

export default function AppLayout() {

    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 1,
        refetchOnWindowFocus: false
    })

    if(isLoading) return 'cargando...'
    if(isError) {
        return <Navigate to={'/auth/login'}/>
    }
    
    
    if(data) return (
        <DevTree data={data}/>
    )
}