import  {React } from 'react'
import Login from './Login';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const Body = () => {

const appRouter = createBrowserRouter([
    {
        path:"/",
        element:<Login/>
    },
   
]);

return ( <RouterProvider router={appRouter} />)

}

export default Body;