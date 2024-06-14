import React, { useEffect, useState } from 'react'
import Product from '../components/Product'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loggedInUserState, productsState, userState } from '../atom';
import { productProps } from './AddProduct';

function Products() {
    const user = useRecoilValue(userState)
    const [items, setItems] = useState<productProps[]>([]);
    const loggedInUser = useRecoilValue(loggedInUserState)
    const [allProducts, setAllProducts] = useRecoilState(productsState)

    useEffect(() => {
        const fetchDocs = async () => {
          try {
            // const parentDocRef = doc(db, "users", user.uid);
    
            const collectionRef = collection(db, "products");
            const filteredCollectionRef = query(collectionRef, where("userId", "==", `${user.uid}`));
    
            const unsubscribe = onSnapshot(filteredCollectionRef, (querySnapshot) => {
              const products: productProps[] = [];
              querySnapshot.forEach((doc) => {
                products.push({
                    id: doc.id,
                    product_name: doc.data().product_name,
                    product_description: doc.data().product_description,
                    product_price: doc.data().product_price,
                    product_status: doc.data().product_status,
                    image_Url: doc.data().image_Url,
                    userId: doc.data().userId,
                    counter_offer: doc.data().counter_offer,
                    address: doc.data().address,
                    city: doc.data().city,
                    phone_number: doc.data().phone_number
                });
              });
              setItems(products);
            });
        
            // Unsubscribe from the listener when the component unmounts
            return () => unsubscribe();
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchDocs();
      }, []);

      useEffect(() => {
        const fetchAll = async () => {
          try {
            // const parentDocRef = doc(db, "users", user.uid);
    
            const collectionRef = collection(db, "products");
            const filteredCollectionRef = query(collectionRef);
    
            const unsubscribe = onSnapshot(filteredCollectionRef, (querySnapshot) => {
              const products: productProps[] = [];
              querySnapshot.forEach((doc) => {
                products.push({
                    id: doc.id,
                    product_name: doc.data().product_name,
                    product_description: doc.data().product_description,
                    product_price: doc.data().product_price,
                    product_status: doc.data().product_status,
                    image_Url: doc.data().image_Url,
                    userId: doc.data().userId,
                    counter_offer: doc.data().counter_offer,
                    address: doc.data().address,
                    city: doc.data().city,
                    phone_number: doc.data().phone_number
                });
              });
              setAllProducts(products);
            });
        
            // Unsubscribe from the listener when the component unmounts
            return () => unsubscribe();
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchAll();
      }, []);

      const UserView = () => {
        return (
            <div className='flex flex-wrap'>
            {items.length > 0 ? (
            items.map((item) => {
                console.log(item)
              return (
                <div className='bg-gray-50 flex flex-col items-center justify-center mr-10'>
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

                  {/* <IconButton>
                  <DeleteIcon onClick={() => handleDeleteDocument(item.id)} className='text-gray-500'/>
                  </IconButton> */}
                </div>
              
              )
            })
          ): <h1>No Products yet</h1>}
            </div>
        )
      }

      const AdminView = () => {
        return (
            <div className='flex flex-wrap'>
            {allProducts.length > 0 ? (
            allProducts.map((item) => {
                console.log(item)
              return (
                <div className='bg-gray-50 flex flex-col items-center justify-center mr-10'>
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

                  {/* <IconButton>
                  <DeleteIcon onClick={() => handleDeleteDocument(item.id)} className='text-gray-500'/>
                  </IconButton> */}
                </div>
              
              )
            })
          ): <h1>No Products yet</h1>}
            </div>
        )
      }
    

  return (
    <div>
        <h1 className='text-slate-800 text-center text-2xl mt-10 mb-10'>Submitted Products</h1>
        {loggedInUser.length > 0 && loggedInUser[0].Role === 'user' ? <UserView /> : <AdminView />}

    </div>
  )
}

export default Products