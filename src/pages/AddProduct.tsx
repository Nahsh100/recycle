import { addDoc, collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { deleteDoc } from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useRecoilValue } from 'recoil';
import { userState } from '../atom';
import Product from '../components/Product';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



export type productProps = {
    id: string,
    product_name: string,
    product_description: string,
    product_price: string,
    product_status: string,
    image_Url: string,
    userId: string,
    counter_offer: string,
    address: string,
    city: string,
    phone_number: string
}

type categoryProps = {
    id: string,
    category_name: string
}

function AddProduct() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [items, setItems] = useState<productProps[]>([]);
  const [categories, setCategories] = useState<categoryProps[]>([])
const storageRef = ref(storage, 'products/');
const [uploadPercentage, setUploadPercentage] = useState<number | null>(null)
const [isDeleteIconShown, setIsDeleteIconShown] = useState(true)
const [product_name, setProductName] = useState('')
const [product_description, setProductDescription] = useState('')
const [product_price, setProductPrice] = useState('')
const [product_status, setProductStatus] = useState('')
const [errorMessage, setErrorMessage] = useState('')
const user = useRecoilValue(userState)
const [category, setCategory] = React.useState('');
const [city, setCity] = useState('')
const [phoneNumber, setPhoneNumber] = useState('')
const [address, setAddress] = useState('')

const handleChange = (event: SelectChangeEvent) => {
  setCategory(event.target.value as string);
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(selectedImage);
    }
  };

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
                city: doc.data().city,
                address: doc.data().address,
                phone_number: doc.data().phone_number,
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
    const fetchCategories = async () => {
        try {
    
            const collectionRef = collection(db, "categories");
            const filteredCollectionRef = query(collectionRef);
    
            const unsubscribe = onSnapshot(filteredCollectionRef, (querySnapshot) => {
              const categories: categoryProps[] = [];
              querySnapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    category_name: doc.data().category_name,
                });
              });
              setCategories(categories);
            });
        
            // Unsubscribe from the listener when the component unmounts
            return () => unsubscribe();
          } catch (error) {
            console.log(error);
          }
    }
    fetchCategories()
  },[])

 

  const handleImageUpload = async () => {
    if (!image || !product_name || !product_description || !product_price || !category || !city || !phoneNumber || !address ) {
      setErrorMessage('Please make sure an image is selected and all fields are filled in.')
      return;
    }
    try {
      const imageRef = ref(storageRef, image.name);
      const uploadTask = uploadBytesResumable(imageRef, image);
    
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadPercentage(progress);
        },
        (error) => {
          console.log(error)
        },
        () => {
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // const parentDocRef = doc(db, "users", user.uid);
            addDoc(collection(db, "products"), {
              product_name,
              product_description,
              product_price,
              product_status: 'Pending Review',
              image_Url: downloadURL,
              category,
              userId: user.uid,
              counter_offer: '',
              city,
              address,
              phone_number: phoneNumber
            });
            console.log(downloadURL)
            setImage(null);
            setPreviewUrl(null)
            setProductDescription('')
            setProductName('')
            setProductPrice('')
            setCity('')
            setPhoneNumber('')
            setAddress('')
          setUploadPercentage(null);
          });
        }
      );
    }catch (error) {
        alert(error)
    }
  
   
  };

  const handleDeleteDocument = async (documentId: string) => {
    const parentDocRef = doc(db, "users", user.uid);
    try {
      await deleteDoc(doc(parentDocRef, "products", documentId));
      console.log("Document deleted successfully");
    } catch (error) {
      console.log("Error deleting document: ", error);
    }
  };

  return (
    <div className='p-5'>
      <h1 className='text-2xl font-semibold mb-4'>Add Product</h1>
      <hr/>
      <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className='mb-4 mt-10'
      />
      {previewUrl && (
        <div className='mb-5'>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px' }} />
        </div>
      )}
      <div className='flex flex-col space-y-4'>
      <input type="text" placeholder='Enter Product name' 
      className='border border-gray-200 p-2 rounded-md mr-10'
      value={product_name}
      onChange={(e) => setProductName(e.target.value)}
      />
      <input type="text" placeholder='Enter Product Description' 
      className='border border-gray-200 p-2 rounded-md mr-10'
      value={product_description}
      onChange={(e) => setProductDescription(e.target.value)}
      />
       <input type="number" placeholder='Enter Product Price' 
      className='border border-gray-200 p-2 rounded-md mr-10 mb-10'
      value={product_price}
      onChange={(e) => setProductPrice(e.target.value)}
      pattern="\d*"
      />
       <input type="text" placeholder='Enter City' 
      className='border border-gray-200 p-2 rounded-md mr-10 mb-10'
      value={city}
      onChange={(e) => setCity(e.target.value)}
      />
       <input type="text" placeholder='Enter Phone Number' 
      className='border border-gray-200 p-2 rounded-md mr-10 mb-10'
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      />
       <input type="text" placeholder='Enter Address' 
      className='border border-gray-200 p-2 rounded-md mr-10 mb-10'
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      />
      </div>
      <Box sx={{ minWidth: 120, marginTop: 4 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Categories"
          onChange={handleChange}
        >
            {categories.length > 0 && categories.map((category) => (
              <MenuItem key={category.id} value={category.category_name}>{category.category_name}</MenuItem>
            ))}
         
        </Select>
      </FormControl>
    </Box>
      
      
      <button 
      disabled={!image || !product_name || !product_description || !product_price || !category}
      onClick={handleImageUpload}
      className='bg-orange-500 p-2 mt-2 text-white rounded-md w-20'>
        Submit
      </button>

      <div>
  {uploadPercentage !== null && (
    <div>
      Upload progress: {uploadPercentage}%
    </div>
  )}
</div>
      {errorMessage && <h3 className='text-center text-red-500'>{errorMessage}</h3>}
      <hr className='mt-10 mb-10'/>

        <div className='flex flex-wrap space-x-4'>
          {items.length > 0 ? (
            items.map((item) => {
                console.log(item)
              return (
                <div className='bg-gray-50 flex flex-col items-center justify-center mr-5'>
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
    </div>
    </div>
  )
}

export default AddProduct