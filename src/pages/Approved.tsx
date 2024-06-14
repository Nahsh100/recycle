import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { loggedInUserState, productsState } from '../atom'
import { productProps } from './AddProduct'
import Product from '../components/Product'

function Approved() {
    const products = useRecoilValue(productsState)
    const [filteredProductsAdmin, setFilteredProductsAdmin] = useState<productProps[]>([])
    const [filteredProductsUser, setFilteredProductsUser] = useState<productProps[]>([])
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState)
    const [filter, setFilter] = useState<productProps[]>([])

    
    useEffect(() => {
        console.log(products)
        const filteredAdmin = products.filter((product) => product.product_status === 'Closed Deal')
        const filteredUser = products.filter((product) => product.product_status === 'Closed Deal' && product.userId === loggedInUser[0].id )
        if(loggedInUser[0].Role === 'admin') {
            setFilter(filteredAdmin)
        }else{
            setFilter(filteredUser)
        }
        // setFilteredProductsAdmin(filteredAdmin)
        // setFilteredProductsUser(filteredUser)
    },[products])

   


  return (
    <div>
        <h1 className='text-slate-800 text-center text-2xl mt-10 mb-10'>Closed Deals</h1>
        <div className='flex flex-wrap space-x-3'>

        {filter.length > 0 ? filter.map(item => (
                   <Product product_name={item.product_name}
                   product_description={item.product_description}
                   product_price={item.product_price}
                   product_status={item.product_status}
                   image_url={item.image_Url}
                   productId={item.id}
                   counter_offer={item.counter_offer}
                   city={item.city}
                   address={item.address}
                   phone_number={item.phone_number}
                   />
      
          
        )): <h2>No Products Approved yet</h2>}
                    </div>

    </div>
  )
}

export default Approved